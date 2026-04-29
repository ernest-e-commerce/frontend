-- =============================================================================
-- EarnestMall — products, product_media, product_reviews RLS + storage bucket (M2)
-- =============================================================================

-- Track number of reviews so the existing "rating count" UX keeps working.
alter table public.products
  add column if not exists rating_count integer not null default 0;

-- Replace the rating-recompute trigger to maintain both average + count.
create or replace function public.tg_refresh_product_rating()
returns trigger
language plpgsql
as $$
declare
  target_product uuid;
  agg_avg numeric(3,2);
  agg_count integer;
begin
  target_product := coalesce(new.product_id, old.product_id);

  select
    coalesce(round(avg(rating)::numeric, 2), 0),
    count(*)
  into agg_avg, agg_count
  from public.product_reviews
  where product_id = target_product;

  update public.products
     set rating = agg_avg,
         rating_count = agg_count
   where id = target_product;

  return null;
end;
$$;

-- =============================================================================
-- products + product_media + product_reviews RLS
-- =============================================================================

alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.product_reviews enable row level security;

-- Public read: products, media, reviews are visible to everyone.
create policy products_public_select
  on public.products for select to anon, authenticated using (true);

create policy product_media_public_select
  on public.product_media for select to anon, authenticated using (true);

create policy product_reviews_public_select
  on public.product_reviews for select to anon, authenticated using (true);

-- Admin write: products + media.
create policy products_admin_insert
  on public.products for insert to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

create policy products_admin_update
  on public.products for update to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

create policy products_admin_delete
  on public.products for delete to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

create policy product_media_admin_insert
  on public.product_media for insert to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

create policy product_media_admin_update
  on public.product_media for update to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

create policy product_media_admin_delete
  on public.product_media for delete to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

-- Reviews: a logged-in user can write/update/delete their OWN review.
create policy product_reviews_user_insert
  on public.product_reviews for insert to authenticated
  with check (auth.uid() = user_id);

create policy product_reviews_user_update
  on public.product_reviews for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy product_reviews_user_delete
  on public.product_reviews for delete to authenticated
  using (auth.uid() = user_id);

-- =============================================================================
-- Storage: product-media bucket (public, admin-managed)
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;

create policy product_media_bucket_public_read
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-media');

create policy product_media_bucket_admin_insert
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'product-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

create policy product_media_bucket_admin_update
  on storage.objects for update to authenticated
  using (
    bucket_id = 'product-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

create policy product_media_bucket_admin_delete
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'product-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );
