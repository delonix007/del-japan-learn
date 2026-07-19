import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { ADMIN_EMAILS } from '@/lib/constants';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  // Server-side auth guard — CVE-2025-29927 mitigation
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // No cookie setting needed in Server Component
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // 401: Not logged in → redirect to login
  if (authError || !user) {
    redirect('/admin/login');
  }

  // 403: Logged in but not admin → redirect to dashboard
  if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
    redirect('/dashboard');
  }

  // User is authenticated AND is admin — render the client component
  return <AdminClient />;
}
