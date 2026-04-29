-- =============================================================================
-- EarnestMall — RLS policies (M1: profiles only)
-- Product / order / admin policies are added in later migrations.
-- =============================================================================

-- =============================================================================
-- profiles
-- =============================================================================

alter table public.profiles enable row level security;

-- Read own profile
create policy profiles_select_own
on public.profiles for select
to authenticated
using (auth.uid() = id);

-- Update own profile (role-change blocked by trigger below)
create policy profiles_update_own
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Prevent users from escalating their own role; admins can still change roles.
create or replace function public.tg_prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
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

create trigger profiles_block_role_self_escalation
before update of role on public.profiles
for each row execute function public.tg_prevent_role_self_escalation();
