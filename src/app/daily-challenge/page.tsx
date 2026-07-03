'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { getDailyChallengeSystem, DailyChallenge, DailyChallengeSystem } from '@/lib/daily-challenge';
import DailyChallengeWidget from '@/components/DailyChallengeWidget';

export default function DailyChallengePage() {
    const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [expStats, setExpStats] = useState({ streak: 0, total_exp: 0, level: 1, total_available: 0 });
    const user = useAuthStore(state => state.user);
    const router = useRouter();

    const supabase = user ? createClient() : null;
    const challengeSystem = supabase ? getDailyChallengeSystem(supabase) : null;

    useEffect(() => {
        if (user && challengeSystem) {
            loadChallenges();
        } else if (!user) {
            router.push('/auth');
        }
    }, [user, challengeSystem]);

    const loadChallenges = async () => {
        if (!challengeSystem || !user) return;

        setLoading(true);
        try {
            const data = await challengeSystem.getTodaysChallenges(user.id);
            setChallenges(data);

            const totalExp = data.reduce((sum, c) => sum + (c.is_completed ? 0 : c.exp_reward), 0);
            setExpStats({
                streak: 0,
                total_exp: 0,
                level: 1,
                total_available: totalExp,
            });
        } catch (error) {
            console.error('[DailyChallenge] Load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStart = async (challengeId: number) => {
        if (!challengeSystem || !user) return;
        await challengeSystem.startChallenge(user.id, challengeId);
    };

    const handleComplete = async (challengeId: number, score: number, correct: number, total: number) => {
        if (!challengeSystem || !user) return;

        const result = await challengeSystem.completeChallenge(user.id, challengeId, score, correct, total);
        if (result) {
            setExpStats({
                streak: result.streak_harian || 0,
                total_exp: result.total_exp || 0,
                level: result.level || 1,
                total_available: expStats.total_available,
            });
            loadChallenges();
        }
    };

    if (!user || loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const completedCount = challenges.filter(c => c.is_completed).length;
    const totalCount = challenges.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="min-h-screen bg-[var(--bg-page)]">
            {/* Sticky header */}
            <header className="sticky top-0 z-10 bg-[var(--bg-card)] border-b border-[var(--color-border)] px-4 py-3">
                <div className="max-w-lg mx-auto flex items-center gap-3">
                    <Link href="/dashboard" className="text-xl">←</Link>
                    <h1 className="font-bold text-lg flex-1">🎯 Daily Challenge</h1>
                    <div className="text-right">
                        <p className="text-xs text-[var(--color-text-muted)]">Streak</p>
                        <p className="text-sm font-bold text-primary">{expStats.streak} hari</p>
                    </div>
                </div>
            </header>

            <main className="max-w-lg mx-auto p-4 space-y-4">
                {/* Stats bar */}
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--color-border)] p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-xs text-[var(--color-text-muted)]">Progress Hari Ini</p>
                            <p className="text-lg font-bold">{completedCount}/{totalCount} selesai</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-[var(--color-text-muted)]">EXP Tersedia</p>
                            <p className="text-lg font-bold text-primary">{expStats.total_available} EXP</p>
                        </div>
                    </div>
                    <div className="h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-2 text-center">
                        ⏱️ Reset dalam {DailyChallengeSystem.getTimeRemaining()}
                    </p>
                </div>

                {/* Challenge list */}
                {challenges.length === 0 ? (
                    <div className="text-center py-12 text-[var(--color-text-muted)]">
                        <div className="text-4xl mb-3">🎯</div>
                        <p className="font-bold mb-1">Belum ada challenge hari ini</p>
                        <p className="text-xs">Kembali besok buat tantangan baru!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {challenges.map((challenge) => (
                            <DailyChallengeCard
                                key={challenge.id}
                                challenge={challenge}
                                onStart={handleStart}
                                onComplete={handleComplete}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

// Reuse the card component from widget (inline to avoid circular imports)
function DailyChallengeCard({ challenge, onStart, onComplete }: {
    challenge: DailyChallenge;
    onStart: (challengeId: number) => void;
    onComplete: (challengeId: number, score: number, correct: number, total: number) => void;
}) {
    const [isActive, setIsActive] = useState(false);
    const [currentItem, setCurrentItem] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const typeLabel = DailyChallengeSystem.getChallengeTypeLabel(challenge.challenge_type);
    const typeIcon = DailyChallengeSystem.getChallengeTypeIcon(challenge.challenge_type);
    const diffColor = DailyChallengeSystem.getDifficultyColor(challenge.difficulty);
    const items: { q: string; o: string[]; a: number }[] = Array.isArray(challenge.items) ? challenge.items : [];

    const handleStart = () => {
        setIsActive(true);
        setCurrentItem(0);
        setCorrectCount(0);
        setTotalAttempts(0);
        onStart(challenge.id);
    };

    const handleAnswer = (optIdx: number) => {
        if (selected !== null) return;
        setSelected(optIdx);
        const isCorrect = items[currentItem]?.a === optIdx;
        if (isCorrect) setCorrectCount(prev => prev + 1);
        setTotalAttempts(prev => prev + 1);
        setFeedback(isCorrect ? 'correct' : 'wrong');
    };

    const handleNext = () => {
        if (currentItem + 1 >= items.length) {
            const score = Math.round((correctCount / items.length) * 100);
            onComplete(challenge.id, score, correctCount, items.length);
            setIsActive(false);
            return;
        }
        setCurrentItem(prev => prev + 1);
        setSelected(null);
        setFeedback(null);
    };

    if (challenge.is_completed) {
        return (
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--color-border)] p-4 opacity-60">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{typeIcon}</span>
                    <div className="flex-1">
                        <h4 className="font-bold text-sm">{challenge.title}</h4>
                        <p className="text-xs text-[var(--color-text-muted)]">{challenge.description}</p>
                    </div>
                    <span className="text-green-500 text-sm font-bold">✓ Selesai</span>
                </div>
            </div>
        );
    }

    if (isActive && items.length > 0) {
        const item = items[currentItem];
        const correctAnswer = item?.o[item?.a] || '?';
        return (
            <div className="bg-[var(--bg-card)] rounded-xl border border-primary/40 p-4">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{typeIcon}</span>
                    <h4 className="font-bold text-sm">{challenge.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${diffColor} ml-auto`}>
                        {challenge.difficulty.toUpperCase()}
                    </span>
                </div>

                <div className="p-4 bg-[var(--color-surface-2)] rounded-xl mb-3">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">
                        {currentItem + 1}/{items.length}
                    </p>
                    <p className="text-lg font-bold mb-3">{item.q}</p>
                    <div className="space-y-2">
                        {item.o.map((opt, idx) => {
                            let btnClass = 'border-[var(--color-border)] hover:border-primary/50';
                            if (selected === idx && idx === item.a) btnClass = 'border-green-500 bg-green-600/10';
                            else if (selected === idx && idx !== item.a) btnClass = 'border-red-500 bg-red-600/10';
                            else if (feedback && idx === item.a) btnClass = 'border-green-500 bg-green-600/10';

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={selected !== null}
                                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${btnClass}`}
                                >
                                    {opt}
                                    {feedback && idx === item.a && selected !== item.a && (
                                        <span className="ml-2 text-green-500">← benar</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {feedback && (
                        <p className={`text-xs mt-3 font-bold ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                            {feedback === 'correct' ? '✅ Benar!' : `❌ Salah! Jawaban: ${correctAnswer}`}
                        </p>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--color-text-muted)]">
                        {correctCount}/{totalAttempts || items.length} benar
                    </span>
                    {feedback && (
                        <button
                            onClick={handleNext}
                            className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl"
                        >
                            {currentItem + 1 >= items.length ? '✅ Selesai' : 'Lanjut →'}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (isActive) {
        return (
            <div className="bg-[var(--bg-card)] rounded-xl border border-primary/40 p-4">
                <p className="text-xs text-[var(--color-text-muted)] text-center py-4">
                    Challenge ini belum punya soal. Klik Selesai buat claim EXP.
                </p>
                <button
                    onClick={() => onComplete(challenge.id, 100, challenge.item_count, challenge.item_count)}
                    className="w-full py-2 bg-primary text-white text-sm font-bold rounded-xl"
                >
                    Selesai (+{challenge.exp_reward} EXP)
                </button>
            </div>
        );
    }

    const expMultiplier = challenge.difficulty === 'hard' ? '2.0x' : challenge.difficulty === 'medium' ? '1.5x' : '1.0x';
    return (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--color-border)] p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{typeIcon}</span>
                <div className="flex-1">
                    <h4 className="font-bold text-sm">{challenge.title}</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">{challenge.description}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${diffColor}`}>
                    {challenge.difficulty.toUpperCase()} {expMultiplier}
                </span>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <span>⏱️ {DailyChallengeSystem.getTimeRemaining()} lagi</span>
                    <span>🎯 {challenge.item_count} soal</span>
                </div>
                <button
                    onClick={handleStart}
                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                    Mulai (+{challenge.exp_reward} EXP)
                </button>
            </div>
        </div>
    );
}