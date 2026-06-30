import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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

  // Use getSession() instead of getUser() - reads from cookie, no network call
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  const protectedPaths = ['/dashboard', '/learn', '/kanji', '/kana', '/profile', '/premium', '/admin'];
  const isProtected = protectedPaths.some((p) => url.pathname.startsWith(p));

  if (isProtected && !user) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = '/auth';
    redirectUrl.searchParams.set('mode', 'login');
    return NextResponse.redirect(redirectUrl);
  }

  if (url.pathname.startsWith('/auth') && user) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
