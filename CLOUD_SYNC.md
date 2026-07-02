# Cloud Progress Sync — Implementation Guide

## Problem Statement

**Root Cause:** `localStorage` is domain-specific. When users switch domains (e.g., Netlify → rawliet-app.uk), all learning progress is lost.

**Solution:** Sync progress to Supabase cloud storage, similar to MNN Learning's `PROGRESS_SYNC` system.

## Implementation

### 1. Database Migration

Run `supabase-migration-cloud-sync.sql` in your Supabase SQL Editor:

```sql
-- Creates:
-- - user_cloud_sync table (stores JSONB blob of all localStorage keys)
-- - push_progress_to_cloud() RPC function
-- - pull_progress_from_cloud() RPC function
-- - Auto-update triggers
```

### 2. Client-Side Library

`src/lib/cloud-sync.ts` handles:
- **Debounced push** — waits 2s after last change before syncing
- **Pull on login** — restores progress from cloud
- **Conflict resolution** — cloud wins (latest timestamp)
- **Offline fallback** — localStorage still works if offline

### 3. Integration Points

#### Auth Store (`src/stores/useAuthStore.ts`)
```typescript
// On login:
await cloudSync.initialize(user.id);

// On logout:
cloudSync.clear();
```

#### Manual Sync (for future use)
```typescript
import { getCloudSync } from '@/lib/cloud-sync';

const cloudSync = getCloudSync(url, key);
cloudSync.push(); // Debounced push
cloudSync.flush(); // Force immediate push
```

### 4. Synced Keys

All keys prefixed with `djl_` (Del-Japan Learn):

| Key | Description |
|-----|-------------|
| `djl_learned` | Vocab cards already memorized |
| `djl_dark` | Dark mode preference |
| `djl_furigana` | Show furigana toggle |
| `djl_romaji` | Show romaji toggle |
| `djl_sound` | Sound effects toggle |
| `djl_book` | Active book (I or II) |
| `djl_lesson` | Current lesson index |
| `djl_kana_prog` | Kana progress per character |
| `djl_kana_hafal` | Kana mastered set |
| `djl_bunpou_prog` | Grammar pattern progress |
| `djl_daily_challenge` | Daily challenge state |
| `djl_ex_diff` | Sentence difficulty preference |
| `djl_gamify` | EXP/level data |
| `djl_missions_v1` | Daily missions progress |

### 5. UI Indicators

Add sync status indicator to dashboard:

```typescript
const { syncStatus, lastSync } = useAuthStore();

// Display:
// - 🔄 Syncing... (when syncStatus === 'syncing')
// - ✅ Synced {time} ago (when syncStatus === 'idle')
// - ⚠️ Sync error (when syncStatus === 'error')
```

## Testing Checklist

- [ ] Login → progress pulled from cloud
- [ ] Make changes → auto-sync after 2s debounce
- [ ] Logout → sync state cleared
- [ ] Offline → localStorage still works
- [ ] Multi-device → cloud sync resolves conflicts
- [ ] Guest mode → no sync (expected)

## Migration from MNN Learning

If migrating from MNN Learning, keys need to be renamed:
- `mnn_learned` → `djl_learned`
- `mnn_dark` → `djl_dark`
- etc.

Add migration function to `cloud-sync.ts`:

```typescript
function migrateFromMNN(): void {
    SYNC_KEYS.forEach(key => {
        const mnnKey = key.replace('djl_', 'mnn_');
        const value = localStorage.getItem(mnnKey);
        if (value) {
            localStorage.setItem(key, value);
            localStorage.removeItem(mnnKey);
        }
    });
}
```

## Future Enhancements

1. **Selective sync** — let users choose what to sync
2. **Export/Import** — download progress as JSON
3. **Merge strategies** — user chooses cloud vs local on conflict
4. **Sync history** — show what changed and when
5. **Bandwidth optimization** — only sync changed keys (delta sync)
