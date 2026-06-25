-- ════════════════════════════════════════════════════════════════════════
--  TEAM HYDRA — MEMBER vs ADMIN permissions for MEMORIES
--  Run AFTER admin-setup.sql AND roles-setup.sql (needs the is_admin() fn).
--
--    member : can UPLOAD photos only.  CANNOT delete anything.
--    admin  : can upload photos + videos, and DELETE photos + videos.
-- ════════════════════════════════════════════════════════════════════════

-- ── memories table ─────────────────────────────────────────────────────────
-- replace the old broad "any logged-in user can do anything" policy
drop policy if exists "memories admin write" on public.memories;

-- INSERT: any logged-in user. Members may add photos + YouTube links
-- (type 'image' or 'youtube'); only admins may add uploaded mp4 videos.
drop policy if exists "memories insert authed" on public.memories;
create policy "memories insert authed"
  on public.memories for insert to authenticated
  with check (public.is_admin() or type in ('image', 'youtube'));

-- UPDATE: admin only
drop policy if exists "memories update admin" on public.memories;
create policy "memories update admin"
  on public.memories for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- DELETE: admin only
drop policy if exists "memories delete admin" on public.memories;
create policy "memories delete admin"
  on public.memories for delete to authenticated
  using (public.is_admin());

-- ── storage bucket 'hydra-media' ───────────────────────────────────────────
-- Upload (insert) stays open to any logged-in user (policy "hydra-media admin
-- insert" from admin-setup.sql). Only DELETE/UPDATE become admin-only:
drop policy if exists "hydra-media admin delete" on storage.objects;
create policy "hydra-media admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'hydra-media' and public.is_admin());

drop policy if exists "hydra-media admin update" on storage.objects;
create policy "hydra-media admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'hydra-media' and public.is_admin());

-- Done. Members can now only add photos; deleting is admin-only.
