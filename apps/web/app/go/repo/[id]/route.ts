import { adminClient } from '@stackpicks/core/db';
import { hashIP, dailySalt, appendUtm } from '@stackpicks/core/utils';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = adminClient();

  const { data: repo, error } = await supabase
    .from('repos')
    .select('id, github_url, affiliate_url, full_name')
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle();

  if (error || !repo) {
    redirect('/');
  }

  const isAffiliate = Boolean(repo.affiliate_url);
  // Only stamp UTM on non-affiliate destinations (affiliate links carry their
  // own tracking and ours would conflict with the partner's attribution).
  const rawDestination = repo.affiliate_url || repo.github_url;
  const destination = isAffiliate
    ? rawDestination
    : appendUtm(rawDestination, {
        campaign: 'directory',
        content: repo.full_name ?? undefined,
      });

  // Fire-and-forget log; don't block redirect on it.
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';
    const ipHash = await hashIP(ip, dailySalt());

    await supabase.from('outbound_clicks').insert({
      repo_id: repo.id,
      destination_url: destination,
      is_affiliate: isAffiliate,
      is_sponsored: false,
      ip_hash: ipHash,
      user_agent: req.headers.get('user-agent') ?? null,
      referrer: req.headers.get('referer') ?? null,
    });
  } catch (err) {
    console.error('Click log failed (non-blocking):', err);
  }

  redirect(destination);
}
