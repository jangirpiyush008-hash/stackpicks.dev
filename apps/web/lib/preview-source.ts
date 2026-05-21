import { SEED_REPOS, type SeedEntry } from '../../../scripts/seed-data';

export type { SeedEntry };
export { SEED_REPOS };

export function getSeedByFullName(fullName: string): SeedEntry | undefined {
  const target = fullName.toLowerCase();
  return SEED_REPOS.find((r) => r.full_name.toLowerCase() === target);
}

export function getSeedBySlug(slug: string): SeedEntry | undefined {
  const target = slug.toLowerCase();
  return SEED_REPOS.find((r) => r.full_name.split('/')[1].toLowerCase() === target);
}

export function ownerOf(entry: SeedEntry): string {
  return entry.full_name.split('/')[0];
}

export function nameOf(entry: SeedEntry): string {
  return entry.full_name.split('/')[1];
}
