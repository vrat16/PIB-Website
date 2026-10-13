import type { SubscriptionConfig, UserPreferences } from '../types';

const PREFERENCES_STORAGE_KEY = 'pib_user_preferences_v1';

export const DEFAULT_PREFERENCES: UserPreferences = {
  userPersona: 'general',
  favoriteMinistries: [],
  favoriteCategories: [],
  preferredLanguage: 'en',
  theme: 'default',
  fontSize: 'normal'
};

export const loadPreferences = (): UserPreferences => {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export const savePreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  try {
    const current = loadPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updated));
    applyThemeAndFont(updated);
    window.dispatchEvent(new CustomEvent('pib_preferences_updated', { detail: updated }));
    return updated;
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export const resetPreferences = (): UserPreferences => {
  try {
    localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    applyThemeAndFont(DEFAULT_PREFERENCES);
    window.dispatchEvent(new CustomEvent('pib_preferences_updated', { detail: DEFAULT_PREFERENCES }));
    return DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export const saveSubscription = (sub: SubscriptionConfig): UserPreferences => {
  return savePreferences({ emailSubscription: sub });
};

export const clearSubscription = (): UserPreferences => {
  const current = loadPreferences();
  delete current.emailSubscription;
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new CustomEvent('pib_preferences_updated', { detail: current }));
  return current;
};

export const applyThemeAndFont = (prefs: UserPreferences) => {
  const root = document.documentElement;

  // Clear existing theme classes
  root.classList.remove('dark', 'pib-hc', 'pib-theme-yellow', 'pib-theme-green');

  if (prefs.theme === 'dark') {
    root.classList.add('dark');
  } else if (prefs.theme === 'parchment') {
    root.classList.add('pib-theme-yellow');
  } else if (prefs.theme === 'eco-green') {
    root.classList.add('pib-theme-green');
  }
  
  root.setAttribute('data-theme', prefs.theme || 'default');

  // Clear existing font size classes
  root.classList.remove('font-large', 'font-xlarge');
  if (prefs.fontSize === 'large') {
    root.classList.add('font-large');
  } else if (prefs.fontSize === 'xlarge') {
    root.classList.add('font-xlarge');
  }
};

export const toggleTheme = (): UserPreferences['theme'] => {
  const current = loadPreferences();
  const nextTheme: UserPreferences['theme'] = current.theme === 'dark' ? 'default' : 'dark';
  savePreferences({ theme: nextTheme });
  return nextTheme;
};

// Apply preferences immediately upon loading script
if (typeof window !== 'undefined') {
  try {
    const initialPrefs = loadPreferences();
    applyThemeAndFont(initialPrefs);
  } catch {
    // SSR or early browser initialization fallback
  }
}

