import { RELEASES_DATA } from '../data/releases';
import type { PressRelease } from '../types';

const SAVED_STORAGE_KEY = 'pib_saved_releases_v1';

// Get array of saved release IDs
export const getSavedReleaseIds = (): string[] => {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Check if a release is saved
export const isReleaseSaved = (id: string): boolean => {
  const ids = getSavedReleaseIds();
  return ids.includes(id);
};

// Toggle save state for a release
export const toggleSaveRelease = (id: string): boolean => {
  try {
    const ids = getSavedReleaseIds();
    let updated: string[];
    let isSaved: boolean;

    if (ids.includes(id)) {
      updated = ids.filter(item => item !== id);
      isSaved = false;
    } else {
      updated = [id, ...ids];
      isSaved = true;
    }

    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent('pib_saved_updated', {
        detail: { id, isSaved, count: updated.length }
      })
    );
    return isSaved;
  } catch {
    return false;
  }
};

// Remove a specific release
export const removeSavedRelease = (id: string): void => {
  try {
    const ids = getSavedReleaseIds();
    const updated = ids.filter(item => item !== id);
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent('pib_saved_updated', {
        detail: { id, isSaved: false, count: updated.length }
      })
    );
  } catch {
    // ignore
  }
};

// Clear all saved releases
export const clearAllSavedReleases = (): void => {
  try {
    localStorage.removeItem(SAVED_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent('pib_saved_updated', {
        detail: { count: 0 }
      })
    );
  } catch {
    // ignore
  }
};

// Get full PressRelease objects for all saved items
export const getSavedReleases = (): PressRelease[] => {
  const ids = getSavedReleaseIds();
  if (ids.length === 0) return [];
  
  // Return matching releases preserving saved order
  const idMap = new Map(RELEASES_DATA.map(r => [r.id, r]));
  const results: PressRelease[] = [];
  
  for (const id of ids) {
    const match = idMap.get(id);
    if (match) results.push(match);
  }
  
  return results;
};
