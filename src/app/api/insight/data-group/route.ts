/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_FACTSHEET!;
const REVALIDATE = 60;

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;

    const offset = Math.max(0, parseInt(sp.get('offset') ?? '0', 10) || 0);
    const limitRaw = parseInt(sp.get('limit') ?? '10', 10) || 10;
    const limit = Math.min(Math.max(1, limitRaw), 100);

    const upstream = new URL(`${API_URL}/api/v1/data_group/`);
    upstream.searchParams.set('offset', String(offset));
    upstream.searchParams.set('limit', String(limit));
    upstream.searchParams.set('user_id', sp.get('user_id') ?? '1');

    const res = await fetch(upstream, { next: { revalidate: REVALIDATE } });
    const body = await res.json();

    const items = Array.isArray(body) ? body : (body?.results ?? []);

    return NextResponse.json(
      {
        data: items,
        total: body?.count ?? null,
        offset,
        limit,
        hasNext: items.length === limit,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? 'Proxy error' }, { status: 500 });
  }
}
