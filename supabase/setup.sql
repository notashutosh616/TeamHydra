-- ════════════════════════════════════════════════════════════════════════
--  TEAM HYDRA — "memories" table for the OUR MEMORIES gallery
--  Run this in your Supabase project:  SQL Editor → New query → paste → Run
-- ════════════════════════════════════════════════════════════════════════

-- 1) Table -----------------------------------------------------------------
create table if not exists public.memories (
  id         uuid primary key default gen_random_uuid(),
  type       text not null default 'image' check (type in ('image', 'video')),
  src        text not null,          -- public URL of the image OR the .mp4 file
  poster     text,                   -- (videos only) thumbnail image URL
  caption    text,                   -- optional caption shown in the lightbox
  span       text check (span in ('wide', 'tall')),  -- optional grid emphasis
  created_at timestamptz not null default now()
);

create index if not exists memories_created_at_idx
  on public.memories (created_at desc);

-- 2) Row Level Security ----------------------------------------------------
--    This is a public site, so allow anyone (anon key) to READ memories.
--    Writes stay locked down — add rows from the Supabase dashboard.
alter table public.memories enable row level security;

drop policy if exists "Public read access to memories" on public.memories;
create policy "Public read access to memories"
  on public.memories
  for select
  to anon, authenticated
  using (true);

-- 3) Seed data (optional) --------------------------------------------------
--    These point at the bundled placeholder art so the gallery lights up
--    immediately. Replace `src`/`poster` with your real media URLs later
--    (upload to Supabase Storage, or any public URL).
--    created_at is staggered so they show newest-first in the same nice order.
insert into public.memories (type, src, poster, caption, span, created_at) values
  ('image', '/assets/memory1.svg', null,                 'Day one of forever.',     'wide', now() - interval '1 minute'),
  ('image', '/assets/memory2.svg', null,                 'Canteen council meeting.', null,  now() - interval '2 minute'),
  ('video', '/assets/memory-clip.mp4', '/assets/memory3.svg', 'Hostel anthem, unplugged.', null, now() - interval '3 minute'),
  ('image', '/assets/memory4.svg', null,                 '3 AM, zero regrets.',     'tall', now() - interval '4 minute'),
  ('image', '/assets/memory5.svg', null,                 'Last bench legends.',      null,  now() - interval '5 minute'),
  ('image', '/assets/memory6.svg', null,                 'Bonfire & bad ideas.',     null,  now() - interval '6 minute'),
  ('image', '/assets/memory7.svg', null,                 'Exam-week survivors.',     null,  now() - interval '7 minute'),
  ('image', '/assets/memory8.svg', null,                 'Road trip detour.',       'wide', now() - interval '8 minute'),
  ('image', '/assets/memory9.svg', null,                 'One last frame.',          null,  now() - interval '9 minute');
