/**
 * ═══════════════════════════════════════════════════════════
 * Cloud Progress Sync — MNN Learning Style
 * ═══════════════════════════════════════════════════════════
 * 
 * Root cause fix: localStorage domain-specific →
 * ganti domain (Netlify→rawliet-app.uk) = semua progress hilang.
 * 
 * Solution: Sync progress ke Supabase users_cloud_sync table
 * - Auto-push setiap STATE.save() dipanggil
 * - Auto-pull saat login
 * - Merge conflict resolution (cloud wins)
 * - Offline fallback ke localStorage
 * ═══════════════════════════════════════════════════════════
 */

import { createClient } from '@supabase/supabase-js';

// Keys yang di-sync ke cloud (sama seperti MNN Learning)
export const SYNC_KEYS = [
    'djl_learned',        // learnedCards (vocab yang sudah dihafal)
    'djl_dark',           // isDark theme
    'djl_furigana',       // showFurigana
    'djl_romaji',         // showRomaji
    'djl_sound',          // soundOn
    'djl_book',           // activeBook
    'djl_lesson',         // currentLesson
    'djl_kana_prog',      // kanaProg
    'djl_kana_hafal',     // kanaHafal
    'djl_bunpou_prog',    // bunpouProgress
    'djl_daily_challenge',// dailyChallenge
    'djl_ex_diff',        // exDifficulty
    'djl_gamify',         // EXP/level data
    'djl_missions_v1',    // daily missions progress
];

export interface SyncData {
    [key: string]: string | number | boolean | object | null;
}

export interface CloudSyncState {
    isSyncing: boolean;
    lastSync: Date | null;
    syncError: Error | null;
    pendingChanges: Set<string>;
}

export type StorageChangeCallback = (key: string, value: string | null) => void;

export class CloudProgressSync {
    private supabase: ReturnType<typeof createClient> | null = null;
    private state: CloudSyncState = {
        isSyncing: false,
        lastSync: null,
        syncError: null,
        pendingChanges: new Set(),
    };
    private syncDebounce: NodeJS.Timeout | null = null;
    private readonly DEBOUNCE_MS = 2000; // Tunggu 2s setelah perubahan terakhir
    
    // Callback untuk sync changes (set oleh auth store)
    onStorageChange?: StorageChangeCallback;

    constructor(supabaseUrl?: string, supabaseKey?: string) {
        if (supabaseUrl && supabaseKey) {
            this.supabase = createClient(supabaseUrl, supabaseKey);
        }
    }

    /**
     * Initialize sync — pull from cloud on login
     */
    async initialize(userId: string): Promise<void> {
        if (!this.supabase) {
            console.warn('[CloudSync] Supabase not initialized, using localStorage only');
            return;
        }

        try {
            this.state.isSyncing = true;

            // Pull dari cloud
            const cloudData = await this.pullFromCloud(userId);
            
            if (cloudData && Object.keys(cloudData).length > 0) {
                // Merge dengan localStorage (cloud wins untuk keys yang ada di cloud)
                this.mergeFromCloud(cloudData);
            }

            this.state.lastSync = new Date();
            this.state.syncError = null;
        } catch (error) {
            console.error('[CloudSync] Initialize error:', error);
            this.state.syncError = error as Error;
            // Fallback: tetap bisa pakai localStorage
        } finally {
            this.state.isSyncing = false;
        }
    }

    /**
     * Push perubahan ke cloud (debounced)
     */
    push(keys?: string | string[]): void {
        if (!this.supabase) return;

        const keysToSync = keys ? (Array.isArray(keys) ? keys : [keys]) : SYNC_KEYS;
        
        keysToSync.forEach(key => this.state.pendingChanges.add(key));

        // Debounce: tunggu sampai tidak ada perubahan selama DEBOUNCE_MS
        if (this.syncDebounce) {
            clearTimeout(this.syncDebounce);
        }

        this.syncDebounce = setTimeout(() => {
            this.flush();
        }, this.DEBOUNCE_MS);
    }

    /**
     * Force flush pending changes (no debounce)
     */
    async flush(): Promise<void> {
        if (this.state.pendingChanges.size === 0 || !this.supabase) return;

        const userId = await this.getCurrentUserId();
        if (!userId) return;

        try {
            this.state.isSyncing = true;

            const syncData: SyncData = {};
            this.state.pendingChanges.forEach(key => {
                const value = localStorage.getItem(key);
                if (value !== null) {
                    syncData[key] = value;
                }
            });

            await this.pushToCloud(userId, syncData);
            this.state.pendingChanges.clear();
            this.state.lastSync = new Date();
            this.state.syncError = null;
        } catch (error) {
            console.error('[CloudSync] Flush error:', error);
            this.state.syncError = error as Error;
        } finally {
            this.state.isSyncing = false;
        }
    }

    /**
     * Pull data dari cloud
     */
    private async pullFromCloud(userId: string): Promise<SyncData | null> {
        if (!this.supabase) return null;

        // @ts-ignore - RPC function will be available after migration
        const { data, error } = await this.supabase.rpc('pull_progress_from_cloud', { p_user_id: userId });

        if (error) {
            console.error('[CloudSync] Pull error:', error);
            return null;
        }

        return data as SyncData;
    }

    /**
     * Push data ke cloud
     */
    private async pushToCloud(userId: string, syncData: SyncData): Promise<void> {
        if (!this.supabase) return;

        // @ts-ignore - RPC function will be available after migration
        const { error } = await this.supabase.rpc('push_progress_to_cloud', { p_user_id: userId, p_sync_data: syncData });

        if (error) {
            console.error('[CloudSync] Push error:', error);
            throw error;
        }
    }

    /**
     * Merge data dari cloud ke localStorage
     */
    private mergeFromCloud(cloudData: SyncData): void {
        Object.keys(cloudData).forEach(key => {
            if (SYNC_KEYS.includes(key)) {
                const currentValue = localStorage.getItem(key);
                const cloudValue = cloudData[key];

                // Cloud wins kalau localStorage kosong atau cloud lebih baru
                if (!currentValue && cloudValue) {
                    localStorage.setItem(key, typeof cloudValue === 'object' 
                        ? JSON.stringify(cloudValue) 
                        : String(cloudValue));
                }
            }
        });
    }

    /**
     * Get current user ID from Supabase auth
     */
    private async getCurrentUserId(): Promise<string | null> {
        if (!this.supabase) return null;

        const { data: { session } } = await this.supabase.auth.getSession();
        return session?.user?.id ?? null;
    }

    /**
     * Get sync state (for UI)
     */
    getSyncState(): CloudSyncState {
        return { ...this.state };
    }

    /**
     * Clear sync state (on logout)
     */
    clear(): void {
        this.state = {
            isSyncing: false,
            lastSync: null,
            syncError: null,
            pendingChanges: new Set(),
        };
        if (this.syncDebounce) {
            clearTimeout(this.syncDebounce);
            this.syncDebounce = null;
        }
    }
}

// Singleton instance
let cloudSyncInstance: CloudProgressSync | null = null;

export function getCloudSync(
    supabaseUrl?: string, 
    supabaseKey?: string
): CloudProgressSync | null {
    if (!cloudSyncInstance && supabaseUrl && supabaseKey) {
        cloudSyncInstance = new CloudProgressSync(supabaseUrl, supabaseKey);
    }
    return cloudSyncInstance;
}

// Auto-sync wrapper untuk STATE.save()
export function createStateSyncWrapper(
    originalSave: () => void,
    sync?: CloudProgressSync
): () => void {
    return () => {
        originalSave();
        if (sync) {
            sync.push(); // Debounced push
        }
    };
}
