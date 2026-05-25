// /.well-known/security.txt — RFC 9116. Tells security researchers where to
// report vulnerabilities. Small trust signal for Bing/enterprise crawlers,
// expected by some bug-bounty programs and security audits.

import { NextResponse } from 'next/server';
import { CONTACT, SITE } from '@stackpicks/core/constants';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  // Expires field: ~1 year from now. Bump on the next big release.
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .replace(/\.\d+Z$/, 'Z');

  const body = `Contact: mailto:${CONTACT.email}
Expires: ${expires}
Preferred-Languages: en
Canonical: ${SITE.url}/.well-known/security.txt
Policy: ${SITE.url}/security
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
