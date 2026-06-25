-- ════════════════════════════════════════════════════════════════════════
--  TEAM HYDRA — ROLE-BASED ACCESS (admin vs member)
--  Run AFTER supabase/admin-setup.sql. Paste in SQL Editor → Run.
--  Roles:  admin  = manage Memories + edit Member profiles
--          member = manage Memories only (no access to Member profiles)
-- ════════════════════════════════════════════════════════════════════════

-- ── 1) profiles table (one row per auth user, holds their role) ────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Each user may read their OWN profile (so the app can learn its role).
drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own"
  on public.profiles for select to authenticated using (id = auth.uid());

-- (Roles are changed only here in the SQL editor, never from the browser.)

-- ── 2) helper: is the current user an admin? ───────────────────────────────
--    SECURITY DEFINER lets it read profiles safely without RLS recursion.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ── 3) auto-give every NEW signup a 'member' profile, + backfill existing ──
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role) values (new.id, 'member')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- backfill anyone who already exists (e.g. your account)
insert into public.profiles (id, role)
select id, 'member' from auth.users
on conflict (id) do nothing;

-- ── 4) MEMBERS table: writes ONLY for admins (read stays public) ───────────
drop policy if exists "members admin write" on public.members;
create policy "members admin write"
  on public.members for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── 5) MEMORIES + STORAGE: unchanged.  Any logged-in user (admin OR member)
--      can add/delete memories — those policies were created in admin-setup.sql.

-- ════════════════════════════════════════════════════════════════════════
--  ★ 6) MAKE YOURSELF THE ADMIN  (everyone else stays 'member' by default) ★
-- ════════════════════════════════════════════════════════════════════════
--  (case-insensitive + works even if the profile row doesn't exist yet)
insert into public.profiles (id, role)
select id, 'admin' from auth.users
where lower(email) = lower('ashutosh7000189@gmail.com')
on conflict (id) do update set role = 'admin';

--  To promote/demote anyone later, change the email + role and run:
--    insert into public.profiles (id, role)
--    select id, 'member' from auth.users where lower(email) = lower('friend@example.com')
--    on conflict (id) do update set role = 'member';
