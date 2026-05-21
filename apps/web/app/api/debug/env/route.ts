import { NextResponse } from 'next/server';

// Reports which env vars are set, never the values. Safe to expose.
// Delete this file after the deploy is verified.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function status(name: string): { set: boolean; length: number; preview: string } {
  const v = process.env[name];
  if (!v) return { set: false, length: 0, preview: '' };
  return {
    set: true,
    length: v.length,
    preview: v.length > 12 ? `${v.slice(0, 6)}…${v.slice(-4)}` : '***',
  };
}

export async function GET() {
  return NextResponse.json({
    node_env: process.env.NODE_ENV,
    railway_environment: process.env.RAILWAY_ENVIRONMENT ?? null,
    vars: {
      NEXT_PUBLIC_SITE_URL: { ...status('NEXT_PUBLIC_SITE_URL'), value: process.env.NEXT_PUBLIC_SITE_URL ?? null },
      NEXT_PUBLIC_SUPABASE_URL: { ...status('NEXT_PUBLIC_SUPABASE_URL'), value: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: status('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      SUPABASE_SERVICE_ROLE_KEY: status('SUPABASE_SERVICE_ROLE_KEY'),
      GITHUB_TOKEN: status('GITHUB_TOKEN'),
      CRON_SECRET: status('CRON_SECRET'),
    },
  });
}
