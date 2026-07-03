import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default async function LearnPage() {
  const supabase = createClient();
  const { data } = await supabase.from('lessons').select('id').eq('is_free', true).eq('book', 'I').order('urutan', { ascending: true }).limit(1);
  const firstFree = data && data.length > 0 ? data[0].id : 1;
  redirect(`/learn/${firstFree}`);
}
