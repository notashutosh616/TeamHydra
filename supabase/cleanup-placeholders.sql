-- ════════════════════════════════════════════════════════════════════════
--  TEAM HYDRA — remove the seeded DEMO / PLACEHOLDER memories
--  Run once in Supabase → SQL Editor → Run.
--
--  These are the rows that point at the bundled /assets/memoryX.svg and
--  /assets/memory-clip.mp4 placeholders (inserted by setup.sql's seed block).
--  Your REAL uploads (full storage URLs) and YouTube rows (video IDs) are kept.
-- ════════════════════════════════════════════════════════════════════════
delete from public.memories where src like '/assets/%';

-- (Optional) see what's left:
-- select type, src, caption from public.memories order by created_at desc;
