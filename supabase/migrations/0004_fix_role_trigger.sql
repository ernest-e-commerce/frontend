-- =============================================================================
-- Fix: tg_prevent_role_self_escalation now allows role changes when there is
-- no Supabase auth context (auth.uid() is null) — i.e., direct postgres
-- connections used by migration scripts and admin tooling. Regular users
-- with a JWT still cannot escalate their own role.
-- =============================================================================

create or replace function public.tg_prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Allow service role / direct postgres connections (no auth context).
  if auth.uid() is null then
    return new;
  end if;

  if new.role is distinct from old.role then
    if not exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    ) then
      raise exception 'Only admins can change roles';
    end if;
  end if;
  return new;
end;
$$;
