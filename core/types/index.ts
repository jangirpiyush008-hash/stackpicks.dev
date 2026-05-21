/**
 * Shared TypeScript types for StackPicks.
 * DB-generated types live in core/db/database.types.ts (run `pnpm db:types` to refresh).
 */

export interface Repo {
  id: string;
  github_id: number;
  slug: string;
  owner: string;
  name: string;
  full_name: string;
  description: string | null;
  homepage: string | null;
  github_url: string;
  language: string | null;
  topics: string[];
  license: string | null;
  stars: number;
  forks: number;
  open_issues: number;
  watchers: number;
  stars_last_week: number;
  pushed_at: string | null;
  github_created_at: string | null;
  curator_take: string | null;
  use_this_if: string | null;
  skip_if: string | null;
  is_featured: boolean;
  is_published: boolean;
  affiliate_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  is_premium: boolean;
  is_published: boolean;
}

export interface SponsoredSlot {
  id: string;
  sponsor_id: string;
  repo_id: string | null;
  external_name: string | null;
  external_url: string | null;
  external_logo: string | null;
  placement: 'category_top' | 'homepage_featured' | 'newsletter';
  category_id: string | null;
  starts_at: string;
  ends_at: string;
  amount_inr: number;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  impressions: number;
  clicks: number;
}

export interface RepoWithCategories extends Repo {
  categories: Category[];
  upvotes_count: number;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };
