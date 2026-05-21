/**
 * Seed runner. Run once to populate the database.
 *
 * Usage: npx tsx scripts/seed.ts
 *
 * What it does:
 * 1. Reads SEED_REPOS from seed-data.ts
 * 2. Batches them and fetches live GitHub data (stars, description, language)
 * 3. Loads category mappings from DB (must run seed_categories.sql migration first)
 * 4. Upserts repos with curator takes
 * 5. Links repos to categories via repo_categories
 * 6. Sets is_published = true for repos with takes (everything in this list)
 *
 * Safe to re-run: uses upsert on github_id.
 */

import { adminClient } from '../core/db';
import { fetchManyRepos, slugFromFullName } from '../core/github';
import { SEED_REPOS } from './seed-data';

async function main() {
  console.log(`Seeding ${SEED_REPOS.length} repos...`);
  const supabase = adminClient();

  // 1. Load categories map (slug -> id)
  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('id, slug');

  if (catErr || !categories) {
    console.error('Failed to load categories. Did you run the seed_categories migration?');
    console.error(catErr);
    process.exit(1);
  }

  const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  console.log(`Loaded ${categoryIdBySlug.size} categories`);

  // 2. Fetch live GitHub data
  console.log('Fetching live GitHub data (this takes ~30s)...');
  const fullNames = SEED_REPOS.map((s) => s.full_name);
  const githubData = await fetchManyRepos(fullNames);
  console.log(`Fetched ${githubData.length} repos from GitHub`);

  const githubBy = new Map(githubData.map((g) => [g.full_name.toLowerCase(), g]));

  // 3. Build upsert payload
  const repoUpserts: any[] = [];
  const missingFromGithub: string[] = [];

  for (const seed of SEED_REPOS) {
    const gh = githubBy.get(seed.full_name.toLowerCase());
    if (!gh) {
      missingFromGithub.push(seed.full_name);
      continue;
    }
    repoUpserts.push({
      github_id: gh.github_id,
      slug: slugFromFullName(gh.full_name),
      owner: gh.owner,
      name: gh.name,
      full_name: gh.full_name,
      description: gh.description,
      homepage: gh.homepage,
      github_url: gh.github_url,
      language: gh.language,
      topics: gh.topics,
      license: gh.license,
      stars: gh.stars,
      forks: gh.forks,
      open_issues: gh.open_issues,
      watchers: gh.watchers,
      stars_last_week: 0,
      pushed_at: gh.pushed_at,
      github_created_at: gh.github_created_at,
      curator_take: seed.curator_take,
      use_this_if: seed.use_this_if,
      skip_if: seed.skip_if,
      is_featured: seed.is_featured,
      is_published: true,
      affiliate_url: seed.affiliate_url ?? null,
    });
  }

  if (missingFromGithub.length > 0) {
    console.warn(`WARNING: ${missingFromGithub.length} repos missing from GitHub response (may be renamed/private):`);
    missingFromGithub.forEach((n) => console.warn(`  - ${n}`));
  }

  // 4. Upsert repos
  console.log(`Upserting ${repoUpserts.length} repos...`);
  const { error: upsertErr } = await supabase
    .from('repos')
    .upsert(repoUpserts, { onConflict: 'github_id' });

  if (upsertErr) {
    console.error('Failed to upsert repos:', upsertErr);
    process.exit(1);
  }
  console.log('Repos upserted.');

  // 5. Link repos to categories
  console.log('Linking categories...');
  const { data: insertedRepos } = await supabase
    .from('repos')
    .select('id, github_id, full_name')
    .in(
      'github_id',
      repoUpserts.map((r) => r.github_id)
    );

  if (!insertedRepos) {
    console.error('Could not fetch inserted repos to map categories');
    process.exit(1);
  }

  const repoIdByGithubId = new Map(insertedRepos.map((r) => [r.github_id, r.id]));

  const links: { repo_id: string; category_id: string }[] = [];
  let skippedCategories = 0;
  for (const seed of SEED_REPOS) {
    const gh = githubBy.get(seed.full_name.toLowerCase());
    if (!gh) continue;
    const repoId = repoIdByGithubId.get(gh.github_id);
    if (!repoId) continue;

    for (const slug of seed.category_slugs) {
      const catId = categoryIdBySlug.get(slug);
      if (!catId) {
        console.warn(`Skipping unknown category "${slug}" for ${seed.full_name}`);
        skippedCategories++;
        continue;
      }
      links.push({ repo_id: repoId, category_id: catId });
    }
  }

  // Clear existing links then re-insert (idempotent)
  const repoIds = Array.from(repoIdByGithubId.values());
  await supabase.from('repo_categories').delete().in('repo_id', repoIds);

  const { error: linkErr } = await supabase.from('repo_categories').insert(links);
  if (linkErr) {
    console.error('Failed to link categories:', linkErr);
    process.exit(1);
  }

  console.log(`Linked ${links.length} repo-category relationships (skipped ${skippedCategories} unknown categories)`);
  console.log(`Seed complete! ${repoUpserts.length} repos published.`);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
