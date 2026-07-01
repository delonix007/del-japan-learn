const GUEST_KEY = 'deljapan-guest';

export function isGuestMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(GUEST_KEY) === 'true';
}

export function setGuestMode(value: boolean) {
  if (typeof window === 'undefined') return;
  if (value) {
    localStorage.setItem(GUEST_KEY, 'true');
  } else {
    localStorage.removeItem(GUEST_KEY);
  }
}

// Guest progress via localStorage
export function getGuestProgress(): { exp: number; level: number; streak: number; lessons: number[] } {
  if (typeof window === 'undefined') return { exp: 0, level: 1, streak: 0, lessons: [] };
  const saved = localStorage.getItem('deljapan-guest-progress');
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return { exp: 0, level: 1, streak: 0, lessons: [] };
}

export function saveGuestProgress(data: Partial<ReturnType<typeof getGuestProgress>>) {
  const current = getGuestProgress();
  const updated = { ...current, ...data };
  localStorage.setItem('deljapan-guest-progress', JSON.stringify(updated));
}
