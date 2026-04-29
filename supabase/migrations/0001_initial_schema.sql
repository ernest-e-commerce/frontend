-- =============================================================================
-- EarnestMall — initial schema (M0)
-- Mirrors the Mongoose models in /server/models with Postgres-native types.
-- RLS policies live in 0002_rls_policies.sql (added in M1 with auth migration).
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists pg_trgm;

-- =============================================================================
-- Enums
-- =============================================================================

create type user_role as enum ('user', 'admin', 'super_admin');

create type product_category as enum (
  'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports & Outdoors',
  'Health & Beauty', 'Toys & Games', 'Automotive', 'Jewelry & Watches',
  'Groceries', 'Pet Supplies', 'Office Products', 'Musical Instruments', 'Handmade'
);

create type order_status as enum (
  'Pending Payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
);

create type payment_status as enum ('Pending', 'Paid', 'Failed');

create type payment_method as enum ('bank_transfer', 'pay_on_delivery');

-- =============================================================================
-- profiles — extends auth.users (one-to-one)
-- Replaces server/models/users.model.js
-- email + password + email_confirmed_at live in auth.users
-- =============================================================================

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  first_name   text not null,
  last_name    text not null,
  address      text,
  country      text,
  state        text,
  city         text,
  zip          text,
  role         user_role not null default 'user',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index profiles_role_idx on public.profiles(role);

-- =============================================================================
-- products
-- Replaces server/models/product.model.js
-- =============================================================================

create table public.products (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  categories          product_category[] not null default '{}',
  price               numeric(12,2) not null check (price >= 0),
  rating              numeric(3,2) not null default 0 check (rating >= 0 and rating <= 5),
  short_description   text not null,
  full_description    text not null,
  available_quantity  integer not null default 0 check (available_quantity >= 0),
  hot_deal            boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index products_categories_gin on public.products using gin (categories);
create index products_hot_deal_idx on public.products(hot_deal) where hot_deal = true;
create index products_name_trgm on public.products using gin (name gin_trgm_ops);

-- =============================================================================
-- product_media — separate table per asset (replaces embedded mediaSchema)
-- public_id retained so existing Cloudinary assets keep working during cutover
-- =============================================================================

create table public.product_media (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  url         text not null,
  public_id   text not null,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index product_media_product_idx on public.product_media(product_id, position);

-- =============================================================================
-- product_reviews — merges Mongoose `ratedBy` + `comments`
-- One review per (product, user); rating required, comment optional
-- =============================================================================

create table public.product_reviews (
  product_id  uuid not null references public.products(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  rating      integer not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (product_id, user_id)
);

create index product_reviews_user_idx on public.product_reviews(user_id);

-- =============================================================================
-- orders + order_items
-- Replaces server/models/order.model.js
-- Shipping address flattened into order columns (denormalized snapshot)
-- =============================================================================

create table public.orders (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete restrict,
  total_amount          numeric(12,2) not null check (total_amount >= 0),
  shipping_full_name    text not null,
  shipping_street       text not null,
  shipping_city         text not null,
  shipping_state        text not null,
  shipping_zip          text not null,
  shipping_country      text not null,
  payment_method        payment_method not null,
  status                order_status not null default 'Pending Payment',
  payment_status        payment_status not null default 'Pending',
  transaction_id        text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index orders_user_idx on public.orders(user_id, created_at desc);
create index orders_status_idx on public.orders(status);

create table public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete restrict,
  name        text not null,
  quantity    integer not null check (quantity >= 1),
  price       numeric(12,2) not null check (price >= 0)
);

create index order_items_order_idx on public.order_items(order_id);
create index order_items_product_idx on public.order_items(product_id);

-- =============================================================================
-- Triggers — keep updated_at fresh
-- =============================================================================

create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.tg_set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.tg_set_updated_at();

create trigger product_reviews_set_updated_at
before update on public.product_reviews
for each row execute function public.tg_set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.tg_set_updated_at();

-- =============================================================================
-- Trigger — auto-create profile when a user signs up via auth.users
-- first_name/last_name come from raw_user_meta_data passed during signUp()
-- =============================================================================

create or replace function public.tg_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.tg_handle_new_user();

-- =============================================================================
-- Trigger — recompute products.rating from product_reviews on change
-- =============================================================================

create or replace function public.tg_refresh_product_rating()
returns trigger
language plpgsql
as $$
declare
  target_product uuid;
begin
  target_product := coalesce(new.product_id, old.product_id);

  update public.products
     set rating = coalesce((
       select round(avg(rating)::numeric, 2)
       from public.product_reviews
       where product_id = target_product
     ), 0)
   where id = target_product;

  return null;
end;
$$;

create trigger product_reviews_refresh_rating
after insert or update or delete on public.product_reviews
for each row execute function public.tg_refresh_product_rating();
