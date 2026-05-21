import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SubmitBody {
  full_name: string;
  why_recommended: string;
  category_slug?: string;
  url?: string;
}

const REPO_RE = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/;

function normalize(input: string): string {
  let v = input.trim();
  v = v.replace(/^git@github\.com:/, '');
  v = v.replace(/^https?:\/\/(www\.)?github\.com\//, '');
  v = v.replace(/\.git$/, '');
  v = v.replace(/\/$/, '');
  const parts = v.split('/');
  if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  return v;
}

export async function POST(req: NextRequest) {
  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'auth_required' }, { status: 401 });
  }

  const full_name = normalize(body.full_name ?? '');
  if (!REPO_RE.test(full_name)) {
    return NextResponse.json({ ok: false, error: 'invalid_repo_format' }, { status: 400 });
  }
  const why = (body.why_recommended ?? '').trim();
  if (why.length < 30 || why.length > 1000) {
    return NextResponse.json({ ok: false, error: 'invalid_reason_length' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('repo_submissions')
    .insert({
      user_id: user.id,
      user_email: user.email,
      full_name,
      why_recommended: why,
      category_slug: body.category_slug ?? null,
      url: body.url ?? null,
    })
    .select('id, full_name, status, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { ok: false, error: 'duplicate', message: 'You already submitted this repo.' },
        { status: 409 }
      );
    }
    console.error('[submit-repo] DB error:', error);
    return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 });
  }

  console.log(JSON.stringify({
    type: 'repo_submitted',
    user_id: user.id,
    user_email: user.email,
    full_name,
    submission_id: data.id,
    ts: new Date().toISOString(),
  }));

  return NextResponse.json({ ok: true, data });
}
