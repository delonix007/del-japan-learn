import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

// ponytail: force Node.js runtime
export const runtime = 'nodejs';

// ponytail: direct HTTP fetch to Supabase REST API — no @supabase/supabase-js dependency
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ponytail: middleware handles session — route trusts cookie
export async function POST(request: NextRequest) {
  const adminCookie = request.cookies.get('admin_session');
  if (!adminCookie || adminCookie.value !== 'true') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { action, userId, reqId } = body;

  if (action === 'confirm') {
    // Update users.is_premium = true
    const r1 = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ is_premium: true, premium_activated_at: new Date().toISOString() }),
    });
    // Update activation_requests status
    const r2 = await fetch(`${SUPABASE_URL}/rest/v1/activation_requests?id=eq.${reqId}`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ status: 'dikonfirmasi', confirmed_at: new Date().toISOString() }),
    });
    if (!r1.ok || !r2.ok) {
      const t1 = await r1.text().catch(() => '');
      const t2 = await r2.text().catch(() => '');
      return NextResponse.json({ error: `users:${r1.status} ${t1} | requests:${r2.status} ${t2}` }, { status: 500 });
    }
    revalidatePath('/admin');
    return NextResponse.json({ ok: true });
  }

  if (action === 'reject') {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/activation_requests?id=eq.${reqId}`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ status: 'ditolak' }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      return NextResponse.json({ error: `requests:${res.status} ${t}` }, { status: 500 });
    }
    revalidatePath('/admin');
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 });
}