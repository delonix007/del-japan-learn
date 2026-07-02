/**
 * ═══════════════════════════════════════════════════════════
 * Sentence Engine — MNN Learning Style
 * ═══════════════════════════════════════════════════════════
 * 
 * Adaptive example sentences based on user level:
 * - Easy: Simple sentences with basic grammar (N5)
 * - Medium: Intermediate sentences (N5-N4)
 * - Hard: Complex sentences with advanced grammar (N4+)
 * 
 * Features:
 * - Difficulty toggle (user can choose)
 * - Auto-adaptive based on EXP level
 * - Furigana support
 * - Romaji toggle
 * - Audio TTS integration (future)
 * ═══════════════════════════════════════════════════════════
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Sentence {
    kata_jepang: string;
    romaji: string;
    arti_indonesia: string;
    contoh_jepang: string;
    contoh_romaji: string | null;
    contoh_indonesia: string | null;
    difficulty: Difficulty;
    lesson_number: number;
    book: 'I' | 'II';
}

export interface SentenceEngineConfig {
    difficulty: Difficulty;
    showRomaji: boolean;
    showFurigana: boolean;
    adaptiveMode: boolean; // Auto-adjust based on user level
}

const DEFAULT_CONFIG: SentenceEngineConfig = {
    difficulty: 'easy',
    showRomaji: true,
    showFurigana: true,
    adaptiveMode: true,
};

class SentenceEngine {
    private config: SentenceEngineConfig;
    private cache: Map<string, Sentence[]> = new Map();
    private supabase: any = null;

    constructor(supabase?: any, config?: Partial<SentenceEngineConfig>) {
        this.supabase = supabase;
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Get sentences for a specific difficulty
     */
    async getByDifficulty(
        difficulty: Difficulty,
        lessonId?: number
    ): Promise<Sentence[]> {
        const cacheKey = `sentences_${difficulty}_${lessonId || 'all'}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        if (!this.supabase) {
            console.warn('[SentenceEngine] Supabase not initialized');
            return [];
        }

        try {
            const functionName = lessonId
                ? 'get_sentences_by_difficulty'
                : 'get_sentences_by_difficulty';
            
            const { data, error } = await this.supabase
                .rpc(functionName, {
                    p_difficulty: difficulty,
                    p_lesson_id: lessonId || null,
                });

            if (error) {
                console.error('[SentenceEngine] Fetch error:', error);
                return [];
            }

            const sentences = (data || []) as Sentence[];
            this.cache.set(cacheKey, sentences);
            return sentences;
        } catch (error) {
            console.error('[SentenceEngine] Error:', error);
            return [];
        }
    }

    /**
     * Get adaptive sentences based on user level
     */
    async getAdaptive(userId: string, lessonId?: number): Promise<Sentence[]> {
        const cacheKey = `adaptive_${userId}_${lessonId || 'all'}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        if (!this.supabase) {
            console.warn('[SentenceEngine] Supabase not initialized');
            return [];
        }

        try {
            const { data, error } = await this.supabase
                .rpc('get_adaptive_sentences', {
                    p_user_id: userId,
                    p_lesson_id: lessonId || null,
                });

            if (error) {
                console.error('[SentenceEngine] Adaptive fetch error:', error);
                return [];
            }

            const sentences = (data || []) as Sentence[];
            this.cache.set(cacheKey, sentences);
            return sentences;
        } catch (error) {
            console.error('[SentenceEngine] Error:', error);
            return [];
        }
    }

    /**
     * Get sentences based on current config
     */
    async get(config?: Partial<SentenceEngineConfig>): Promise<Sentence[]> {
        if (config) {
            this.config = { ...this.config, ...config };
        }

        if (this.config.adaptiveMode) {
            // Adaptive mode: auto-select difficulty based on user level
            const userId = await this.getCurrentUserId();
            if (userId) {
                return this.getAdaptive(userId);
            }
        }

        return this.getByDifficulty(this.config.difficulty);
    }

    /**
     * Set difficulty level
     */
    setDifficulty(difficulty: Difficulty): void {
        this.config.difficulty = difficulty;
        this.clearCache();
    }

    /**
     * Toggle adaptive mode
     */
    setAdaptiveMode(enabled: boolean): void {
        this.config.adaptiveMode = enabled;
        this.clearCache();
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        this.cache.clear();
    }

    /**
     * Get current config
     */
    getConfig(): SentenceEngineConfig {
        return { ...this.config };
    }

    /**
     * Format sentence for display
     */
    formatSentence(sentence: Sentence, config?: Partial<SentenceEngineConfig>): {
        japanese: string;
        romaji?: string;
        translation: string;
    } {
        const cfg = { ...this.config, ...config };
        
        const result: { japanese: string; romaji?: string; translation: string } = {
            japanese: sentence.contoh_jepang,
            translation: sentence.contoh_indonesia || sentence.arti_indonesia,
        };

        if (cfg.showRomaji && sentence.contoh_romaji) {
            result.romaji = sentence.contoh_romaji;
        }

        return result;
    }

    /**
     * Get difficulty label for UI
     */
    static getDifficultyLabel(difficulty: Difficulty): string {
        switch (difficulty) {
            case 'easy': return 'Mudah';
            case 'medium': return 'Sedang';
            case 'hard': return 'Sulit';
            default: return difficulty;
        }
    }

    /**
     * Get difficulty color for UI
     */
    static getDifficultyColor(difficulty: Difficulty): string {
        switch (difficulty) {
            case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
            case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-100';
        }
    }

    private async getCurrentUserId(): Promise<string | null> {
        if (!this.supabase) return null;
        const { data: { session } } = await this.supabase.auth.getSession();
        return session?.user?.id ?? null;
    }
}

// Singleton instance
let sentenceEngineInstance: SentenceEngine | null = null;

export function getSentenceEngine(supabase?: any, config?: Partial<SentenceEngineConfig>): SentenceEngine {
    if (!sentenceEngineInstance) {
        sentenceEngineInstance = new SentenceEngine(supabase, config);
    }
    return sentenceEngineInstance;
}
