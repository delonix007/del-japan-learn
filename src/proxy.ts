import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  
  // Skip static files
  if (url.pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|css|js|json|txt)$/)) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  // Logged-in users landing on / → go to dashboard
  if (url.pathname === '/' && user) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect logged-in users away from auth pages
  if (url.pathname.startsWith('/auth') && user) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  // Admin guard: check if user is logged in AND is admin (via Supabase Auth + email whitelist)
  if (url.pathname.startsWith('/admin')) {
    // Allow login page
    if (url.pathname.startsWith('/admin/login')) return supabaseResponse;

    // Must be logged in
    if (!user) {
      const redirectUrl = url.clone();
      redirectUrl.pathname = '/admin/login';
      return NextResponse.redirect(redirectUrl);
    }

    // Must be admin (client-side check for UX — server will enforce)
    const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
    if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
      const redirectUrl = url.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
