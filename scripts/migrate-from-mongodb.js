/* eslint-disable no-console */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";
import pg from "pg";

const { Pool } = pg;

const MONGO_URI = process.env.MONGO_URI;
const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_DB_HOST = process.env.SUPABASE_DB_HOST;
const SUPABASE_DB_PORT = process.env.SUPABASE_DB_PORT || "5432";
const SUPABASE_DB_USER = process.env.SUPABASE_DB_USER || "postgres";
const SUPABASE_DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;
const SUPABASE_DB_NAME = process.env.SUPABASE_DB_NAME || "postgres";

const useIndividualFields = SUPABASE_DB_HOST && SUPABASE_DB_PASSWORD;

if (!MONGO_URI) {
  console.error("\nMissing MONGO_URI in .env\n");
  process.exit(1);
}
if (!DATABASE_URL && !useIndividualFields) {
  console.error(
    "\nProvide either DATABASE_URL, or the individual fields SUPABASE_DB_HOST + SUPABASE_DB_PASSWORD (and optionally PORT/USER/NAME) in .env\n"
  );
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const RESET_PASSWORDS = args.has("--reset-passwords");
const DRY_RUN = args.has("--dry-run");

const PLACEHOLDER_HASH =
  "$2a$10$placeholderhashplaceholderhashplaceholderhashplaceholderhash";

const mongo = new MongoClient(MONGO_URI);
const pool = new Pool(
  useIndividualFields
    ? {
        host: SUPABASE_DB_HOST,
        port: Number(SUPABASE_DB_PORT),
        user: SUPABASE_DB_USER,
        password: SUPABASE_DB_PASSWORD,
        database: SUPABASE_DB_NAME,
        ssl: { rejectUnauthorized: false },
      }
    : {
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
);

// Maps MongoDB ObjectId (string) -> new Supabase UUID
const userIdMap = new Map();
const productIdMap = new Map();

const log = (...a) => console.log(...a);
const banner = (title) => log(`\n=== ${title} ===`);

// ---------------------------------------------------------------------------
// Users (regular customers)
// ---------------------------------------------------------------------------

async function migrateUsers(mongoDb, pg) {
  banner("Users");
  const col = mongoDb.collection("users");
  const cursor = col.find();
  let inserted = 0;
  let skipped = 0;

  while (await cursor.hasNext()) {
    const u = await cursor.next();
    const email = (u.email || "").toLowerCase().trim();
    if (!email) {
      skipped++;
      continue;
    }

    const { rows } = await pg.query(
      "select id from auth.users where lower(email) = $1",
      [email]
    );
    if (rows[0]) {
      userIdMap.set(u._id.toString(), rows[0].id);
      skipped++;
      continue;
    }

    const passwordHash =
      RESET_PASSWORDS || !u.password ? PLACEHOLDER_HASH : u.password;

    const newId = DRY_RUN ? randomUUID() : (await pg.query("select gen_random_uuid() as id")).rows[0].id;

    if (DRY_RUN) {
      userIdMap.set(u._id.toString(), newId);
      inserted++;
      continue;
    }

    await pg.query(
      `insert into auth.users (
         instance_id, id, aud, role, email,
         encrypted_password, email_confirmed_at,
         raw_app_meta_data, raw_user_meta_data,
         created_at, updated_at,
         confirmation_token, recovery_token, email_change_token_new, email_change
       ) values (
         '00000000-0000-0000-0000-000000000000', $1, 'authenticated', 'authenticated', $2,
         $3, now(),
         '{"provider":"email","providers":["email"]}'::jsonb, $4::jsonb,
         $5, now(), '', '', '', ''
       )`,
      [
        newId,
        email,
        passwordHash,
        JSON.stringify({
          first_name: u.firstName || "",
          last_name: u.lastName || "",
        }),
        u.dateJoined || u.createdAt || new Date(),
      ]
    );

    await pg.query(
      `insert into auth.identities (
         id, user_id, identity_data, provider, provider_id,
         last_sign_in_at, created_at, updated_at
       ) values (
         gen_random_uuid(), $1, $2::jsonb, 'email', $3, null, now(), now()
       )`,
      [newId, JSON.stringify({ sub: newId, email }), email]
    );

    // The profile row was auto-created by the auth-trigger; fill in extra fields.
    await pg.query(
      `update public.profiles
          set first_name = $2,
              last_name  = $3,
              address    = $4,
              city       = $5,
              state      = $6,
              country    = $7,
              zip        = $8
        where id = $1`,
      [
        newId,
        u.firstName || "",
        u.lastName || "",
        u.address || null,
        u.city || null,
        u.state || null,
        u.country || null,
        u.zip || null,
      ]
    );

    userIdMap.set(u._id.toString(), newId);
    inserted++;
  }

  log(`  ${inserted} inserted, ${skipped} already existed (or skipped)`);
}

// ---------------------------------------------------------------------------
// Admins (separate collection in Mongo) -> auth user + profile.role
// ---------------------------------------------------------------------------

async function migrateAdmins(mongoDb, pg) {
  banner("Admins");
  const col = mongoDb.collection("admins");
  const cursor = col.find();
  let inserted = 0;
  let promoted = 0;

  while (await cursor.hasNext()) {
    const a = await cursor.next();
    const email = (a.email || "").toLowerCase().trim();
    if (!email) continue;
    const role = a.role === "superadmin" ? "super_admin" : "admin";

    let userId;
    const { rows } = await pg.query(
      "select id from auth.users where lower(email) = $1",
      [email]
    );

    if (rows[0]) {
      userId = rows[0].id;
    } else if (DRY_RUN) {
      userId = randomUUID();
      inserted++;
    } else {
      const { rows: idRows } = await pg.query(
        "select gen_random_uuid() as id"
      );
      userId = idRows[0].id;

      const passwordHash =
        RESET_PASSWORDS || !a.password ? PLACEHOLDER_HASH : a.password;

      await pg.query(
        `insert into auth.users (
           instance_id, id, aud, role, email,
           encrypted_password, email_confirmed_at,
           raw_app_meta_data, raw_user_meta_data,
           created_at, updated_at,
           confirmation_token, recovery_token, email_change_token_new, email_change
         ) values (
           '00000000-0000-0000-0000-000000000000', $1, 'authenticated', 'authenticated', $2,
           $3, now(),
           '{"provider":"email","providers":["email"]}'::jsonb, $4::jsonb,
           $5, now(), '', '', '', ''
         )`,
        [
          userId,
          email,
          passwordHash,
          JSON.stringify({ first_name: "Admin", last_name: "" }),
          a.createdAt || new Date(),
        ]
      );

      await pg.query(
        `insert into auth.identities (
           id, user_id, identity_data, provider, provider_id,
           last_sign_in_at, created_at, updated_at
         ) values (
           gen_random_uuid(), $1, $2::jsonb, 'email', $3, null, now(), now()
         )`,
        [userId, JSON.stringify({ sub: userId, email }), email]
      );

      inserted++;
    }

    if (!DRY_RUN) {
      await pg.query(`update public.profiles set role = $2 where id = $1`, [
        userId,
        role,
      ]);
    }
    promoted++;
  }

  log(`  ${inserted} new admin users, ${promoted} role-promoted`);
}

// ---------------------------------------------------------------------------
// Products (+ media, + reviews from `comments` and `ratedBy`)
// ---------------------------------------------------------------------------

async function migrateProducts(mongoDb, pg) {
  banner("Products");
  const col = mongoDb.collection("products");
  const cursor = col.find();
  let inserted = 0;
  let mediaInserted = 0;
  let reviewsInserted = 0;

  while (await cursor.hasNext()) {
    const p = await cursor.next();

    let newProductId;
    if (DRY_RUN) {
      newProductId = randomUUID();
      productIdMap.set(p._id.toString(), newProductId);
      inserted++;

      if (Array.isArray(p.media)) {
        for (const m of p.media) if (m?.url) mediaInserted++;
      }
      if (Array.isArray(p.ratedBy)) {
        for (const uid of p.ratedBy) {
          if (userIdMap.get(uid.toString())) reviewsInserted++;
        }
      }
      if (Array.isArray(p.comments)) {
        for (const c of p.comments) {
          if (userIdMap.get((c.user || "").toString())) reviewsInserted++;
        }
      }
      continue;
    }

    const { rows } = await pg.query(
      `insert into public.products (
         name, categories, price,
         short_description, full_description,
         available_quantity, hot_deal,
         created_at, updated_at
       ) values ($1, $2::product_category[], $3, $4, $5, $6, $7, $8, $9)
       returning id`,
      [
        p.name,
        Array.isArray(p.categories) ? p.categories : [],
        Number(p.price || 0),
        p.shortDescription || "",
        p.fullDescription || "",
        Number(p.availableQuantity || 0),
        !!p.hotDeal,
        p.createdAt || new Date(),
        p.updatedAt || new Date(),
      ]
    );
    newProductId = rows[0].id;
    productIdMap.set(p._id.toString(), newProductId);
    inserted++;

    // Media (Cloudinary URLs preserved as-is)
    if (Array.isArray(p.media)) {
      for (let i = 0; i < p.media.length; i++) {
        const m = p.media[i];
        if (!m?.url) continue;
        await pg.query(
          `insert into public.product_media (product_id, url, public_id, position)
           values ($1, $2, $3, $4)`,
          [newProductId, m.url, m.public_id || `cloudinary:${m.url}`, i]
        );
        mediaInserted++;
      }
    }

    // ratedBy -> 5-star like-style reviews (de-duped via PK on conflict)
    if (Array.isArray(p.ratedBy)) {
      for (const uid of p.ratedBy) {
        const newUserId = userIdMap.get(uid.toString());
        if (!newUserId) continue;
        await pg.query(
          `insert into public.product_reviews (product_id, user_id, rating)
           values ($1, $2, 5)
           on conflict (product_id, user_id) do nothing`,
          [newProductId, newUserId]
        );
        reviewsInserted++;
      }
    }

    // Full comments (with rating + text) overwrite the like-row if it exists
    if (Array.isArray(p.comments)) {
      for (const c of p.comments) {
        const newUserId = userIdMap.get((c.user || "").toString());
        if (!newUserId) continue;
        await pg.query(
          `insert into public.product_reviews (product_id, user_id, rating, comment, created_at)
           values ($1, $2, $3, $4, $5)
           on conflict (product_id, user_id) do update
             set rating = excluded.rating,
                 comment = excluded.comment,
                 updated_at = now()`,
          [
            newProductId,
            newUserId,
            Math.max(1, Math.min(5, Number(c.rating) || 5)),
            c.comment || null,
            c.createdAt || new Date(),
          ]
        );
        reviewsInserted++;
      }
    }
  }

  log(`  ${inserted} products, ${mediaInserted} media, ${reviewsInserted} reviews`);
}

// ---------------------------------------------------------------------------
// Orders (+ items)
// ---------------------------------------------------------------------------

async function migrateOrders(mongoDb, pg) {
  banner("Orders");
  const col = mongoDb.collection("orders");
  const cursor = col.find();
  let inserted = 0;
  let itemsInserted = 0;
  let skipped = 0;

  while (await cursor.hasNext()) {
    const o = await cursor.next();
    const newUserId = userIdMap.get((o.userId || "").toString());
    if (!newUserId) {
      skipped++;
      continue;
    }
    if (DRY_RUN) {
      inserted++;
      if (Array.isArray(o.items)) {
        for (const it of o.items) {
          if (productIdMap.get((it.productId || "").toString())) itemsInserted++;
        }
      }
      continue;
    }

    const sa = o.shippingAddress || {};

    const { rows } = await pg.query(
      `insert into public.orders (
         user_id, total_amount,
         shipping_full_name, shipping_street, shipping_city,
         shipping_state, shipping_zip, shipping_country,
         payment_method, status, payment_status, transaction_id,
         created_at, updated_at
       ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       returning id`,
      [
        newUserId,
        Number(o.totalAmount || 0),
        sa.fullName || "",
        sa.street || "",
        sa.city || "",
        sa.state || "",
        sa.zipCode || "",
        sa.country || "",
        o.paymentMethod || "pay_on_delivery",
        o.status || "Pending Payment",
        o.paymentStatus || "Pending",
        o.transactionId || null,
        o.createdAt || new Date(),
        o.updatedAt || new Date(),
      ]
    );
    const newOrderId = rows[0].id;
    inserted++;

    if (Array.isArray(o.items)) {
      for (const it of o.items) {
        const newProductId = productIdMap.get((it.productId || "").toString());
        if (!newProductId) continue;
        await pg.query(
          `insert into public.order_items (order_id, product_id, name, quantity, price)
           values ($1, $2, $3, $4, $5)`,
          [
            newOrderId,
            newProductId,
            it.name || "Unknown",
            Math.max(1, Number(it.quantity) || 1),
            Number(it.price || 0),
          ]
        );
        itemsInserted++;
      }
    }
  }

  log(`  ${inserted} orders, ${itemsInserted} items, ${skipped} skipped (orphaned user)`);
}

// ---------------------------------------------------------------------------

async function main() {
  log(`MongoDB -> Supabase migration${DRY_RUN ? " (DRY RUN)" : ""}${RESET_PASSWORDS ? " [passwords reset]" : ""}`);
  await mongo.connect();
  const mongoDb = mongo.db();
  const pgClient = await pool.connect();

  try {
    if (!DRY_RUN) await pgClient.query("BEGIN");

    await migrateUsers(mongoDb, pgClient);
    await migrateAdmins(mongoDb, pgClient);
    await migrateProducts(mongoDb, pgClient);
    await migrateOrders(mongoDb, pgClient);

    if (!DRY_RUN) await pgClient.query("COMMIT");
    banner("Done");
    if (DRY_RUN) log("Dry run — nothing was written. Re-run without --dry-run to commit.");
  } catch (err) {
    if (!DRY_RUN) await pgClient.query("ROLLBACK");
    console.error("\nMigration failed; rolled back.\n", err);
    process.exitCode = 1;
  } finally {
    pgClient.release();
    await mongo.close();
    await pool.end();
  }
}

main();
