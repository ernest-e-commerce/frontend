-- =============================================================================
-- EarnestMall — orders + order_items RLS + atomic place_order RPC (M3)
-- =============================================================================

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Customers can read their own orders.
create policy orders_user_select
  on public.orders for select to authenticated
  using (auth.uid() = user_id);

-- Admins can read every order.
create policy orders_admin_select
  on public.orders for select to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

-- Admins can update orders (status, payment_status, transaction_id).
create policy orders_admin_update
  on public.orders for update to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

-- Customers can read items from their own orders.
create policy order_items_user_select
  on public.order_items for select to authenticated
  using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- Admins can read every order item.
create policy order_items_admin_select
  on public.order_items for select to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

-- Note: there is no INSERT policy on orders / order_items. All inserts must go
-- through the place_order RPC below, which runs as security definer.

-- =============================================================================
-- place_order RPC — atomic order placement
-- - Validates stock (with row lock)
-- - Decrements stock
-- - Computes total_amount server-side from CURRENT product prices
-- - Snapshots price + name into order_items so price changes don't rewrite history
-- =============================================================================

create or replace function public.place_order(
  p_items jsonb,             -- [{ "product_id": "<uuid>", "quantity": <int> }, ...]
  p_shipping jsonb,          -- { full_name, street, city, state, zip, country }
  p_payment_method text      -- 'bank_transfer' or 'pay_on_delivery'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id  uuid := auth.uid();
  v_order_id uuid;
  v_total    numeric(12,2) := 0;
  v_item     record;
  v_product  record;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  -- Validate + lock + decrement stock per item, accumulate total.
  for v_item in
    select
      (elem->>'product_id')::uuid as product_id,
      (elem->>'quantity')::integer as quantity
    from jsonb_array_elements(p_items) as elem
  loop
    if v_item.quantity is null or v_item.quantity < 1 then
      raise exception 'Invalid quantity for product %', v_item.product_id;
    end if;

    select id, name, price, available_quantity
      into v_product
      from public.products
     where id = v_item.product_id
       for update;

    if not found then
      raise exception 'Product % not found', v_item.product_id;
    end if;

    if v_product.available_quantity < v_item.quantity then
      raise exception 'Insufficient stock for "%"', v_product.name;
    end if;

    v_total := v_total + (v_product.price * v_item.quantity);

    update public.products
       set available_quantity = available_quantity - v_item.quantity
     where id = v_item.product_id;
  end loop;

  -- Create the order shell.
  insert into public.orders (
    user_id, total_amount,
    shipping_full_name, shipping_street, shipping_city,
    shipping_state, shipping_zip, shipping_country,
    payment_method
  ) values (
    v_user_id, v_total,
    coalesce(p_shipping->>'full_name', ''),
    coalesce(p_shipping->>'street', ''),
    coalesce(p_shipping->>'city', ''),
    coalesce(p_shipping->>'state', ''),
    coalesce(p_shipping->>'zip', ''),
    coalesce(p_shipping->>'country', ''),
    p_payment_method::payment_method
  )
  returning id into v_order_id;

  -- Snapshot product name + price into the line items.
  insert into public.order_items (order_id, product_id, name, quantity, price)
  select
    v_order_id,
    (elem->>'product_id')::uuid,
    p.name,
    (elem->>'quantity')::integer,
    p.price
  from jsonb_array_elements(p_items) as elem
  join public.products p on p.id = (elem->>'product_id')::uuid;

  return v_order_id;
end;
$$;

revoke all on function public.place_order(jsonb, jsonb, text) from public, anon;
grant execute on function public.place_order(jsonb, jsonb, text) to authenticated;
