import { useState, useEffect } from 'react';
import { TRANSLATIONS, type TranslationSchema } from './translations';
import { loadPreferences } from '../services/preferenceService';

export function useTranslation(): { lang: 'en' | 'hi'; t: TranslationSchema } {
  const [lang, setLang] = useState<'en' | 'hi'>(() => {
    const p = loadPreferences();
    return p.preferredLanguage === 'hi' ? 'hi' : 'en';
  });

  useEffect(() => {
    const handleUpdate = () => {
      const p = loadPreferences();
      setLang(p.preferredLanguage === 'hi' ? 'hi' : 'en');
    };
    window.addEventListener('pib_preferences_updated', handleUpdate);
    return () => window.removeEventListener('pib_preferences_updated', handleUpdate);
  }, []);

  return {
    lang,
    t: TRANSLATIONS[lang] || TRANSLATIONS.en
  };
}
