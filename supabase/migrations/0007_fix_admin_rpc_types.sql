-- =============================================================================
-- Fix: auth.users.email is varchar(255). Cast it to text in admin RPCs whose
-- declared return type is text, otherwise Postgres rejects the column type
-- mismatch ("structure of query does not match function result type").
-- =============================================================================

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
    u.email::text,
    o.created_at
  from public.orders o
  left join public.profiles p on p.id = o.user_id
  left join auth.users u on u.id = o.user_id
  order by o.created_at desc;
end;
$$;

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
    u.email::text,
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
