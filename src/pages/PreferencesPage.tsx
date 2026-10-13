import React, { useState, useEffect } from 'react';
import { 
  Settings, User, Type, Globe, 
  RotateCcw, ShieldCheck, CheckCircle2, Eye
} from 'lucide-react';
import { loadPreferences, savePreferences, resetPreferences } from '../services/preferenceService';
import type { Category, UserPreferences } from '../types';

export const PreferencesPage: React.FC = () => {
  const [prefs, setPrefs] = useState<UserPreferences>(loadPreferences());
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    const handlePrefsChange = (e: Event) => {
      const detail = (e as CustomEvent<UserPreferences>).detail;
      if (detail) setPrefs(detail);
    };
    window.addEventListener('pib_preferences_updated', handlePrefsChange);
    return () => window.removeEventListener('pib_preferences_updated', handlePrefsChange);
  }, []);

  const handleUpdate = (updatedFields: Partial<UserPreferences>) => {
    const next = savePreferences(updatedFields);
    setPrefs(next);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all personalised preferences and accessibility configurations to defaults?')) {
      const def = resetPreferences();
      setPrefs(def);
    }
  };

  const allCategories: Category[] = [
    'Economy & Finance',
    'Science & Technology',
    'Defence & Security',
    'Health & Family Welfare',
    'Environment & Climate',
    'Agriculture & Rural',
    'Education & Skill',
    'Commerce & Industry',
    'National & Governance',
    'Infrastructure & Transport'
  ];

  const toggleCategory = (cat: Category) => {
    const current = prefs.favoriteCategories || [];
    const next = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
    handleUpdate({ favoriteCategories: next });
  };

  return (
    <div className="pib-container py-8 max-w-4xl space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#0b3558] text-white">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-serif text-slate-900 dark:text-white">
              Personalisation, Language & Accessibility Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Customize your browsing interface, contrast theme, typography scale, and topic preferences.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Defaults</span>
        </button>
      </div>

      {savedBanner && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Preferences successfully saved to your browser localStorage.</span>
        </div>
      )}

      {/* 1. COLOR & READING THEMES */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Eye className="w-4 h-4 text-[#0b3558] dark:text-sky-400" />
            <h2>Color & Reading Themes</h2>
          </div>
          <p className="text-xs text-slate-500">
            Customize your visual reading experience across all official releases and ministry notices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'default', label: 'Govt Standard Light', desc: 'Official navy & crisp white', preview: 'bg-[#0b3558] text-white' },
            { id: 'dark', label: 'Official Dark Mode', desc: 'Deep slate & white for night reading', preview: 'bg-slate-900 text-slate-100 border border-slate-700' },
            { id: 'parchment', label: 'Warm Parchment', desc: 'Low-strain sepia reading', preview: 'bg-amber-100 text-amber-900 border border-amber-300' },
            { id: 'eco-green', label: 'Tricolor Eco Green', desc: 'Forest green & crisp mint', preview: 'bg-emerald-800 text-white' }
          ].map(themeItem => {
            const isSelected = prefs.theme === themeItem.id || (themeItem.id === 'default' && (!prefs.theme || prefs.theme === 'light'));
            return (
              <button
                key={themeItem.id}
                onClick={() => handleUpdate({ theme: themeItem.id as any })}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#0b3558] dark:border-sky-400 ring-2 ring-[#0b3558]/30 dark:ring-sky-400/40 bg-slate-100/80 dark:bg-slate-800 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className={`w-full h-8 rounded-md mb-2 flex items-center justify-center text-[10px] font-bold ${themeItem.preview}`}>
                  {themeItem.label.split(' ')[0]}
                </div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{themeItem.label}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <div className="text-[10px] text-slate-500">{themeItem.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. TYPOGRAPHY & FONT SCALING */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Type className="w-4 h-4 text-[#0b3558] dark:text-sky-400" />
            <h2>Font Size Scaling</h2>
          </div>
          <p className="text-xs text-slate-500">
            Increase readability across article texts, tables, and policy releases.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { id: 'normal', label: 'Standard (100%)', symbol: 'A' },
            { id: 'large', label: 'Large (112.5% / 18px)', symbol: 'A+' },
            { id: 'xlarge', label: 'Extra Large (125% / 20px)', symbol: 'A++' }
          ].map(sizeItem => (
            <button
              key={sizeItem.id}
              onClick={() => handleUpdate({ fontSize: sizeItem.id as any })}
              className={`px-4 py-2.5 rounded-lg border text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                prefs.fontSize === sizeItem.id
                  ? 'bg-[#0b3558] text-white border-[#0b3558]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="text-sm font-mono">{sizeItem.symbol}</span>
              <span>{sizeItem.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. LANGUAGE PREFERENCE */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Globe className="w-4 h-4 text-[#0b3558] dark:text-sky-400" />
            <h2>Language Preference (भाषा प्राथमिकता)</h2>
          </div>
          <p className="text-xs text-slate-500">
            Select your preferred display language for navigation and paired official releases.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleUpdate({ preferredLanguage: 'en' })}
            className={`px-5 py-2.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
              prefs.preferredLanguage === 'en'
                ? 'bg-[#0b3558] text-white border-[#0b3558]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            English (English Language Edition)
          </button>

          <button
            onClick={() => handleUpdate({ preferredLanguage: 'hi' })}
            className={`px-5 py-2.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
              prefs.preferredLanguage === 'hi'
                ? 'bg-[#0b3558] text-white border-[#0b3558]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            हिन्दी (Hindi Language Edition)
          </button>
        </div>
      </section>

      {/* 4. READER PERSONA & TOPICS PRIORITISATION */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <User className="w-4 h-4 text-[#0b3558] dark:text-sky-400" />
            <h2>Homepage Personalisation Topics</h2>
          </div>
          <p className="text-xs text-slate-500">
            Select topics to elevate to the top of your homepage discovery stream.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {allCategories.map(cat => {
            const isFav = (prefs.favoriteCategories || []).includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer flex flex-col justify-between h-20 ${
                  isFav
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-[#0b3558] dark:border-sky-500 text-[#0b3558] dark:text-sky-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{cat}</span>
                <span className="text-[10px] self-end font-mono">
                  {isFav ? '★ Prioritised' : '+ Prioritise'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Privacy Notice */}
      <div className="p-4 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <div>
          <strong>Privacy Integrity Guarantee:</strong> All personal settings and subscription preferences are retained strictly within your local browser storage. No user telemetry, third-party analytics, or tracking cookies are employed.
        </div>
      </div>
    </div>
  );
};
