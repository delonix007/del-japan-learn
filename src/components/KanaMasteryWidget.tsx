'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { getKanaMasteryTracker, KanaMastery, KanaMasteryTracker, KanaCategory } from '@/lib/kana-mastery';
import { useAuthStore } from '@/stores/useAuthStore';

interface KanaHeatmapProps {
    category: KanaCategory;
    userId: string;
}

function KanaHeatmap({ category, userId }: KanaHeatmapProps) {
    const [kanaList, setKanaList] = useState<KanaMastery[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();
    const tracker = getKanaMasteryTracker(supabase);

    useEffect(() => {
        loadKana();
    }, [category, userId]);

    const loadKana = async () => {
        setLoading(true);
        try {
            const data = await tracker.getMasteryByCategory(userId, category);
            setKanaList(data);
        } catch (error) {
            console.error('[KanaHeatmap] Load error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (kanaList.length === 0) {
        return (
            <div className="text-center py-4 text-[var(--color-text-muted)] text-xs">
                Belum ada data untuk kategori ini.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-5 gap-2">
            {kanaList.map((kana) => {
                const color = KanaMasteryTracker.getMasteryColor(kana.mastery_level);
                const label = KanaMasteryTracker.getMasteryLabel(kana.mastery_level);
                
                return (
                    <div
                        key={kana.kana_id}
                        className="relative group"
                    >
                        <div className={`aspect-square rounded-lg ${color} flex items-center justify-center text-sm font-bold text-white cursor-pointer hover:scale-105 transition-transform`}>
                            {kana.character}
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--color-surface)] text-[var(--color-text)] text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            <div className="font-bold">{kana.character} = {kana.romaji}</div>
                            <div className="text-[10px] text-[var(--color-text-muted)]">
                                {label} ({kana.mastery_level}%)
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

interface WeakKanaListProps {
    userId: string;
}

function WeakKanaList({ userId }: WeakKanaListProps) {
    const [weakKana, setWeakKana] = useState<Array<{
        kana_id: number;
        character: string;
        romaji: string;
        category: KanaCategory;
        mastery_level: number;
        times_practiced: number;
    }>>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();
    const tracker = getKanaMasteryTracker(supabase);

    useEffect(() => {
        loadWeakKana();
    }, [userId]);

    const loadWeakKana = async () => {
        setLoading(true);
        try {
            const data = await tracker.getWeakKana(userId);
            setWeakKana(data);
        } catch (error) {
            console.error('[WeakKana] Load error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (weakKana.length === 0) {
        return (
            <div className="text-center py-4 text-[var(--color-text-muted)] text-xs">
                Tidak ada kana lemah. Bagus! 🎉
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {weakKana.map((kana) => (
                <div key={kana.kana_id} className="flex items-center gap-3 p-2 bg-[var(--color-surface-2)] rounded-lg">
                    <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center text-white font-bold">
                        {kana.character}
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-medium">{kana.romaji}</div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">
                            {KanaMasteryTracker.getCategoryLabel(kana.category)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-orange-500">{kana.mastery_level}%</div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">
                            {kana.times_practiced}x练习
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function KanaMasteryWidget() {
    const [activeCategory, setActiveCategory] = useState<KanaCategory>('hiragana_basic');
    const [overallProgress, setOverallProgress] = useState<{
        overall_mastery: number;
        hiragana_mastery: number;
        katakana_mastery: number;
    } | null>(null);
    const user = useAuthStore(state => state.user);

    const supabase = user ? createClient() : null;
    const tracker = supabase ? getKanaMasteryTracker(supabase) : null;

    useEffect(() => {
        if (user && tracker) {
            loadOverallProgress();
        }
    }, [user, tracker]);

    const loadOverallProgress = async () => {
        if (!tracker || !user) return;
        
        try {
            const data = await tracker.getOverallProgress(user.id);
            if (data) {
                setOverallProgress({
                    overall_mastery: data.overall_mastery,
                    hiragana_mastery: data.hiragana_mastery,
                    katakana_mastery: data.katakana_mastery,
                });
            }
        } catch (error) {
            console.error('[KanaMastery] Load error:', error);
        }
    };

    const categories: { key: KanaCategory; label: string; icon: string }[] = [
        { key: 'hiragana_basic', label: 'Hiragana Basic', icon: 'あ' },
        { key: 'hiragana_dakuten', label: 'Hiragana Dakuten', icon: 'が' },
        { key: 'hiragana_combo', label: 'Hiragana Combo', icon: 'きゃ' },
        { key: 'katakana_basic', label: 'Katakana Basic', icon: 'ア' },
        { key: 'katakana_dakuten', label: 'Katakana Dakuten', icon: 'ガ' },
        { key: 'katakana_combo', label: 'Katakana Combo', icon: 'キャ' },
    ];

    if (!user) {
        return (
            <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">
                Login untuk melihat Kana Mastery!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-lg">📊 Kana Mastery</h2>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        Track progress per karakter
                    </p>
                </div>
                {overallProgress && (
                    <div className="text-right">
                        <div className="text-xs text-[var(--color-text-muted)]">Overall Mastery</div>
                        <div className="text-lg font-bold text-primary">
                            {Math.round(overallProgress.overall_mastery)}%
                        </div>
                    </div>
                )}
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                            activeCategory === cat.key
                                ? 'border-primary bg-primary/20 text-primary'
                                : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'
                        }`}
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>

            {/* Heatmap */}
            <KanaHeatmap category={activeCategory} userId={user.id} />

            {/* Weak kana section */}
            <div>
                <h3 className="text-sm font-bold mb-3">⚠️ Kana Lemah (Perlu Review)</h3>
                <WeakKanaList userId={user.id} />
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[10px] text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-green-500"></span> Master (90%+)
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-green-400"></span> Proficient (70%+)
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-yellow-500"></span> Learning (50%+)
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-orange-500"></span> Familiar (20%+)
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-gray-400"></span> New (0-20%)
                </span>
            </div>
        </div>
    );
}
