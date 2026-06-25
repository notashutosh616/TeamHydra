-- ════════════════════════════════════════════════════════════════════════
--  TEAM HYDRA — BACKGROUND MUSIC (editable from the admin panel)
--  Run AFTER admin-setup.sql AND roles-setup.sql (needs the is_admin() fn).
--  Paste in Supabase → SQL Editor → Run.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1) settings table (key/value — holds the current music URL) ────────────
create table if not exists public.settings (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

-- Anyone can READ settings (public site needs the music URL).
drop policy if exists "settings public read" on public.settings;
create policy "settings public read"
  on public.settings for select to anon, authenticated using (true);

-- Only ADMINS can change settings.
drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write"
  on public.settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ── 2) storage bucket 'hydra-audio' (public read, admin-only upload/delete) ─
insert into storage.buckets (id, name, public)
values ('hydra-audio', 'hydra-audio', true)
on conflict (id) do nothing;

drop policy if exists "hydra-audio public read" on storage.objects;
create policy "hydra-audio public read"
  on storage.objects for select using (bucket_id = 'hydra-audio');

drop policy if exists "hydra-audio admin insert" on storage.objects;
create policy "hydra-audio admin insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'hydra-audio' and public.is_admin());

drop policy if exists "hydra-audio admin update" on storage.objects;
create policy "hydra-audio admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'hydra-audio' and public.is_admin());

drop policy if exists "hydra-audio admin delete" on storage.objects;
create policy "hydra-audio admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'hydra-audio' and public.is_admin());

-- Done. Upload your first track from the admin panel → "Music" tab.
