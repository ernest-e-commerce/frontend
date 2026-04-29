-- =============================================================================
-- EarnestMall — admin RPCs (M4)
-- All functions are security-definer + admin-gated. No anon access granted.
-- =============================================================================

-- Reusable guard --------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
     where id = auth.uid()
       and role in ('admin', 'super_admin')
  );
$$;

-- Dashboard stats -------------------------------------------------------------

create or replace function public.admin_dashboard_stats()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total_sales  numeric(12,2);
  v_new_orders   integer;
  v_products     integer;
  v_users        integer;
begin
  if not public.is_admin() then
    raise exception 'Access denied';
  end if;

  select coalesce(sum(total_amount), 0)
    into v_total_sales
    from public.orders
   where payment_status = 'Paid';

  select count(*) into v_new_orders
    from public.orders
   where status in ('Pending Payment', 'Processing');

  select count(*) into v_products from public.products;
  select count(*) into v_users from public.profiles where role = 'user';

  return json_build_object(
    'totalSales', v_total_sales,
    'newOrders', v_new_orders,
    'productsListed', v_products,
    'totalUsers', v_users
  );
end;
$$;

-- Admin order list (joined with customer info) --------------------------------

create or replace function public.admin_list_orders()
returns table (
  id uuid,
  user_id uuid,
  total_amount numeric,
  status text,
  payment_status text,
  payment_method text,
  customer_first_name text,
  customer_last_name text,
  customer_email text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Access denied';
  end if;

  return query
  select
    o.id,
    o.user_id,
    o.total_amount,
    o.status::text,
    o.payment_status::text,
    o.payment_method::text,
    p.first_name,
    p.last_name,
    u.email,
    o.created_at
  from public.orders o
  left join public.profiles p on p.id = o.user_id
  left join auth.users u on u.id = o.user_id
  order by o.created_at desc;
end;
$$;

-- Single order with items + customer info ------------------------------------

create or replace function public.admin_get_order(p_order_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result json;
begin
  if not public.is_admin() then
    raise exception 'Access denied';
  end if;

  select json_build_object(
    'id', o.id,
    'user_id', o.user_id,
    'total_amount', o.total_amount,
    'status', o.status,
    'payment_status', o.payment_status,
    'payment_method', o.payment_method,
    'transaction_id', o.transaction_id,
    'shipping_full_name', o.shipping_full_name,
    'shipping_street', o.shipping_street,
    'shipping_city', o.shipping_city,
    'shipping_state', o.shipping_state,
    'shipping_zip', o.shipping_zip,
    'shipping_country', o.shipping_country,
    'created_at', o.created_at,
    'updated_at', o.updated_at,
    'customer', json_build_object(
      'first_name', p.first_name,
      'last_name', p.last_name,
      'email', u.email
    ),
    'items', coalesce((
      select json_agg(json_build_object(
        'id', oi.id,
        'product_id', oi.product_id,
        'name', oi.name,
        'quantity', oi.quantity,
        'price', oi.price,
        'image_url', (
          select pm.url
            from public.product_media pm
           where pm.product_id = oi.product_id
           order by pm.position asc
           limit 1
        )
      ))
      from public.order_items oi
      where oi.order_id = o.id
    ), '[]'::json)
  )
  into v_result
  from public.orders o
  left join public.profiles p on p.id = o.user_id
  left join auth.users u on u.id = o.user_id
  where o.id = p_order_id;

  if v_result is null then
    raise exception 'Order not found';
  end if;

  return v_result;
end;
$$;

-- Admin user list -------------------------------------------------------------

create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  first_name text,
  last_name text,
  role text,
  address text,
  city text,
  state text,
  country text,
  zip text,
  email_confirmed boolean,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Access denied';
  end if;

  return query
  select
    p.id,
    u.email,
    p.first_name,
    p.last_name,
    p.role::text,
    p.address,
    p.city,
    p.state,
    p.country,
    p.zip,
    (u.email_confirmed_at is not null) as email_confirmed,
    p.created_at
  from public.profiles p
  join auth.users u on u.id = p.id
  order by p.created_at desc;
end;
$$;

-- Single user detail ---------------------------------------------------------

create or replace function public.admin_get_user(p_user_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result json;
begin
  if not public.is_admin() then
    raise exception 'Access denied';
  end if;

  select json_build_object(
    'id', p.id,
    'email', u.email,
    'first_name', p.first_name,
    'last_name', p.last_name,
    'role', p.role,
    'address', p.address,
    'city', p.city,
    'state', p.state,
    'country', p.country,
    'zip', p.zip,
    'email_confirmed', (u.email_confirmed_at is not null),
    'created_at', p.created_at
  )
  into v_result
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.id = p_user_id;

  if v_result is null then
    raise exception 'User not found';
  end if;

  return v_result;
end;
$$;

-- Permissions ----------------------------------------------------------------

revoke all on function public.is_admin()                from public, anon;
revoke all on function public.admin_dashboard_stats()   from public, anon;
revoke all on function public.admin_list_orders()       from public, anon;
revoke all on function public.admin_get_order(uuid)     from public, anon;
revoke all on function public.admin_list_users()        from public, anon;
revoke all on function public.admin_get_user(uuid)      from public, anon;

grant execute on function public.is_admin()              to authenticated;
grant execute on function public.admin_dashboard_stats() to authenticated;
grant execute on function public.admin_list_orders()     to authenticated;
grant execute on function public.admin_get_order(uuid)   to authenticated;
grant execute on function public.admin_list_users()      to authenticated;
grant execute on function public.admin_get_user(uuid)    to authenticated;
