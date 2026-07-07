'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import type { ActivationRequest, Profile } from '@/types';

export default function AdminPage() {
  const supabase = createClient();
  const [requests, setRequests] = useState<ActivationRequest[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: r } = await supabase.from('activation_requests').select('*').order('created_at', { ascending: false });
    if (r) setRequests(r as ActivationRequest[]);
    const { data: u } = await supabase.from('users').select('*');
    if (u) setUsers(u as Profile[]);
  };

  const confirmPremium = async (userId: string, reqId: number) => {
    setLoading(prev => ({ ...prev, [reqId]: true }));
    setError('');
    const res = await fetch('/admin/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'confirm', userId, reqId }),
    });
    if (res.ok) { loadData(); } else { const d = await res.json().catch(() => ({})); setError(d.error || 'Gagal konfirmasi'); }
    setLoading(prev => ({ ...prev, [reqId]: false }));
  };

  const rejectPremium = async (reqId: number) => {
    setLoading(prev => ({ ...prev, [reqId]: true }));
    setError('');
    const res = await fetch('/admin/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', reqId }),
    });
    if (res.ok) { loadData(); } else { const d = await res.json().catch(() => ({})); setError(d.error || 'Gagal tolak'); }
    setLoading(prev => ({ ...prev, [reqId]: false }));
  };

  return (
      <div className="min-h-screen bg-[var(--bg-app)]">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-primary">←</Link>
          <h1 className="font-bold text-accent">🛡️ Admin Panel</h1>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">
              {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}
              {/* Activation Requests */}
        <h2 className="font-bold text-lg mb-4">Permintaan Aktivasi Premium</h2>
        {requests.length === 0 ? (
          <p className="text-gray-400 text-sm">Belum ada permintaan.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const user = users.find((u) => u.id === req.user_id);
              return (
                <div key={req.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user?.nama || 'Unknown'} ({user?.email || '?'})</p>
                    <p className="text-sm text-gray-500">WA: {req.nomor_whatsapp}</p>
                    <p className="text-xs text-gray-400">Ref: {req.kode_referensi} | {new Date(req.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="flex gap-2">
                    {req.status === 'pending' && (
                                          <>
                                            <button onClick={() => confirmPremium(req.user_id, req.id)} disabled={loading[req.id]} className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl font-bold hover:bg-green-700 disabled:opacity-50">{loading[req.id] ? '...' : 'Konfirmasi'}</button>
                                            <button onClick={() => rejectPremium(req.id)} disabled={loading[req.id]} className="px-4 py-2 bg-red-100 text-red-700 text-sm rounded-xl font-bold hover:bg-red-200 disabled:opacity-50">{loading[req.id] ? '...' : 'Tolak'}</button>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
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
