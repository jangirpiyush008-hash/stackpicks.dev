'use client';

import { usePathname } from 'next/navigation';
import { RepoSearchBar } from './RepoSearchBar';

// Routes where a hero search exists on the page — header search would be redundant.
const HERO_SEARCH_ROUTES = new Set(['/', '/preview']);

export function HeaderSearchSlot() {
  const pathname = usePathname() ?? '/';
  // Hide the compact header search on pages that already render the big hero search.
  if (HERO_SEARCH_ROUTES.has(pathname)) return <div className="flex-1" />;
  return (
    <div className="flex-1 min-w-0">
      <RepoSearchBar compact />
    </div>
  );
}
