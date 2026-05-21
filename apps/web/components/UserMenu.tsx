'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, User, Github, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { getSupabaseBrowser } from '../lib/supabase-browser';

interface SessionUser {
  email: string | null;
  name: string;
  initials: string;
  avatarUrl: string | null;
  isMember: boolean;
}

function deriveUser(authUser: {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
} | null): SessionUser | null {
  if (!authUser) return null;
  const meta = (authUser.user_metadata ?? {}) as Record<string, unknown>;
  const name =
    (meta.full_name as string) ||
    (meta.name as string) ||
    (meta.user_name as string) ||
    (authUser.email?.split('@')[0] ?? 'Member');
  const initials = name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'M';
  const avatarUrl =
    (meta.avatar_url as string) ||
    (meta.picture as string) ||
    null;
  return {
    email: authUser.email ?? null,
    name,
    initials,
    avatarUrl,
    isMember: false, // TODO: read from premium_subscriptions when payments ship
  };
}

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    supabase.auth.getUser().then(({ data }) => {
      setUser(deriveUser(data.user));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(deriveUser(session?.user ?? null));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const onSignOut = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  // Loading state — show a subtle placeholder so the layout doesn't jump
  if (loading) {
    return <div className="w-20 h-8 rounded-full bg-surface/50 animate-pulse" />;
  }

  // Signed out — show the green Sign in CTA
  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-1.5 rounded bg-accent text-bg font-bold hover:opacity-90 transition whitespace-nowrap"
      >
        Sign in
      </Link>
    );
  }

  // Signed in — show avatar + dropdown
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-border bg-surface/40 hover:border-accent/50 hover:bg-surface transition"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            width={28}
            height={28}
            className="rounded-full border border-border bg-bg"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent/40 to-fuchsia-500/40 text-text text-xs flex items-center justify-center font-bold">
            {user.initials}
          </div>
        )}
        <span className="text-sm font-semibold max-w-[100px] truncate">{user.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-bg/95 backdrop-blur-xl shadow-2xl shadow-accent/5 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  width={36}
                  height={36}
                  className="rounded-full border border-border"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/40 to-fuchsia-500/40 text-text text-sm flex items-center justify-center font-bold">
                  {user.initials}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{user.name}</div>
                <div className="text-[11px] text-muted truncate">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                Membership
              </span>
              {user.isMember ? (
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent bg-accent/15 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Lifetime
                </span>
              ) : (
                <Link
                  href="/pricing"
                  onClick={() => setOpen(false)}
                  className="text-[10px] font-mono uppercase tracking-wider bg-accent text-bg px-2 py-0.5 rounded-full hover:opacity-90 transition"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="py-1">
            <MenuItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} onClick={() => setOpen(false)}>
              Dashboard
            </MenuItem>
            <MenuItem href="/profile" icon={<User className="w-4 h-4" />} onClick={() => setOpen(false)}>
              Profile
            </MenuItem>
            <MenuItem href="/submit-repo" icon={<Github className="w-4 h-4" />} onClick={() => setOpen(false)}>
              Submit a repo
            </MenuItem>
          </div>

          {/* Sign out */}
          <div className="border-t border-border py-1">
            <button
              type="button"
              onClick={onSignOut}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-muted hover:text-text hover:bg-surface/60 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-text hover:bg-surface/60 transition"
    >
      <span className="text-muted">{icon}</span>
      {children}
    </Link>
  );
}
