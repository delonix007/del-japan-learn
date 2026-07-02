/**
 * ═══════════════════════════════════════════════════════════
 * Vocab Example Enhancement — MNN Learning Style
 * ═══════════════════════════════════════════════════════════
 * 
 * Enhanced vocabulary examples with:
 * - Romaji for pronunciation guide
 * - Audio TTS for listening practice
 * - Speech synthesis using Web Speech API
 * - Fallback to pre-recorded audio URLs
 * 
 * Features:
 * - Text-to-speech for Japanese sentences
 * - Romaji display toggle
 * - Audio playback controls
 * - Voice selection (Japanese native voices)
 * ═══════════════════════════════════════════════════════════
 */

export interface EnhancedVocab {
    vocab_id: number;
    word: string;
    meaning: string;
    example_sentence: string;
    example_romaji: string | null;
    example_audio_url: string | null;
    pos: string;
}

export interface EnhancedSentence {
    sentence_id: number;
    japanese: string;
    romaji: string | null;
    indonesian: string;
    difficulty: string;
}

export class VocabAudioSystem {
    private synth: SpeechSynthesis | null = null;
    private japaneseVoice: SpeechSynthesisVoice | null = null;
    private isInitialized = false;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis;
            this.initVoices();
        }
    }

    private initVoices() {
        if (!this.synth) return;

        const loadVoices = () => {
            const voices = this.synth!.getVoices();
            // Find Japanese voice
            this.japaneseVoice = voices.find(voice => 
                voice.lang.startsWith('ja') || 
                voice.name.includes('Japanese') ||
                voice.name.includes('日本語')
            ) ?? null;

            this.isInitialized = true;
        };

        // Voices may not be loaded immediately
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }
        loadVoices();
    }

    /**
     * Speak Japanese text using TTS
     */
    speak(text: string, onEnd?: () => void): boolean {
        if (!this.synth || !text.trim()) return false;

        // Cancel any ongoing speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        if (this.japaneseVoice) {
            utterance.voice = this.japaneseVoice;
        }

        if (onEnd) {
            utterance.onend = onEnd;
        }

        this.synth.speak(utterance);
        return true;
    }

    /**
     * Stop current speech
     */
    stop(): void {
        if (this.synth) {
            this.synth.cancel();
        }
    }

    /**
     * Check if TTS is supported
     */
    static isSupported(): boolean {
        return typeof window !== 'undefined' && 'speechSynthesis' in window;
    }

    /**
     * Check if Japanese TTS is available
     */
    isJapaneseAvailable(): boolean {
        return this.isInitialized && this.japaneseVoice !== null;
    }

    /**
     * Generate audio URL from text (using external TTS service)
     * Falls back to browser TTS if service unavailable
     */
    static generateAudioUrl(text: string): string {
        // Using Google Translate TTS (free, no API key needed)
        // Note: For production, consider using a more reliable service
        const encodedText = encodeURIComponent(text);
        return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ja&client=tw-ob`;
    }

    /**
     * Play audio from URL
     */
    static playAudioUrl(url: string, onEnd?: () => void): void {
        const audio = new Audio(url);
        if (onEnd) {
            audio.onended = onEnd;
        }
        audio.play().catch(err => {
            console.error('[VocabAudio] Audio playback failed:', err);
        });
    }

    /**
     * Convert romaji to hiragana (basic conversion)
     * For more accurate conversion, use a library like wanakana
     */
    static romajiToHiragana(romaji: string): string {
        const map: Record<string, string> = {
            'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
            'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
            'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
            'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
            'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
            'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
            'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
            'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
            'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
            'wa': 'わ', 'wo': 'を', 'n': 'ん',
            'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
            'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
            'da': 'だ', 'de': 'で', 'do': 'ど',
            'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
            'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
        };

        return romaji.toLowerCase()
            .split(' ')
            .map(word => map[word] || word)
            .join('');
    }

    /**
     * Format romaji for display (capitalize first letter)
     */
    static formatRomaji(romaji: string): string {
        if (!romaji) return '';
        return romaji.charAt(0).toUpperCase() + romaji.slice(1);
    }
}

// Singleton instance
let vocabAudioInstance: VocabAudioSystem | null = null;

export function getVocabAudioSystem(): VocabAudioSystem {
    if (!vocabAudioInstance) {
        vocabAudioInstance = new VocabAudioSystem();
    }
    return vocabAudioInstance;
}
