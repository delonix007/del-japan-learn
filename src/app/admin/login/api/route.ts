import { NextResponse, type NextRequest } from 'next/server';
import * as bcrypt from 'bcryptjs';

// ponytail: force Node.js runtime
export const runtime = 'nodejs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  const { username, password } = await request.json().catch(() => ({}));
  if (!username || !password) {
    return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
  }

  // Verify against admin_users table using service role (bypass RLS)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?username=eq.${encodeURIComponent(username)}&select=id,username,password_hash`, {
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Accept': 'application/json',
    },
  });
  if (!res.ok) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
  const admins = await res.json();
  const admin = admins[0];
  if (!admin) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
  }

  // Create admin session cookie
  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_session', 'true', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  // Update last_login
  await fetch(`${SUPABASE_URL}/rest/v1/admin_users?id=eq.${admin.id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ last_login: new Date().toISOString() }),
  });

  return response;
}