'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { getSentenceEngine, Sentence, Difficulty } from '@/lib/sentence-engine';

interface SentenceCardProps {
    sentence: Sentence;
    showRomaji: boolean;
    showFurigana: boolean;
}

function SentenceCard({ sentence, showRomaji, showFurigana }: SentenceCardProps) {
    const labelClass = sentence.difficulty === 'easy' 
        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        : sentence.difficulty === 'medium'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';

    const difficultyLabel = sentence.difficulty === 'easy' ? 'Mudah' 
        : sentence.difficulty === 'medium' ? 'Sedang' 
        : 'Sulit';

    return (
        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${labelClass}`}>
                    {difficultyLabel}
                </span>
                <span className="text-xs text-gray-400">
                    Book {sentence.book} - Lesson {sentence.lesson_number}
                </span>
            </div>

            {/* Vocabulary */}
            <div className="mb-3">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {sentence.kata_jepang}
                </h4>
                {showRomaji && sentence.romaji && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {sentence.romaji}
                    </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {sentence.arti_indonesia}
                </p>
            </div>

            {/* Example Sentence */}
            <div className="pl-3 border-l-2 border-primary/30">
                <p className="text-base text-gray-800 dark:text-gray-200 mb-2">
                    {sentence.contoh_jepang}
                </p>
                {showRomaji && sentence.contoh_romaji && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {sentence.contoh_romaji}
                    </p>
                )}
                {sentence.contoh_indonesia && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                        &ldquo;{sentence.contoh_indonesia}&rdquo;
                    </p>
                )}
            </div>
        </div>
    );
}

interface SentenceEngineProps {
    lessonId?: number;
}

export default function SentenceEngineComponent({ lessonId }: SentenceEngineProps) {
    const [sentences, setSentences] = useState<Sentence[]>([]);
    const [loading, setLoading] = useState(true);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [adaptiveMode, setAdaptiveMode] = useState(true);
    const [showRomaji, setShowRomaji] = useState(true);
    const [showFurigana, setShowFurigana] = useState(true);

    const supabase = createClient();
    const engine = getSentenceEngine(supabase);

    useEffect(() => {
        loadSentences();
    }, [difficulty, adaptiveMode, lessonId]);

    const loadSentences = async () => {
        setLoading(true);
        try {
            let data: Sentence[];
            
            if (adaptiveMode) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    data = await engine.getAdaptive(session.user.id, lessonId);
                } else {
                    data = await engine.getByDifficulty(difficulty, lessonId);
                }
            } else {
                data = await engine.getByDifficulty(difficulty, lessonId);
            }
            
            setSentences(data || []);
        } catch (error) {
            console.error('[SentenceEngine] Load error:', error);
            setSentences([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDifficultyChange = (newDifficulty: Difficulty) => {
        setDifficulty(newDifficulty);
        setAdaptiveMode(false);
        engine.setAdaptiveMode(false);
        engine.setDifficulty(newDifficulty);
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                {/* Difficulty Toggle */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Difficulty:
                    </span>
                    <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                            <button
                                key={level}
                                onClick={() => handleDifficultyChange(level)}
                                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                    difficulty === level && !adaptiveMode
                                        ? 'bg-primary text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                {level === 'easy' ? 'Mudah' : level === 'medium' ? 'Sedang' : 'Sulit'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Adaptive Mode Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={adaptiveMode}
                        onChange={(e) => {
                            setAdaptiveMode(e.target.checked);
                            engine.setAdaptiveMode(e.target.checked);
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Auto-adapt
                    </span>
                </label>

                {/* Romaji Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showRomaji}
                        onChange={(e) => setShowRomaji(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Romaji
                    </span>
                </label>
            </div>

            {/* Sentences Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : sentences.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p>Belum ada contoh kalimat untuk level ini.</p>
                    <p className="text-sm mt-2">Coba ganti difficulty atau lesson.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {sentences.map((sentence, index) => (
                        <SentenceCard
                            key={`${sentence.kata_jepang}-${index}`}
                            sentence={sentence}
                            showRomaji={showRomaji}
                            showFurigana={showFurigana}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
