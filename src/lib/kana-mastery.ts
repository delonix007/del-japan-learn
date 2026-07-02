/**
 * ═══════════════════════════════════════════════════════════
 * Kana Mastery Enhancement — MNN Learning Style
 * ═══════════════════════════════════════════════════════════
 * 
 * Track mastery per karakter kana:
 * - Hiragana Basic (あ い う え お ...)
 * - Hiragana Dakuten (が ぎ ぐ げ ご ...)
 * - Hiragana Combo (きゃ きゅ きょ ...)
 * - Katakana Basic (ア イ ウ エ オ ...)
 * - Katakana Dakuten (ガ ギ グ ゲ ゴ ...)
 * - Katakana Combo (キャ キュ キョ ...)
 * 
 * Features:
 * - Per-character mastery (0-100)
 * - Weak character detection
 * - Category-based progress
 * - Heatmap visualization
 * - Spaced repetition recommendations
 * ═══════════════════════════════════════════════════════════
 */

export type KanaCategory = 
    | 'hiragana_basic' 
    | 'hiragana_dakuten' 
    | 'hiragana_combo' 
    | 'katakana_basic' 
    | 'katakana_dakuten' 
    | 'katakana_combo';

export interface KanaMastery {
    kana_id: number;
    character: string;
    romaji: string;
    mastery_level: number;
    times_practiced: number;
    accuracy: number;
}

export interface KanaOverallProgress {
    total_kana: number;
    mastered_count: number;
    learning_count: number;
    not_started_count: number;
    overall_mastery: number;
    hiragana_mastery: number;
    katakana_mastery: number;
}

export interface WeakKana {
    kana_id: number;
    character: string;
    romaji: string;
    category: KanaCategory;
    mastery_level: number;
    times_practiced: number;
}

export class KanaMasteryTracker {
    private supabase: any = null;
    private cache: Map<string, KanaMastery[]> = new Map();

    constructor(supabase?: any) {
        this.supabase = supabase;
    }

    /**
     * Get kana mastery by category
     */
    async getMasteryByCategory(
        userId: string,
        category: KanaCategory
    ): Promise<KanaMastery[]> {
        const cacheKey = `kana_${userId}_${category}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        if (!this.supabase) {
            console.warn('[KanaMastery] Supabase not initialized');
            return [];
        }

        try {
            const { data, error } = await this.supabase
                .rpc('get_kana_mastery_by_category', {
                    p_user_id: userId,
                    p_category: category,
                });

            if (error) {
                console.error('[KanaMastery] Fetch error:', error);
                return [];
            }

            const mastery = (data || []) as KanaMastery[];
            this.cache.set(cacheKey, mastery);
            return mastery;
        } catch (error) {
            console.error('[KanaMastery] Error:', error);
            return [];
        }
    }

    /**
     * Get overall kana progress for a user
     */
    async getOverallProgress(userId: string): Promise<KanaOverallProgress | null> {
        if (!this.supabase) return null;

        try {
            const { data, error } = await this.supabase
                .rpc('get_user_kana_overall_progress', {
                    p_user_id: userId,
                });

            if (error || !data || data.length === 0) {
                return null;
            }

            return data[0] as KanaOverallProgress;
        } catch (error) {
            console.error('[KanaMastery] Error:', error);
            return null;
        }
    }

    /**
     * Update kana mastery after practice
     */
    async updateMastery(
        userId: string,
        kanaId: number,
        isCorrect: boolean
    ): Promise<boolean> {
        if (!this.supabase) return false;

        try {
            const { error } = await this.supabase
                .rpc('update_kana_mastery', {
                    p_user_id: userId,
                    p_kana_id: kanaId,
                    p_correct: isCorrect,
                });

            if (error) {
                console.error('[KanaMastery] Update error:', error);
                return false;
            }

            // Clear cache for this user
            this.clearCache(userId);
            return true;
        } catch (error) {
            console.error('[KanaMastery] Error:', error);
            return false;
        }
    }

    /**
     * Get weak kana (mastery < 50) for review
     */
    async getWeakKana(userId: string): Promise<WeakKana[]> {
        if (!this.supabase) return [];

        try {
            const { data, error } = await this.supabase
                .rpc('get_weak_kana', {
                    p_user_id: userId,
                });

            if (error) {
                console.error('[KanaMastery] Weak kana error:', error);
                return [];
            }

            return (data || []) as WeakKana[];
        } catch (error) {
            console.error('[KanaMastery] Error:', error);
            return [];
        }
    }

    /**
     * Get mastery level label
     */
    static getMasteryLabel(level: number): string {
        if (level >= 90) return 'Master';
        if (level >= 70) return 'Proficient';
        if (level >= 50) return 'Learning';
        if (level >= 20) return 'Familiar';
        return 'New';
    }

    /**
     * Get mastery level color
     */
    static getMasteryColor(level: number): string {
        if (level >= 90) return 'bg-green-500';
        if (level >= 70) return 'bg-green-400';
        if (level >= 50) return 'bg-yellow-500';
        if (level >= 20) return 'bg-orange-500';
        return 'bg-gray-400';
    }

    /**
     * Get category label
     */
    static getCategoryLabel(category: KanaCategory): string {
        const labels: Record<KanaCategory, string> = {
            hiragana_basic: 'Hiragana Basic',
            hiragana_dakuten: 'Hiragana Dakuten',
            hiragana_combo: 'Hiragana Combo',
            katakana_basic: 'Katakana Basic',
            katakana_dakuten: 'Katakana Dakuten',
            katakana_combo: 'Katakana Combo',
        };
        return labels[category];
    }

    /**
     * Get category icon
     */
    static getCategoryIcon(category: KanaCategory): string {
        if (category.includes('hiragana')) return 'あ';
        return 'ア';
    }

    private clearCache(userId: string): void {
        const keysToDelete: string[] = [];
        this.cache.forEach((_, key) => {
            if (key.startsWith(`kana_${userId}_`)) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.cache.delete(key));
    }
}

// Singleton instance
let kanaMasteryInstance: KanaMasteryTracker | null = null;

export function getKanaMasteryTracker(supabase?: any): KanaMasteryTracker {
    if (!kanaMasteryInstance) {
        kanaMasteryInstance = new KanaMasteryTracker(supabase);
    }
    return kanaMasteryInstance;
}
