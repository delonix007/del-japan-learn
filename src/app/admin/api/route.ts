import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ponytail: lazy-init, service_role_key may not be set at build time
let _adminSupabase: ReturnType<typeof createClient> | null = null;
function getAdminClient() {
  if (!_adminSupabase) {
    _adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _adminSupabase;
}

export async function POST(request: NextRequest) {
  const supabase = getAdminClient();
  const raw = await verifyAdminEmail(request, supabase);
  if (raw instanceof NextResponse) return raw;
  const { action, userId, reqId } = raw;

  if (action === 'confirm') {
    await (supabase as any).from('users').update({ is_premium: true, premium_activated_at: new Date().toISOString() }).eq('id', userId);
    await (supabase as any).from('activation_requests').update({ status: 'dikonfirmasi', confirmed_at: new Date().toISOString() }).eq('id', reqId);
    return NextResponse.json({ ok: true });
  }

  if (action === 'reject') {
    await (supabase as any).from('activation_requests').update({ status: 'ditolak' }).eq('id', reqId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 });
}

// ponytail: single helper — email guard reusable if more actions added
async function verifyAdminEmail(request: NextRequest, supabase: ReturnType<typeof createClient>) {
  const body = await request.json().catch(() => ({}));
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (user.email !== 'akbarnagato@gmail.com') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  return { ...body, userId: body.userId, reqId: body.reqId, action: body.action };
}