'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import type { ActivationRequest, Profile } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [requests, setRequests] = useState<ActivationRequest[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'akbarnagato@gmail.com') {
      router.push('/dashboard');
      return;
    }
    setAdminEmail(user.email || '');
    loadData();
  };

  const loadData = async () => {
    const { data: r } = await supabase.from('activation_requests').select('*').order('created_at', { ascending: false });
    if (r) setRequests(r as ActivationRequest[]);
    const { data: u } = await supabase.from('users').select('*');
    if (u) setUsers(u as Profile[]);
  };

  const confirmPremium = async (userId: string, reqId: number) => {
    await supabase.from('users').update({ is_premium: true, premium_activated_at: new Date().toISOString() }).eq('id', userId);
    await supabase.from('activation_requests').update({ status: 'dikonfirmasi', confirmed_at: new Date().toISOString() }).eq('id', reqId);
    loadData();
  };

  const rejectPremium = async (reqId: number) => {
    await supabase.from('activation_requests').update({ status: 'ditolak' }).eq('id', reqId);
    loadData();
  };

  if (!adminEmail) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-primary">←</Link>
          <h1 className="font-bold text-accent">🛡️ Admin Panel</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Activation Requests */}
        <h2 className="font-bold text-lg mb-4">Permintaan Aktivasi Premium</h2>
        {requests.length === 0 ? (
          <p className="text-gray-400 text-sm">Belum ada permintaan.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const user = users.find((u) => u.id === req.user_id);
              return (
                <div key={req.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user?.nama || 'Unknown'} ({user?.email || '?'})</p>
                    <p className="text-sm text-gray-500">WA: {req.nomor_whatsapp}</p>
                    <p className="text-xs text-gray-400">Ref: {req.kode_referensi} | {new Date(req.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="flex gap-2">
                    {req.status === 'pending' && (
                      <>
                        <button onClick={() => confirmPremium(req.user_id, req.id)} className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl font-bold hover:bg-green-700">Konfirmasi</button>
                        <button onClick={() => rejectPremium(req.id)} className="px-4 py-2 bg-red-100 text-red-700 text-sm rounded-xl font-bold hover:bg-red-200">Tolak</button>
                      </>
                    )}
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      req.status === 'dikonfirmasi' ? 'bg-green-100 text-green-700' :
                      req.status === 'ditolak' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* User List */}
        <h2 className="font-bold text-lg mt-8 mb-4">Semua User ({users.length})</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr><th className="p-3 text-left">Nama</th><th className="p-3 text-left">Email</th><th className="p-3 text-center">Premium</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-50">
                  <td className="p-3">{u.nama || '-'}</td>
                  <td className="p-3 text-gray-500">{u.email}</td>
                  <td className="p-3 text-center">{u.is_premium ? <span className="text-green-600 font-bold">✅</span> : <span className="text-gray-300">❌</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
