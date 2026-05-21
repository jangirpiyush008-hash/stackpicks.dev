import { adminClient } from '@stackpicks/core/db';
import { hashIP, dailySalt } from '@stackpicks/core/utils';
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

  const { data: slot, error } = await supabase
    .from('sponsored_slots')
    .select('id, external_url, repo_id, status, ends_at')
    .eq('id', id)
    .maybeSingle();

  if (error || !slot || slot.status !== 'active' || new Date(slot.ends_at) < new Date()) {
    redirect('/');
  }

  let destination = slot.external_url;
  if (!destination && slot.repo_id) {
    const { data: repo } = await supabase
      .from('repos')
      .select('affiliate_url, github_url')
      .eq('id', slot.repo_id)
      .maybeSingle();
    destination = repo?.affiliate_url || repo?.github_url || null;
  }

  if (!destination) redirect('/');

  // Log + increment counter
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';
    const ipHash = await hashIP(ip, dailySalt());

    await Promise.all([
      supabase.from('outbound_clicks').insert({
        sponsored_slot_id: id,
        destination_url: destination,
        is_affiliate: false,
        is_sponsored: true,
        ip_hash: ipHash,
        user_agent: req.headers.get('user-agent') ?? null,
        referrer: req.headers.get('referer') ?? null,
      }),
      supabase.rpc('increment', { table_name: 'sponsored_slots', row_id: id, column_name: 'clicks' }),
    ]);
  } catch (err) {
    console.error('Sponsored click log failed (non-blocking):', err);
  }

  redirect(destination);
}
