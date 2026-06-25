-- ════════════════════════════════════════════════════════════════════════
--  TEAM HYDRA — ADMIN PANEL SETUP
--  Run this whole file in Supabase → SQL Editor → New query → Run.
--  (Safe to run more than once — it's idempotent.)
-- ════════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────────
-- 1) MEMBERS TABLE (the 5 crew profiles, editable from the admin panel)
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  nickname    text,
  funny_line  text,
  message     text,
  city        text,
  photo_url   text,
  accent      text default '#FBBF24',
  stat        text,
  order_index int  default 0,
  created_at  timestamptz not null default now()
);

alter table public.members enable row level security;

-- Public can READ members (the crew section).
drop policy if exists "members public read" on public.members;
create policy "members public read"
  on public.members for select to anon, authenticated using (true);

-- Only logged-in (admin) users can write.
drop policy if exists "members admin write" on public.members;
create policy "members admin write"
  on public.members for all to authenticated using (true) with check (true);

-- Seed the current 5 members — ONLY if the table is still empty.
insert into public.members (name, nickname, funny_line, message, city, photo_url, accent, stat, order_index)
select * from (values
  ('Ashutosh','Dhongi','Bahar se sant, andar se mastermind. Chehra masoom, dimaag criminal — Hydra ka asli dhongi.','Yahan apna personal message daalna hai…','Satna, MP','/assets/member1.svg','#34D399','Attendance: 12%',0),
  ('Shivam','Bihari','2 ghante argument karega, haarega bhi, phir bhi tujhe chai pila ke aayega. Loyalty ka dusra naam.','Yahan apna personal message daalna hai…','Chhapra, Bihar','/assets/member2.svg','#FBBF24','Chai consumed: infinite',1),
  ('Sumit','Bhabhora','Phone girata hai, chaabi girata hai, marks girata hai, par squad kabhi nahi girne deta.','Yahan apna personal message daalna hai…','Ghazipur, UP','/assets/member3.svg','#FB923C','Padhai: loading…',2),
  ('Devendra','Dhote','Kamre ka sabse chill banda… jab tak bill na aaye. Bill aate hi washroom yaad aa jaata hai.','Yahan apna personal message daalna hai…','Betul, MP','/assets/member4.svg','#6EE7B7','Mood: hamesha bhookha',3),
  ('Sujal','Suzzi','Naam cute, banda khatarnaak. Sabse soft awaaz, sabse deadly roast — group ka chupa rustam.','Yahan apna personal message daalna hai…','Guwahati, Assam','/assets/member5.svg','#FCD34D','Backlog: classified',4)
) as v(name, nickname, funny_line, message, city, photo_url, accent, stat, order_index)
where not exists (select 1 from public.members);

-- ──────────────────────────────────────────────────────────────────────────
-- 2) MEMORIES TABLE write access (table already exists with public read).
--    If you have NOT created it yet, run supabase/setup.sql first.
-- ──────────────────────────────────────────────────────────────────────────
alter table public.memories enable row level security;

drop policy if exists "memories admin write" on public.memories;
create policy "memories admin write"
  on public.memories for all to authenticated using (true) with check (true);

-- ──────────────────────────────────────────────────────────────────────────
-- 3) STORAGE BUCKET 'hydra-media' (public read, admin-only upload/delete)
-- ──────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('hydra-media', 'hydra-media', true)
on conflict (id) do nothing;

drop policy if exists "hydra-media public read" on storage.objects;
create policy "hydra-media public read"
  on storage.objects for select using (bucket_id = 'hydra-media');

drop policy if exists "hydra-media admin insert" on storage.objects;
create policy "hydra-media admin insert"
  on storage.objects for insert to authenticated with check (bucket_id = 'hydra-media');

drop policy if exists "hydra-media admin update" on storage.objects;
create policy "hydra-media admin update"
  on storage.objects for update to authenticated using (bucket_id = 'hydra-media');

drop policy if exists "hydra-media admin delete" on storage.objects;
create policy "hydra-media admin delete"
  on storage.objects for delete to authenticated using (bucket_id = 'hydra-media');

-- ════════════════════════════════════════════════════════════════════════
--  IMPORTANT (do this in the dashboard, not SQL):
--   • Authentication → Users → "Add user" → your email + password
--     (tick "Auto Confirm User"). This is your ONLY admin login.
--   • Authentication → Providers/Sign In → DISABLE "Allow new sign ups"
--     so nobody else can create an account and get write access.
-- ════════════════════════════════════════════════════════════════════════
