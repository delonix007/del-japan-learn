import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// ponytail: env var creds — single admin, no db table, no hash lib
export async function POST(request: NextRequest) {
  const { username, password } = await request.json().catch(() => ({}));

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const cookieJar = await cookies();
    cookieJar.set('admin_session', 'true', {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8,
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
}