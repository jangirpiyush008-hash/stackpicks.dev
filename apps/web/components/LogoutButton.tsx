'use client';

import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '../lib/supabase-browser';

export function LogoutButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const onLogout = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };
  return (
    <button
      type="button"
      onClick={onLogout}
      className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition"
    >
      {children}
    </button>
  );
}
