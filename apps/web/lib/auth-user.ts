import type { User } from '@supabase/supabase-js';

export interface DisplayUser {
  id: string;
  email: string | null;
  name: string;
  initials: string;
  avatarUrl: string | null;
  provider: string | null;
}

export function deriveDisplayUser(user: User): DisplayUser {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const identities = user.identities ?? [];
  const name =
    (meta.full_name as string) ||
    (meta.name as string) ||
    (meta.user_name as string) ||
    (user.email?.split('@')[0] ?? 'Member');
  const initials = name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'M';
  return {
    id: user.id,
    email: user.email ?? null,
    name,
    initials,
    avatarUrl: (meta.avatar_url as string) || (meta.picture as string) || null,
    provider: identities[0]?.provider ?? null,
  };
}
