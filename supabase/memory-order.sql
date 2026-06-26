-- ════════════════════════════════════════════════════════════════════════
--  TEAM HYDRA — memory visibility + ordering
--  Run AFTER admin-setup.sql + roles-setup.sql. Paste in SQL Editor → Run.
-- ════════════════════════════════════════════════════════════════════════

-- 1) New columns -----------------------------------------------------------
alter table public.memories
  add column if not exists is_visible boolean not null default true;
alter table public.memories
  add column if not exists sort_order integer not null default 0;

-- 2) Give existing rows a defined starting order (newest first: 0,1,2,…) ----
--    Only touches rows still at the default 0, so it's safe to re-run.
with ordered as (
  select id, (row_number() over (order by created_at desc) - 1) as rn
  from public.memories
)
update public.memories m
set sort_order = o.rn
from ordered o
where m.id = o.id and m.sort_order = 0;

-- 3) Allow show/hide + reorder for BOTH admin and member (any logged-in user).
--    (These are UPDATE operations. DELETE stays admin-only.)
drop policy if exists "memories update admin" on public.memories;
drop policy if exists "memories update authed" on public.memories;
create policy "memories update authed"
  on public.memories for update to authenticated
  using (true) with check (true);

-- Done. Manage visibility + order from the admin panel → Memories tab.
