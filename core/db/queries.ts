/**
 * Typed query helpers. All queries that the web app uses go here.
 * UI components should NEVER call Supabase directly — they call these functions.
 * This is the DRY boundary.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Repo, Category, Collection, SponsoredSlot, RepoWithCategories } from '../types';
import type { RepoSortOption } from '../constants';

export interface ListReposOptions {
  categorySlug?: string;
  sort?: RepoSortOption;
  limit?: number;
  offset?: number;
  search?: string;
}

export async function listRepos(
  supabase: SupabaseClient,
  opts: ListReposOptions = {}
): Promise<RepoWithCategories[]> {
  const { categorySlug, sort = 'trending', limit = 24, offset = 0, search } = opts;

  let query = supabase
    .from('repos')
    .select(
      `
      *,
      repo_categories!inner (
        categories!inner ( id, slug, name, icon )
      )
    `
    )
    .eq('is_published', true)
    .range(offset, offset + limit - 1);

  if (categorySlug) {
    query = query.eq('repo_categories.categories.slug', categorySlug);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  switch (sort) {
    case 'trending':
      query = query.order('stars_last_week', { ascending: false });
      break;
    case 'stars':
      query = query.order('stars', { ascending: false });
      break;
    case 'newest':
      query = query.order('github_created_at', { ascending: false });
      break;
    case 'curated':
      query = query.order('is_featured', { ascending: false }).order('stars', { ascending: false });
      break;
  }

  const { data, error } = await query;
  if (error) throw new Error(`listRepos failed: ${error.message}`);

  return (data ?? []).map((row: any) => ({
    ...row,
    categories: row.repo_categories.map((rc: any) => rc.categories),
    upvotes_count: 0, // joined separately when needed
  }));
}

/**
 * Anonymous IP-hashed upvote count for a single repo. Used on the repo detail
 * page to seed the UpvoteButton + power the real aggregateRating JSON-LD.
 * Returns 0 on miss — never throws (analytics should never break a page).
 */
export async function getRepoUpvoteCount(
  supabase: SupabaseClient,
  repoId: string
): Promise<number> {
  const { count, error } = await supabase
    .from('repo_upvotes')
    .select('id', { count: 'exact', head: true })
    .eq('repo_id', repoId);

  if (error) {
    // Don't crash the page — log and return 0.
    // eslint-disable-next-line no-console
    console.warn('getRepoUpvoteCount failed:', error.message);
    return 0;
  }
  return count ?? 0;
}

/**
 * Insert an upvote with idempotent semantics. `ip_hash` is computed
 * server-side (caller responsibility) — never trust a client-supplied hash.
 * Returns true on new insert, false on duplicate (same hash already voted).
 */
export async function insertRepoUpvote(
  supabase: SupabaseClient,
  repoId: string,
  ipHash: string
): Promise<{ inserted: boolean; count: number }> {
  // The (repo_id, ip_hash) UNIQUE constraint makes duplicates safe.
  const { error } = await supabase
    .from('repo_upvotes')
    .insert({ repo_id: repoId, ip_hash: ipHash });

  // 23505 = unique_violation in Postgres. Treat as "already voted today".
  const inserted = !error;
  if (error && error.code !== '23505') {
    throw new Error(`insertRepoUpvote failed: ${error.message}`);
  }

  const count = await getRepoUpvoteCount(supabase, repoId);
  return { inserted, count };
}

export async function getRepoBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<RepoWithCategories | null> {
  const { data, error } = await supabase
    .from('repos')
    .select(
      `
      *,
      repo_categories ( categories ( id, slug, name, icon ) )
    `
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw new Error(`getRepoBySlug failed: ${error.message}`);
  if (!data) return null;

  return {
    ...(data as any),
    categories: (data as any).repo_categories.map((rc: any) => rc.categories),
    upvotes_count: 0,
  };
}

export async function listCategories(supabase: SupabaseClient): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw new Error(`listCategories failed: ${error.message}`);
  return data ?? [];
}

export async function getCategoryBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(`getCategoryBySlug failed: ${error.message}`);
  return data;
}

export async function getActiveSponsoredSlots(
  supabase: SupabaseClient,
  placement: SponsoredSlot['placement'],
  categoryId?: string
): Promise<SponsoredSlot[]> {
  let query = supabase
    .from('sponsored_slots')
    .select('*')
    .eq('status', 'active')
    .eq('placement', placement)
    .gt('ends_at', new Date().toISOString());

  if (categoryId) query = query.eq('category_id', categoryId);

  const { data, error } = await query.order('amount_inr', { ascending: false });
  if (error) throw new Error(`getActiveSponsoredSlots failed: ${error.message}`);
  return (data ?? []) as SponsoredSlot[];
}

export async function listCollections(
  supabase: SupabaseClient,
  includePremium = false
): Promise<Collection[]> {
  let query = supabase.from('collections').select('*').eq('is_published', true);
  if (!includePremium) query = query.eq('is_premium', false);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(`listCollections failed: ${error.message}`);
  return data ?? [];
}
