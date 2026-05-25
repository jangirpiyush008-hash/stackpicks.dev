-- repo_upvotes: ensure the anon-readable count works and service-role inserts
-- have an explicit grant. Service role bypasses RLS, but missing GRANTs at the
-- table level still 401 — bitten by this on the coupons table (see commit
-- 6803ab9). Apply the same fix here defensively.

grant select on public.repo_upvotes to anon, authenticated;
grant insert on public.repo_upvotes to service_role;

-- The /api/upvote POST route is server-only and hashes the IP before insert,
-- so we do NOT add a public INSERT policy. If we ever wanted client-side
-- inserts we'd need a per-IP rate-limit Edge Function — this server-only
-- pattern is simpler + safer.

-- Optional helper: returns top-voted repos in the last 30 days. Useful for
-- a future "trending by upvotes" homepage rail. Wrapped in a security-definer
-- function so anon can call it without exposing raw rows.
create or replace function public.top_upvoted_repos(p_limit int default 20, p_days int default 30)
returns table (repo_id uuid, upvotes bigint)
language sql
security definer
set search_path = public
as $$
  select repo_id, count(*)::bigint as upvotes
  from public.repo_upvotes
  where created_at >= timezone('utc', now()) - (p_days || ' days')::interval
  group by repo_id
  order by upvotes desc
  limit greatest(p_limit, 1);
$$;

grant execute on function public.top_upvoted_repos(int, int) to anon, authenticated;
