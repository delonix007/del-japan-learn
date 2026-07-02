/**
 * ═══════════════════════════════════════════════════════════
 * Bunpou Progress Tracking — MNN Learning Style
 * ═══════════════════════════════════════════════════════════
 * 
 * Track progress belajar tata bahasa per pola:
 * - belum: Belum mulai
 * - belajar: Sedang dipelajari
 * - paham: Mengerti konsepnya
 * - hafal: Sudah dikuasai sepenuhnya
 * 
 * Features:
 * - Progress bar per lesson
 * - Overall mastery percentage
 * - Achievement badges
 * - Recommendation engine
 * ═══════════════════════════════════════════════════════════
 */

export type BunpouStatus = 'belum' | 'belajar' | 'paham' | 'hafal';

export interface BunpouProgress {
    bunpou_id: number;
    pola_grammar: string;
    status: BunpouStatus;
    times_reviewed: number;
    last_reviewed: string | null;
    progress_pct: number;
}

export interface BunpouOverallProgress {
    total_bunpou: number;
    mastered_count: number;
    learning_count: number;
    not_started_count: number;
    overall_pct: number;
}

export interface BunpouMastery {
    lesson_id: number;
    lesson_title: string;
    total: number;
    mastered: number;
    percentage: number;
}

class BunpouProgressTracker {
    private supabase: any = null;
    private cache: Map<string, BunpouProgress[]> = new Map();

    constructor(supabase?: any) {
        this.supabase = supabase;
    }

    /**
     * Get bunpou progress for a specific lesson
     */
    async getLessonProgress(
        userId: string,
        lessonId: number
    ): Promise<BunpouProgress[]> {
        const cacheKey = `bunpou_${userId}_${lessonId}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        if (!this.supabase) {
            console.warn('[BunpouProgress] Supabase not initialized');
            return [];
        }

        try {
            const { data, error } = await this.supabase
                .rpc('get_bunpou_progress_by_lesson', {
                    p_user_id: userId,
                    p_lesson_id: lessonId,
                });

            if (error) {
                console.error('[BunpouProgress] Fetch error:', error);
                return [];
            }

            const progress = (data || []) as BunpouProgress[];
            this.cache.set(cacheKey, progress);
            return progress;
        } catch (error) {
            console.error('[BunpouProgress] Error:', error);
            return [];
        }
    }

    /**
     * Get overall bunpou progress for a user
     */
    async getOverallProgress(userId: string): Promise<BunpouOverallProgress | null> {
        if (!this.supabase) return null;

        try {
            const { data, error } = await this.supabase
                .rpc('get_user_bunpou_overall_progress', {
                    p_user_id: userId,
                });

            if (error || !data || data.length === 0) {
                return null;
            }

            return data[0] as BunpouOverallProgress;
        } catch (error) {
            console.error('[BunpouProgress] Error:', error);
            return null;
        }
    }

    /**
     * Update bunpou progress (mark as learned)
     */
    async updateProgress(
        userId: string,
        bunpouId: number,
        status: BunpouStatus
    ): Promise<boolean> {
        if (!this.supabase) return false;

        try {
            const { error } = await this.supabase
                .rpc('update_bunpou_progress', {
                    p_user_id: userId,
                    p_bunpou_id: bunpouId,
                    p_status: status,
                });

            if (error) {
                console.error('[BunpouProgress] Update error:', error);
                return false;
            }

            // Clear cache for this user
            this.clearCache(userId);
            return true;
        } catch (error) {
            console.error('[BunpouProgress] Error:', error);
            return false;
        }
    }

    /**
     * Calculate mastery per lesson
     */
    async getLessonMastery(
        userId: string,
        lessons: Array<{ id: number; judul: string }>
    ): Promise<BunpouMastery[]> {
        const mastery: BunpouMastery[] = [];

        for (const lesson of lessons) {
            const progress = await this.getLessonProgress(userId, lesson.id);
            const total = progress.length;
            const mastered = progress.filter(p => p.status === 'hafal').length;
            const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;

            mastery.push({
                lesson_id: lesson.id,
                lesson_title: lesson.judul,
                total,
                mastered,
                percentage,
            });
        }

        return mastery;
    }

    /**
     * Get status label for UI
     */
    static getStatusLabel(status: BunpouStatus): string {
        switch (status) {
            case 'belum': return 'Belum';
            case 'belajar': return 'Belajar';
            case 'paham': return 'Paham';
            case 'hafal': return 'Hafal';
            default: return status;
        }
    }

    /**
     * Get status color for UI
     */
    static getStatusColor(status: BunpouStatus): string {
        switch (status) {
            case 'belum': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
            case 'belajar': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
            case 'paham': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'hafal': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    }

    /**
     * Get achievement badge based on progress
     */
    static getAchievementBadge(percentage: number): { icon: string; label: string } {
        if (percentage >= 100) return { icon: '🏆', label: 'Master' };
        if (percentage >= 75) return { icon: '⭐', label: 'Expert' };
        if (percentage >= 50) return { icon: '🌟', label: 'Advanced' };
        if (percentage >= 25) return { icon: '✨', label: 'Learner' };
        return { icon: '📚', label: 'Beginner' };
    }

    private clearCache(userId: string): void {
        const keysToDelete: string[] = [];
        this.cache.forEach((_, key) => {
            if (key.startsWith(`bunpou_${userId}_`)) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.cache.delete(key));
    }
}

// Singleton instance
let bunpouProgressInstance: BunpouProgressTracker | null = null;

export function getBunpouProgressTracker(supabase?: any): BunpouProgressTracker {
    if (!bunpouProgressInstance) {
        bunpouProgressInstance = new BunpouProgressTracker(supabase);
    }
    return bunpouProgressInstance;
}
