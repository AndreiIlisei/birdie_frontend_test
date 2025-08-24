import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_FACTSHEET!;
const REVALIDATE = 60;

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const id = sp.get('id');

    if (id) {
      const url = new URL(`${API}/api/v1/fact_sheet/${id}`);
      url.searchParams.set('user_id', sp.get('user_id') ?? '1');
      const res = await fetch(url, { next: { revalidate: REVALIDATE } });
      const body = await res.json();
      return NextResponse.json(body, { status: res.status });
    }

    const url = new URL(`${API}/api/v1/fact_sheet/`);
    for (const key of ['offset', 'limit', 'user_id', 'data_group_id']) {
      const v = sp.get(key);
      if (v != null) url.searchParams.set(key, v);
    }
    if (!url.searchParams.has('user_id')) url.searchParams.set('user_id', '1');

    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    const body = await res.json();
    return NextResponse.json(body, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? 'Proxy error' }, { status: 500 });
  }
}
