import { supabase } from "../lib/supabase";

const BUCKET = "product-media";

const PRODUCT_SELECT_WITH_RELATIONS = `
  id, name, categories, price, rating, rating_count,
  short_description, full_description, available_quantity, hot_deal,
  created_at, updated_at,
  product_media ( id, url, public_id, position )
`;

// Maps a Supabase row (snake_case + relations) to the JS shape used across the app.
// `_id` is preserved so existing components keep working without rewrites.
const normalizeProduct = (row) => {
  if (!row) return null;
  const media = (row.product_media || [])
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((m) => ({ _id: m.id, url: m.url, public_id: m.public_id }));

  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    categories: row.categories || [],
    price: Number(row.price),
    rating: Number(row.rating || 0),
    ratingCount: row.rating_count ?? 0,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    availableQuantity: row.available_quantity,
    hotDeal: row.hot_deal,
    media,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const safeFilename = (name) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);

// =============================================================================
// READ
// =============================================================================

export const fetchProductsPaginated = async ({ page = 1, limit = 10 } = {}) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_RELATIONS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const totalProducts = count || 0;
  return {
    products: (data || []).map(normalizeProduct),
    totalProducts,
    totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
    currentPage: page,
  };
};

export const searchProductsByName = async ({ query, page = 1, limit = 10 }) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_RELATIONS, { count: "exact" })
    .ilike("name", `%${query}%`)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const totalProducts = count || 0;
  return {
    products: (data || []).map(normalizeProduct),
    totalProducts,
    totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
    currentPage: page,
  };
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_RELATIONS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return normalizeProduct(data);
};

export const getHotDeals = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_RELATIONS)
    .eq("hot_deal", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeProduct);
};

export const getProductsByCategory = async (categoryName) => {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_RELATIONS)
    .contains("categories", [categoryName])
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeProduct);
};

// =============================================================================
// REVIEWS / RATING (toggle a 5-star like)
// =============================================================================

export const hasUserRated = async (productId, userId) => {
  const { data, error } = await supabase
    .from("product_reviews")
    .select("user_id")
    .eq("product_id", productId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
};

export const toggleProductRating = async (productId, userId) => {
  const existing = await hasUserRated(productId, userId);

  if (existing) {
    const { error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("product_id", productId)
      .eq("user_id", userId);
    if (error) throw error;
    return { rated: false };
  }

  const { error } = await supabase
    .from("product_reviews")
    .insert({ product_id: productId, user_id: userId, rating: 5 });
  if (error) throw error;
  return { rated: true };
};

// =============================================================================
// ADMIN — create / update / delete
// =============================================================================

const uploadMediaFiles = async (productId, files) => {
  const uploaded = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = `products/${productId}/${Date.now()}-${i}-${safeFilename(
      file.name
    )}`;

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type });
    if (uploadErr) throw uploadErr;

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    uploaded.push({ url: publicUrl, public_id: path });
  }
  return uploaded;
};

export const createProduct = async ({
  name,
  price,
  availableQuantity,
  shortDescription,
  fullDescription,
  hotDeal,
  categories,
  files = [],
}) => {
  const { data: created, error } = await supabase
    .from("products")
    .insert({
      name,
      price,
      available_quantity: Number(availableQuantity || 0),
      short_description: shortDescription,
      full_description: fullDescription,
      hot_deal: !!hotDeal,
      categories: Array.isArray(categories) ? categories : [categories],
    })
    .select("id")
    .single();
  if (error) throw error;

  if (files.length > 0) {
    const uploaded = await uploadMediaFiles(created.id, files);
    if (uploaded.length > 0) {
      const { error: mediaErr } = await supabase.from("product_media").insert(
        uploaded.map((m, i) => ({
          product_id: created.id,
          url: m.url,
          public_id: m.public_id,
          position: i,
        }))
      );
      if (mediaErr) throw mediaErr;
    }
  }

  return getProductById(created.id);
};

export const updateProduct = async (
  productId,
  {
    name,
    price,
    availableQuantity,
    shortDescription,
    fullDescription,
    hotDeal,
    categories,
    files = [],
    keepMediaIds = [],
  }
) => {
  const { error: updErr } = await supabase
    .from("products")
    .update({
      name,
      price,
      available_quantity: Number(availableQuantity || 0),
      short_description: shortDescription,
      full_description: fullDescription,
      hot_deal: !!hotDeal,
      categories: Array.isArray(categories) ? categories : [categories],
    })
    .eq("id", productId);
  if (updErr) throw updErr;

  // Drop media rows that are no longer kept (and their objects in storage).
  const { data: existing, error: fetchErr } = await supabase
    .from("product_media")
    .select("id, public_id")
    .eq("product_id", productId);
  if (fetchErr) throw fetchErr;

  const toRemove = (existing || []).filter(
    (m) => !keepMediaIds.includes(m.id)
  );
  if (toRemove.length > 0) {
    const paths = toRemove.map((m) => m.public_id).filter(Boolean);
    if (paths.length > 0) {
      await supabase.storage.from(BUCKET).remove(paths);
    }
    await supabase
      .from("product_media")
      .delete()
      .in(
        "id",
        toRemove.map((m) => m.id)
      );
  }

  // Upload new files.
  if (files.length > 0) {
    const uploaded = await uploadMediaFiles(productId, files);
    if (uploaded.length > 0) {
      const { error: mediaErr } = await supabase.from("product_media").insert(
        uploaded.map((m, i) => ({
          product_id: productId,
          url: m.url,
          public_id: m.public_id,
          position: keepMediaIds.length + i,
        }))
      );
      if (mediaErr) throw mediaErr;
    }
  }

  return getProductById(productId);
};

export const deleteProduct = async (productId) => {
  // Pull media paths first so we can clean storage.
  const { data: media } = await supabase
    .from("product_media")
    .select("public_id")
    .eq("product_id", productId);

  const paths = (media || []).map((m) => m.public_id).filter(Boolean);
  if (paths.length > 0) {
    await supabase.storage.from(BUCKET).remove(paths);
  }

  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw error;
};
