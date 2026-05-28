import { NextResponse } from 'next/server';
import { authorizationServerMetadata } from '@stackpicks/core/oauth/server';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export function GET() {
  return NextResponse.json(authorizationServerMetadata(), { headers: CORS });
}
