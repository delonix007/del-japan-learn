import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

// ponytail: force Node.js runtime — revalidatePath + supabase-js need it
export const runtime = 'nodejs';

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

// ponytail: middleware handles session — route trusts cookie
export async function POST(request: NextRequest) {
  const adminCookie = request.cookies.get('admin_session');
  if (!adminCookie || adminCookie.value !== 'true') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { action, userId, reqId } = body;
  const supabase = getAdminClient();

  if (action === 'confirm') {
    await (supabase as any).from('users').update({ is_premium: true, premium_activated_at: new Date().toISOString() }).eq('id', userId);
    await (supabase as any).from('activation_requests').update({ status: 'dikonfirmasi', confirmed_at: new Date().toISOString() }).eq('id', reqId);
    revalidatePath('/admin');
    return NextResponse.json({ ok: true });
  }

  if (action === 'reject') {
    await (supabase as any).from('activation_requests').update({ status: 'ditolak' }).eq('id', reqId);
    revalidatePath('/admin');
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 });
}