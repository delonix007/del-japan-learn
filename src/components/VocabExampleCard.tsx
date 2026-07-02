'use client';

import { useState } from 'react';
import { getVocabAudioSystem, VocabAudioSystem } from '@/lib/vocab-audio';
import type { EnhancedVocab } from '@/lib/vocab-audio';

interface VocabExampleCardProps {
    vocab: EnhancedVocab;
}

export default function VocabExampleCard({ vocab }: VocabExampleCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showRomaji, setShowRomaji] = useState(true);
    const audioSystem = getVocabAudioSystem();

    const handlePlayAudio = () => {
        if (isPlaying) {
            audioSystem.stop();
            setIsPlaying(false);
            return;
        }

        // Try to play from URL first, fallback to TTS
        if (vocab.example_audio_url) {
            VocabAudioSystem.playAudioUrl(vocab.example_audio_url, () => {
                setIsPlaying(false);
            });
        } else if (vocab.example_sentence) {
            const success = audioSystem.speak(vocab.example_sentence, () => {
                setIsPlaying(false);
            });
            if (success) setIsPlaying(true);
        }
    };

    return (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--color-border)] p-4">
            {/* Word header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-lg font-bold">{vocab.word}</h3>
                    <span className="text-xs text-[var(--color-text-muted)]">
                        {vocab.pos || 'Kosa kata'}
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-sm">{vocab.meaning}</p>
                </div>
            </div>

            {/* Example sentence */}
            {vocab.example_sentence && (
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[var(--color-text-muted)]">
                            例文 — Contoh Kalimat
                        </span>
                        
                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            {/* Romaji toggle */}
                            <button
                                onClick={() => setShowRomaji(!showRomaji)}
                                className={`text-[10px] px-2 py-0.5 rounded ${
                                    showRomaji 
                                        ? 'bg-primary/20 text-primary' 
                                        : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
                                }`}
                            >
                                Romaji
                            </button>

                            {/* Audio play button */}
                            <button
                                onClick={handlePlayAudio}
                                disabled={!audioSystem.isJapaneseAvailable() && !vocab.example_audio_url}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                    isPlaying
                                        ? 'bg-primary text-white'
                                        : 'bg-[var(--color-surface-2)] hover:bg-primary/20 text-[var(--color-text)]'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isPlaying ? (
                                    <span className="text-xs">⏸</span>
                                ) : (
                                    <span className="text-xs">▶</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Sentence display */}
                    <div className="p-3 bg-[var(--color-surface-2)] rounded-lg">
                        <p className="text-sm font-medium mb-2">
                            {vocab.example_sentence}
                        </p>
                        
                        {showRomaji && vocab.example_romaji && (
                            <p className="text-xs text-[var(--color-text-muted)]">
                                {VocabAudioSystem.formatRomaji(vocab.example_romaji)}
                            </p>
                        )}
                        
                        {showRomaji && !vocab.example_romaji && (
                            <p className="text-xs text-[var(--color-text-muted)] italic">
                                Romaji tidak tersedia
                            </p>
                        )}
                    </div>

                    {/* Audio not available warning */}
                    {!vocab.example_audio_url && !audioSystem.isJapaneseAvailable() && (
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                            ⚠️ Japanese TTS not available in your browser
                        </p>
                    )}
                </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
                <button className="flex-1 py-2 text-xs font-medium rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors">
                    📝 Latihan
                </button>
                <button className="flex-1 py-2 text-xs font-medium rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors">
                    🔖 Simpan
                </button>
            </div>
        </div>
    );
}

interface VocabExamplesListProps {
    vocabList: EnhancedVocab[];
}

export function VocabExamplesList({ vocabList }: VocabExamplesListProps) {
    if (vocabList.length === 0) {
        return (
            <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">
                Belum ada contoh kalimat untuk vocab ini.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {vocabList.map((vocab) => (
                <VocabExampleCard key={vocab.vocab_id} vocab={vocab} />
            ))}
        </div>
    );
}
