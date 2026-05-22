import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const gate = await isAdmin();
  return NextResponse.json({
    ok: true,
    is_admin: gate.ok,
    email: gate.email,
  });
}
