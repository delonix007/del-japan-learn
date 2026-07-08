'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { getBunpouProgressTracker, BunpouProgress, BunpouStatus } from '@/lib/bunpou-progress';
import type { Bunpou } from '@/types';

// Helper functions for UI (mirroring the class methods)
const getStatusColor = (status: BunpouStatus): string => {
    switch (status) {
        case 'belum': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
        case 'belajar': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
        case 'paham': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
        case 'hafal': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
        default: return 'bg-gray-100 text-gray-600';
    }
};

const getStatusLabel = (status: BunpouStatus): string => {
    switch (status) {
        case 'belum': return 'Belum';
        case 'belajar': return 'Belajar';
        case 'paham': return 'Paham';
        case 'hafal': return 'Hafal';
        default: return status;
    }
};

interface BunpouProgressItemProps {
    bunpou: Bunpou;
    progress: BunpouProgress | null;
    onUpdate: (bunpouId: number, status: BunpouStatus) => void;
    lessonId: number;
    userId: string;
    onExpReward?: (exp: number) => void;
}

function BunpouProgressItem({ bunpou, progress, onUpdate, lessonId, userId, onExpReward }: BunpouProgressItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [subTab, setSubTab] = useState(0);
    const status = progress?.status || 'belum';
    const statusColor = getStatusColor(status);
    const statusLabel = getStatusLabel(status);

    const statusOptions: BunpouStatus[] = ['belum', 'belajar', 'paham', 'hafal'];

    // Auto-mark as 'belajar' and reward EXP on first expand
    const handleToggle = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (newState && !progress) {
            // First time reading this bunpou — mark as 'belajar' and reward EXP
            onUpdate(bunpou.id, 'belajar');
            if (onExpReward) onExpReward(5);
        }
    };

    // ponytail: build sub-tabs from the 4 new fields, fallback to penjelasan+contoh if none
    const subTabs: { label: string; icon: string; content: string | null }[] = [];
    if (bunpou.struktur || bunpou.fungsi || bunpou.kesalahan || bunpou.mirip) {
        if (bunpou.struktur) subTabs.push({ label: '📐 Struktur', icon: '📐', content: bunpou.struktur });
        if (bunpou.fungsi) subTabs.push({ label: '💡 Fungsi', icon: '💡', content: bunpou.fungsi });
        if (bunpou.kesalahan) subTabs.push({ label: '⚠️ Kesalahan', icon: '⚠️', content: bunpou.kesalahan });
        if (bunpou.mirip) subTabs.push({ label: '🔄 Mirip', icon: '🔄', content: bunpou.mirip });
    }

    return (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
            {/* Header - clickable to expand */}
            <button 
                onClick={handleToggle}
                className="w-full flex items-center gap-2 p-3 text-left hover:bg-[var(--bg-card-hover)] transition-colors"
            >
                {/* 📌 Pin emoji */}
                <span className="text-sm shrink-0">📌</span>
                
                {/* Grammar pattern */}
                <span className="flex-1 font-medium text-sm">{bunpou.pola_grammar}</span>
                
                {/* Status indicators row */}
                <div className="flex items-center gap-1.5 shrink-0">
                    {/* Read status */}
                    {progress && (
                        <span className="text-[10px] text-green-500 flex items-center gap-0.5">
                            ✓ Dibaca
                        </span>
                    )}
                    {/* Exercise status */}
                    <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-0.5">
                        ✏️ {progress ? 'Sudah Latihan' : 'Belum Latihan'}
                    </span>
                </div>
                
                {/* Expand arrow */}
                <span className={`text-xs text-[var(--color-text-muted)] transition-transform ${
                    isOpen ? 'rotate-180' : ''
                }`}>
                    ▼
                </span>
            </button>

            {/* Expanded content */}
            {isOpen && (
                <div className="px-3 pb-3 pt-0 border-t border-[var(--color-border)]">
                    {/* Sub-tabs (MNN style: Struktur/Fungsi/Kesalahan/Mirip) */}
                    {subTabs.length > 1 && (
                        <div className="flex gap-1 mt-2 mb-3 bg-[var(--color-surface-2)] rounded-lg p-0.5">
                            {subTabs.map((t, i) => (
                                <button
                                    key={t.label}
                                    onClick={() => setSubTab(i)}
                                    className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                                        subTab === i
                                            ? 'bg-[var(--color-primary)] text-white'
                                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Sub-tab content */}
                    {subTabs.length > 0 ? (
                        <p className="text-xs text-[var(--color-text-muted)] mb-3 whitespace-pre-wrap">
                            {subTabs[subTab]?.content}
                        </p>
                    ) : (
                        <>
                            {/* Fallback: penjelasan + contoh for old data */}
                            <p className="text-xs text-[var(--color-text-muted)] mt-2 mb-3">
                                {bunpou.penjelasan}
                            </p>
                            {bunpou.contoh && (
                                <div className="mb-3 p-2 bg-[var(--color-surface-2)] rounded-lg text-xs font-medium">
                                    {bunpou.contoh}
                                </div>
                            )}
                        </>
                    )}

                    {/* Date stamp */}
                    <p className="text-[10px] text-[var(--color-text-muted)] mb-2 flex items-center gap-1">
                        📅 {new Date(bunpou.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>

                    {/* Review count */}
                    {progress && progress.times_reviewed > 0 && (
                        <p className="text-[10px] text-[var(--color-text-muted)] mb-2">
                            Sudah di-review {progress.times_reviewed}x
                            {progress.last_reviewed && ` • Terakhir: ${new Date(progress.last_reviewed).toLocaleDateString('id-ID')}`}
                        </p>
                    )}

                    {/* Status selection buttons */}
                    <div className="flex gap-2 mt-3">
                        {statusOptions.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => onUpdate(bunpou.id, opt)}
                                className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg border transition-all ${
                                    status === opt
                                        ? opt === 'hafal'
                                            ? 'border-green-500 bg-green-600/20 text-green-600'
                                            : opt === 'paham'
                                            ? 'border-yellow-500 bg-yellow-600/20 text-yellow-600'
                                            : opt === 'belajar'
                                            ? 'border-blue-500 bg-blue-600/20 text-blue-600'
                                            : 'border-gray-500 bg-gray-600/20 text-gray-600'
                                        : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'
                                }`}
                            >
                                {getStatusLabel(opt)}
                            </button>
                        ))}
                    </div>

                    {/* Reibun Creator — buat kalimat sendiri */}
                    <ReibunCreator bunpou={bunpou} lessonId={lessonId} userId={userId} />
                </div>
            )}
        </div>
    );
}

// Reibun Creator sub-component
function ReibunCreator({ bunpou, lessonId, userId }: { bunpou: Bunpou; lessonId: number; userId: string }) {
    const [sentence, setSentence] = useState('');
    const [feedback, setFeedback] = useState<{ is_correct: boolean; correction: string; feedback: string } | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const checkSentence = async () => {
        if (!sentence.trim()) return;
        setIsChecking(true);
        setFeedback(null);
        try {
            const res = await fetch('/api/check-reibun', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sentence: sentence.trim(),
                    pattern: bunpou.pola_grammar,
                }),
            });
            if (!res.ok) {
                setFeedback({ is_correct: false, correction: '', feedback: `Error ${res.status}: ${res.statusText}` });
                setIsChecking(false);
                return;
            }
            const data = await res.json();
            setFeedback(data);
        } catch (err) {
            setFeedback({ is_correct: false, correction: '', feedback: `Error: ${err instanceof Error ? err.message : 'Unknown error'}` });
        }
        setIsChecking(false);
    };

    return (
        <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-2 flex items-center gap-1">
                ✍️ Reibun Creator — Buat Kalimatmu Sendiri
            </p>
            <textarea
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder={`Gunakan pola: ${bunpou.pola_grammar}\nContoh: ${bunpou.contoh || bunpou.penjelasan?.slice(0, 30) + '...'}`}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] outline-none text-sm resize-none h-20 mb-2"
            />
            <div className="flex gap-2">
                <button
                    onClick={() => { setSentence(''); setFeedback(null); }}
                    className="px-3 py-2 bg-[var(--color-surface-2)] rounded-lg text-xs text-[var(--color-text-muted)]"
                >
                    Hapus
                </button>
                <button
                    onClick={checkSentence}
                    disabled={isChecking || !sentence.trim()}
                    className="flex-1 py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-bold disabled:opacity-50"
                >
                    {isChecking ? 'Sedang mengecek...' : '✓ Cek Kalimat'}
                </button>
            </div>
            {feedback && (
                <div className={`mt-2 p-2 rounded-lg border text-xs ${
                    feedback.is_correct
                        ? 'bg-green-600/10 border-green-600/30 text-green-400'
                        : 'bg-red-600/10 border-red-600/30 text-red-400'
                }`}>
                    <p className="font-bold mb-1">
                        {feedback.is_correct ? '✅ Benar!' : '❌ Ada kesalahan'}
                    </p>
                    <p className="mb-1">{feedback.feedback}</p>
                    {feedback.correction && (
                        <p className="text-[var(--color-text)] font-medium">
                            🔁 Koreksi: {feedback.correction}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

interface BunpouProgressListProps {
    bunpouList: Bunpou[];
    lessonId: number;
    userId: string;
    onExpReward?: (exp: number) => void;
}

export default function BunpouProgressList({ bunpouList, lessonId, userId, onExpReward }: BunpouProgressListProps) {
    const [progressMap, setProgressMap] = useState<Map<number, BunpouProgress>>(new Map());
    const [loading, setLoading] = useState(true);
    const [overallProgress, setOverallProgress] = useState<number>(0);

    const supabase = createClient();
    const tracker = getBunpouProgressTracker(supabase);

    useEffect(() => {
        loadProgress();
    }, [lessonId, userId]);

    const loadProgress = async () => {
        setLoading(true);
        try {
            const progress = await tracker.getLessonProgress(userId, lessonId);
            const map = new Map<number, BunpouProgress>();
            progress.forEach(p => map.set(p.bunpou_id, p));
            setProgressMap(map);

            // Calculate overall percentage
            if (progress.length > 0) {
                const totalPct = progress.reduce((sum, p) => sum + p.progress_pct, 0);
                setOverallProgress(Math.round(totalPct / progress.length));
            }
        } catch (error) {
            console.error('[BunpouProgress] Load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (bunpouId: number, status: BunpouStatus) => {
        const success = await tracker.updateProgress(userId, bunpouId, status);
        if (success) {
            // Update local state optimistically
            const newMap = new Map(progressMap);
            const existing = newMap.get(bunpouId);
            if (existing) {
                newMap.set(bunpouId, {
                    ...existing,
                    status,
                    times_reviewed: existing.times_reviewed + 1,
                    last_reviewed: new Date().toISOString(),
                    progress_pct: status === 'hafal' ? 100 : status === 'paham' ? 60 : status === 'belajar' ? 25 : 0,
                });
            } else {
                newMap.set(bunpouId, {
                    bunpou_id: bunpouId,
                    pola_grammar: '',
                    status,
                    times_reviewed: 1,
                    last_reviewed: new Date().toISOString(),
                    progress_pct: status === 'hafal' ? 100 : status === 'paham' ? 60 : status === 'belajar' ? 25 : 0,
                });
            }
            setProgressMap(newMap);
            loadProgress(); // Reload to get accurate overall progress
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (bunpouList.length === 0) {
        return (
            <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">
                Belum ada pola grammar untuk pelajaran ini.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Overall progress bar */}
            <div className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[var(--color-text)]">
                        Progress Bunpou
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                        {overallProgress}%
                    </span>
                </div>
                <div className="w-full h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-300"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-[var(--color-text-muted)]">
                    <span>{bunpouList.filter(b => progressMap.get(b.id)?.status === 'hafal').length} hafal</span>
                    <span>{bunpouList.filter(b => progressMap.get(b.id)?.status === 'paham').length} paham</span>
                    <span>{bunpouList.filter(b => progressMap.get(b.id)?.status === 'belajar').length} belajar</span>
                    <span>{bunpouList.filter(b => !progressMap.get(b.id) || progressMap.get(b.id)?.status === 'belum').length} belum</span>
                </div>
            </div>

            {/* Individual bunpou items */}
            {bunpouList.map((b) => (
                <BunpouProgressItem
                    key={b.id}
                    bunpou={b}
                    progress={progressMap.get(b.id) || null}
                    onUpdate={handleUpdate}
                    lessonId={lessonId}
                    userId={userId}
                    onExpReward={onExpReward}
                />
            ))}
        </div>
    );
}
