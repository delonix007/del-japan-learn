'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { getDailyChallengeSystem, DailyChallenge, DailyChallengeSystem } from '@/lib/daily-challenge';
import { useAuthStore } from '@/stores/useAuthStore';

interface DailyChallengeCardProps {
    challenge: DailyChallenge;
    onStart: (challengeId: number) => void;
    onComplete: (challengeId: number, score: number, correct: number, total: number) => void;
}

function DailyChallengeCard({ challenge, onStart, onComplete }: DailyChallengeCardProps) {
    const [isActive, setIsActive] = useState(false);
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);

    const typeLabel = DailyChallengeSystem.getChallengeTypeLabel(challenge.challenge_type);
    const typeIcon = DailyChallengeSystem.getChallengeTypeIcon(challenge.challenge_type);
    const diffColor = DailyChallengeSystem.getDifficultyColor(challenge.difficulty);

    const handleStart = () => {
        setIsActive(true);
        onStart(challenge.id);
    };

    const handleComplete = () => {
        // Simulate some score (in real app, this would come from quiz results)
        const finalScore = Math.floor(Math.random() * 100);
        const correct = Math.floor(Math.random() * challenge.item_count);
        const total = challenge.item_count;

        setScore(finalScore);
        setCorrectCount(correct);
        setTotalAttempts(total);
        setIsActive(false);
        onComplete(challenge.id, finalScore, correct, total);
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
                    <span className="text-green-500 text-sm font-bold">✓ Done</span>
                </div>
            </div>
        );
    }

    if (isActive) {
        return (
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--color-border)] p-4">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{typeIcon}</span>
                    <div className="flex-1">
                        <h4 className="font-bold text-sm">{challenge.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${diffColor}`}>
                            {challenge.difficulty.toUpperCase()}
                        </span>
                    </div>
                </div>
                
                <div className="mb-4">
                    <p className="text-xs text-[var(--color-text-muted)] mb-2">
                        Jawab {challenge.item_count} pertanyaan untuk mendapatkan {challenge.exp_reward} EXP!
                    </p>
                    
                    {/* Mock quiz interface */}
                    <div className="p-3 bg-[var(--color-surface-2)] rounded-lg">
                        <p className="text-sm font-medium mb-3">Pertanyaan #{Math.floor(Math.random() * challenge.item_count) + 1}</p>
                        <div className="space-y-2">
                            {[1, 2, 3, 4].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        setCorrectCount(prev => prev + 1);
                                        setTotalAttempts(prev => prev + 1);
                                        if (totalAttempts + 1 >= challenge.item_count) {
                                            handleComplete();
                                        }
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors"
                                >
                                    Opsi {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--color-text-muted)]">
                        {totalAttempts}/{challenge.item_count} terjawab
                    </span>
                    <button
                        onClick={handleComplete}
                        className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Selesai
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--color-border)] p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{typeIcon}</span>
                <div className="flex-1">
                    <h4 className="font-bold text-sm">{challenge.title}</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">{challenge.description}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${diffColor}`}>
                    {challenge.difficulty.toUpperCase()}
                </span>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <span>⏱️ {DailyChallengeSystem.getTimeRemaining()} lagi</span>
                    <span>🎯 {challenge.item_count} soal</span>
                </div>
                <button
                    onClick={handleStart}
                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Mulai (+{challenge.exp_reward} EXP)
                </button>
            </div>
        </div>
    );
}

export default function DailyChallengeWidget() {
    const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalExpEarned, setTotalExpEarned] = useState(0);
    const user = useAuthStore(state => state.user);

    const supabase = user ? createClient() : null;
    const challengeSystem = supabase ? getDailyChallengeSystem(supabase) : null;

    useEffect(() => {
        if (user && challengeSystem) {
            loadChallenges();
        }
    }, [user, challengeSystem]);

    const loadChallenges = async () => {
        if (!challengeSystem || !user) return;
        
        setLoading(true);
        try {
            const data = await challengeSystem.getTodaysChallenges(user.id);
            setChallenges(data);
            
            // Calculate total possible EXP
            const totalExp = data.reduce((sum, c) => sum + (c.is_completed ? 0 : c.exp_reward), 0);
            setTotalExpEarned(totalExp);
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
            // Refresh challenges to show updated state
            loadChallenges();
        }
    };

    if (!user) {
        return (
            <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">
                Login untuk melihat challenge harian!
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (challenges.length === 0) {
        return (
            <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">
                Belum ada challenge hari ini. Kembali besok! 🎯
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-lg">🎯 Daily Challenges</h2>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        Selesaikan challenge hari ini untuk dapat EXP bonus!
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-[var(--color-text-muted)]">Total EXP Tersedia</p>
                    <p className="text-lg font-bold text-primary">{totalExpEarned} EXP</p>
                </div>
            </div>

            {/* Challenge cards */}
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

            {/* Reset timer */}
            <div className="text-center text-[10px] text-[var(--color-text-muted)]">
                Challenge di-reset setiap hari pukul 00:00 WIB
            </div>
        </div>
    );
}
