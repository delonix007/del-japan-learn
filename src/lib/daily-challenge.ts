/**
 * ═══════════════════════════════════════════════════════════
 * Daily Challenge System — MNN Learning Style
 * ═══════════════════════════════════════════════════════════
 * 
 * Challenge harian dengan EXP bonus:
 * - Kosa Kata (vocab)
 * - Kana (hiragana/katakana writing)
 * - Grammar (bunpou)
 * - Kanji (reading/writing)
 * - Listening (audio comprehension)
 * - Reading (comprehension)
 * 
 * Features:
 * - Daily rotating challenges
 * - EXP bonus multipliers
 * - Streak tracking
 * - Leaderboard integration
 * ═══════════════════════════════════════════════════════════
 */

export type ChallengeType = 'vocab' | 'kana' | 'bunpou' | 'kanji' | 'listening' | 'reading';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeStatus = 'in_progress' | 'completed' | 'failed';

export interface DailyChallenge {
    id: number;
    title: string;
    description: string;
    challenge_type: ChallengeType;
    difficulty: ChallengeDifficulty;
    exp_reward: number;
    item_count: number;
    items: any[];
    is_completed: boolean;
}

export interface UserDailyChallenge {
    id: number;
    user_id: string;
    challenge_id: number;
    status: ChallengeStatus;
    score: number;
    correct_count: number;
    total_attempts: number;
    exp_earned: number;
    started_at: string;
    completed_at: string | null;
}

export interface DailyStats {
    date: string;
    challenges_completed: number;
    total_exp_earned: number;
    best_score: number;
}

export class DailyChallengeSystem {
    private supabase: any = null;
    private cache: Map<string, DailyChallenge[]> = new Map();
    private userProgress: Map<number, UserDailyChallenge> = new Map();

    constructor(supabase?: any) {
        this.supabase = supabase;
    }

    /**
     * Get today's active challenges
     */
    async getTodaysChallenges(userId: string): Promise<DailyChallenge[]> {
        const cacheKey = `daily_${new Date().toISOString().split('T')[0]}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        if (!this.supabase) {
            console.warn('[DailyChallenge] Supabase not initialized');
            return [];
        }

        try {
            const { data, error } = await this.supabase
                .rpc('get_todays_challenges');

            if (error) {
                console.error('[DailyChallenge] Fetch error:', error);
                return [];
            }

            const challenges = (data || []) as DailyChallenge[];
            this.cache.set(cacheKey, challenges);
            
            // Mark user's completed challenges
            challenges.forEach(c => {
                if (c.is_completed) {
                    this.userProgress.set(c.id, {
                        id: 0,
                        user_id: userId,
                        challenge_id: c.id,
                        status: 'completed',
                        score: 0,
                        correct_count: 0,
                        total_attempts: 0,
                        exp_earned: 0,
                        started_at: '',
                        completed_at: null,
                    } as UserDailyChallenge);
                }
            });

            return challenges;
        } catch (error) {
            console.error('[DailyChallenge] Error:', error);
            return [];
        }
    }

    /**
     * Start a challenge
     */
    async startChallenge(userId: string, challengeId: number): Promise<number | null> {
        if (!this.supabase) return null;

        try {
            const { data, error } = await this.supabase
                .rpc('start_daily_challenge', { p_challenge_id: challengeId });

            if (error) {
                console.error('[DailyChallenge] Start error:', error);
                return null;
            }

            return data as number;
        } catch (error) {
            console.error('[DailyChallenge] Error:', error);
            return null;
        }
    }

    /**
     * Complete a challenge with score
     */
    async completeChallenge(
        userId: string,
        challengeId: number,
        score: number,
        correctCount: number,
        totalAttempts: number
    ): Promise<{ exp_earned: number; challenge_completed: boolean } | null> {
        if (!this.supabase) return null;

        try {
            const { data, error } = await this.supabase
                .rpc('complete_daily_challenge', {
                    p_challenge_id: challengeId,
                    p_score: score,
                    p_correct_count: correctCount,
                    p_total_attempts: totalAttempts,
                });

            if (error) {
                console.error('[DailyChallenge] Complete error:', error);
                return null;
            }

            const result = data as any;
            if (result && result.length > 0) {
                return {
                    exp_earned: result[0].exp_earned,
                    challenge_completed: result[0].challenge_completed,
                };
            }

            return null;
        } catch (error) {
            console.error('[DailyChallenge] Error:', error);
            return null;
        }
    }

    /**
     * Get user's daily stats
     */
    async getUserStats(userId: string, days: number = 7): Promise<DailyStats[]> {
        if (!this.supabase) return [];

        try {
            const { data, error } = await this.supabase
                .rpc('get_user_daily_stats', {
                    p_user_id: userId,
                    p_days: days,
                });

            if (error) {
                console.error('[DailyChallenge] Stats error:', error);
                return [];
            }

            return (data || []) as DailyStats[];
        } catch (error) {
            console.error('[DailyChallenge] Error:', error);
            return [];
        }
    }

    /**
     * Get challenge type label
     */
    static getChallengeTypeLabel(type: ChallengeType): string {
        const labels: Record<ChallengeType, string> = {
            vocab: 'Kosa Kata',
            kana: 'Kana',
            bunpou: 'Grammar',
            kanji: 'Kanji',
            listening: 'Listening',
            reading: 'Reading',
        };
        return labels[type];
    }

    /**
     * Get challenge type icon
     */
    static getChallengeTypeIcon(type: ChallengeType): string {
        const icons: Record<ChallengeType, string> = {
            vocab: '📚',
            kana: 'あ',
            bunpou: '📝',
            kanji: '漢',
            listening: '🎧',
            reading: '📖',
        };
        return icons[type];
    }

    /**
     * Get difficulty color
     */
    static getDifficultyColor(difficulty: ChallengeDifficulty): string {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    /**
     * Get EXP multiplier based on difficulty
     */
    static getExpMultiplier(difficulty: ChallengeDifficulty): number {
        switch (difficulty) {
            case 'easy': return 1.0;
            case 'medium': return 1.5;
            case 'hard': return 2.0;
            default: return 1.0;
        }
    }

    /**
     * Format challenge time remaining
     */
    static getTimeRemaining(): string {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours}j ${minutes}m`;
    }
}

// Singleton instance
let dailyChallengeInstance: DailyChallengeSystem | null = null;

export function getDailyChallengeSystem(supabase?: any): DailyChallengeSystem {
    if (!dailyChallengeInstance) {
        dailyChallengeInstance = new DailyChallengeSystem(supabase);
    }
    return dailyChallengeInstance;
}
