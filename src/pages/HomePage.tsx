import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Bot, Bell, Bookmark, Filter, RotateCcw, 
  Sparkles, CheckCircle2, ArrowRight, BookOpen, Newspaper, GraduationCap, Building2, ShieldCheck, AlertCircle
} from 'lucide-react';
import { RELEASES_DATA } from '../data/releases';
import { MINISTRIES_DATA } from '../data/ministries';
import { ReleaseCard } from '../components/common/ReleaseCard';
import { loadPreferences, savePreferences, resetPreferences } from '../services/preferenceService';
import { Category, PressRelease, UserPreferences } from '../types';
import { useTranslation } from '../i18n/useTranslation';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedContentType, setSelectedContentType] = useState('all');

  useEffect(() => {
    const handlePrefsChange = (e: Event) => {
      const detail = (e as CustomEvent<UserPreferences>).detail;
      if (detail) setPreferences(detail);
    };
    window.addEventListener('pib_preferences_updated', handlePrefsChange);
    return () => window.removeEventListener('pib_preferences_updated', handlePrefsChange);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedMinistry !== 'all') params.set('ministry', selectedMinistry);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedContentType !== 'all') params.set('type', selectedContentType);
    navigate(`/search?${params.toString()}`);
  };

  const handlePersonaSelect = (persona: 'general' | 'journalist') => {
    const categoryPresets: Record<'general' | 'journalist', Category[]> = {
      general: ['National & Governance', 'Economy & Finance', 'Health & Family Welfare'],
      journalist: ['National & Governance', 'Defence & Security', 'Commerce & Industry']
    };

    savePreferences({
      userPersona: persona,
      favoriteCategories: categoryPresets[persona]
    });
  };

  const handleResetPersonalisation = () => {
    resetPreferences();
    setPreferences(loadPreferences());
  };

  // Filter and prioritize releases for the feed
  const getPrioritisedReleases = (): PressRelease[] => {
    // Current non-historical releases
    const activeReleases = RELEASES_DATA.filter(r => !r.isHistorical);

    if (preferences.favoriteCategories.length === 0 && preferences.userPersona === 'general') {
      return activeReleases;
    }

    // Separate into matching preferred categories and others
    const preferred: PressRelease[] = [];
    const others: PressRelease[] = [];

    activeReleases.forEach(r => {
      if (preferences.favoriteCategories.includes(r.category)) {
        preferred.push(r);
      } else {
        others.push(r);
      }
    });

    return [...preferred, ...others];
  };

  const prioritisedReleases = getPrioritisedReleases();
  const featuredRelease = prioritisedReleases[0];
  const latestReleases = prioritisedReleases.slice(1, 7);

  // Grouped announcements demonstration (e.g. Science & Space cluster or Economy cluster)
  const groupedEconomyAnnouncements = RELEASES_DATA.filter(r => 
    r.id === 'PR-2026-001' || r.id === 'PR-2025-010' || r.id === 'PR-2026-005'
  );

  return (
    <div className="space-y-10 pb-12">
      {/* SECTION B: PROMINENT SEARCH SECTION */}
      <section className="bg-gradient-to-b from-[#0b3558] to-[#072238] text-white py-12 px-4 shadow-md">
        <div className="pib-container max-w-4xl text-center space-y-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-xs text-amber-300 rounded-full text-xs font-semibold tracking-wider uppercase">
              Official Information Gateway • भारत का आधिकारिक सूचना तंत्र
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-serif tracking-tight leading-tight">
              {lang === 'hi' ? 'पत्र सूचना कार्यालय' : 'Press Information Bureau'}
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
              {t.home.heroSubtitle}
            </p>
          </div>

          {/* Search Form */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="bg-white dark:bg-slate-900 rounded-xl p-2.5 md:p-3 shadow-xl border border-white/20 text-slate-900 text-left"
          >
            <div className="flex flex-col md:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.home.searchPlaceholder}
                  className="w-full pl-11 pr-4 py-2.5 text-sm md:text-base rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-[#0b3558] outline-hidden placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0b3558] hover:bg-[#164e7c] text-white font-bold text-sm md:text-base rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{t.home.searchButton}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Filter Selectors Below Search Bar */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold flex items-center gap-1 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5" />
                <span>Quick Filters:</span>
              </span>

              <select
                value={selectedMinistry}
                onChange={(e) => setSelectedMinistry(e.target.value)}
                className="w-full sm:w-auto flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 sm:px-2 py-2 sm:py-1 rounded-lg sm:rounded border border-slate-200 dark:border-slate-700 outline-hidden min-h-[40px] sm:min-h-0 cursor-pointer"
              >
                <option value="all">{t.common.allMinistries}</option>
                {MINISTRIES_DATA.map(m => (
                  <option key={m.id} value={m.id}>{m.shortName} - {lang === 'hi' ? m.nameHi : m.nameEn}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 sm:px-2 py-2 sm:py-1 rounded-lg sm:rounded border border-slate-200 dark:border-slate-700 outline-hidden min-h-[40px] sm:min-h-0 cursor-pointer"
              >
                <option value="all">{t.common.allCategories}</option>
                <option value="Economy & Finance">{lang === 'hi' ? 'अर्थव्यवस्था एवं वित्त' : 'Economy & Finance'}</option>
                <option value="Science & Technology">{lang === 'hi' ? 'विज्ञान एवं प्रौद्योगिकी' : 'Science & Technology'}</option>
                <option value="Agriculture & Rural">{lang === 'hi' ? 'कृषि एवं ग्रामीण विकास' : 'Agriculture & Rural'}</option>
                <option value="Health & Family Welfare">{lang === 'hi' ? 'स्वास्थ्य एवं परिवार कल्याण' : 'Health & Family Welfare'}</option>
                <option value="Defence & Security">{lang === 'hi' ? 'रक्षा एवं सुरक्षा' : 'Defence & Security'}</option>
                <option value="Environment & Climate">{lang === 'hi' ? 'पर्यावरण एवं जलवायु' : 'Environment & Climate'}</option>
                <option value="Education & Skill">{lang === 'hi' ? 'शिक्षा एवं कौशल' : 'Education & Skill'}</option>
              </select>

              <select
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value)}
                className="w-full sm:w-auto flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 sm:px-2 py-2 sm:py-1 rounded-lg sm:rounded border border-slate-200 dark:border-slate-700 outline-hidden min-h-[40px] sm:min-h-0 cursor-pointer"
              >
                <option value="all">{lang === 'hi' ? 'सभी प्रारूप' : 'All Formats'}</option>
                <option value="Press Release">{lang === 'hi' ? 'प्रेस विज्ञप्ति' : 'Press Release'}</option>
                <option value="Factsheet">{lang === 'hi' ? 'तथ्य पत्रक' : 'Factsheet'}</option>
                <option value="Feature">{lang === 'hi' ? 'विशेष लेख' : 'Feature Article'}</option>
              </select>
            </div>
          </form>
        </div>
      </section>

      <div className="pib-container space-y-12">
        {/* SECTION C: PERSONALISED DISCOVERY */}
        <section className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.home.personalisedDiscovery}
                </h2>
                {preferences.userPersona !== 'general' && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    Active: {preferences.userPersona.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {t.home.discoveryDesc}
              </p>
            </div>

            {/* Reset button if customisation active */}
            {preferences.userPersona !== 'general' && (
              <button
                onClick={handleResetPersonalisation}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'hi' ? 'डिफ़ॉल्ट पर रीसेट करें' : 'Reset to Default'}</span>
              </button>
            )}
          </div>

          {/* Persona selector pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-w-2xl">
            <button
              onClick={() => handlePersonaSelect('general')}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                preferences.userPersona === 'general'
                  ? 'bg-white dark:bg-slate-900 border-[#0b3558] dark:border-sky-500 ring-2 ring-[#0b3558]/20 shadow-xs'
                  : 'bg-white/60 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Building2 className="w-4 h-4 text-[#0b3558] dark:text-sky-400" />
                {preferences.userPersona === 'general' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">{t.home.personaCitizen}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {lang === 'hi' ? 'कल्याणकारी योजनाएं, स्वास्थ्य एवं नागरिक सेवाएं' : 'Core welfare, public schemes, healthcare & national development'}
              </div>
            </button>

            <button
              onClick={() => handlePersonaSelect('journalist')}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                preferences.userPersona === 'journalist'
                  ? 'bg-white dark:bg-slate-900 border-[#0b3558] dark:border-sky-500 ring-2 ring-[#0b3558]/20 shadow-xs'
                  : 'bg-white/60 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Newspaper className="w-4 h-4 text-[#0b3558] dark:text-sky-400" />
                {preferences.userPersona === 'journalist' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">{t.home.personaJournalist}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {lang === 'hi' ? 'मंत्रिमंडल निर्णय, द्विपक्षीय समझौते एवं सामरिक व्यापार' : 'Cabinet decisions, bilateral agreements, defense & strategic commerce'}
              </div>
            </button>
          </div>
        </section>

        {/* SECTION E: LATEST OFFICIAL RELEASES */}
        <section aria-labelledby="latest-releases-heading" className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 id="latest-releases-heading" className="text-xl md:text-2xl font-bold font-serif text-slate-900 dark:text-white">
                {t.home.latestReleases}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.home.latestDesc}
              </p>
            </div>
            <Link
              to="/search"
              className="text-xs font-bold text-[#0b3558] dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>{lang === 'hi' ? `सभी विज्ञप्तियां देखें (${RELEASES_DATA.length})` : `View All Releases (${RELEASES_DATA.length})`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Featured Hero Release Card */}
          {featuredRelease && (
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-800 dark:text-amber-400 mb-2 inline-block">
                {lang === 'hi' ? '★ सर्वोच्च प्राथमिकता बुलेटिन' : '★ Top Priority Bulletin'}
              </span>
              <ReleaseCard release={featuredRelease} variant="featured" />
            </div>
          )}

          {/* Grid of latest releases */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestReleases.map(rel => (
              <ReleaseCard key={rel.id} release={rel} />
            ))}
          </div>
        </section>

        {/* SECTION F: RELATED ANNOUNCEMENTS GROUPING */}
        <section aria-labelledby="grouped-announcements-heading" className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 id="grouped-announcements-heading" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t.home.relatedClusters}</span>
                <span className="text-[10px] bg-[#0b3558] text-white px-2 py-0.5 rounded font-mono">
                  {lang === 'hi' ? 'संबंधित घोषणाएं' : 'Linked Releases'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.home.relatedDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {groupedEconomyAnnouncements.map(rel => (
              <div 
                key={rel.id} 
                className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#0b3558] dark:text-sky-400 uppercase tracking-wider">
                    {rel.ministry}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                    <Link to={`/release/${rel.id}`} className="hover:underline">
                      {rel.title}
                    </Link>
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">PRID: {rel.prid}</span>
                  <Link to={`/release/${rel.id}`} className="text-sky-600 font-semibold hover:underline">
                    View Record →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
