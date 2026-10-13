import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Bell, Bookmark, Settings, Menu, X, Globe, 
  Sun, Moon, Type, ShieldCheck, Clock, Info, Newspaper
} from 'lucide-react';
import { PibLogo } from '../brand/PibLogo';
import { loadPreferences, savePreferences, toggleTheme } from '../../services/preferenceService';
import { getSavedReleaseIds } from '../../services/bookmarkService';
import { useTranslation } from '../../i18n/useTranslation';
import { UserPreferences } from '../../types';

export const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences());
  const [savedCount, setSavedCount] = useState<number>(() => getSavedReleaseIds().length);
  const [currentTimeIST, setCurrentTimeIST] = useState<string>('');

  useEffect(() => {
    const handlePrefsChange = (e: Event) => {
      const detail = (e as CustomEvent<UserPreferences>).detail;
      if (detail) setPreferences(detail);
    };
    window.addEventListener('pib_preferences_updated', handlePrefsChange);

    const handleSavedChange = () => {
      setSavedCount(getSavedReleaseIds().length);
    };
    window.addEventListener('pib_saved_updated', handleSavedChange);

    // Live IST Clock
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentTimeIST(now.toLocaleString('en-IN', options) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('pib_preferences_updated', handlePrefsChange);
      window.removeEventListener('pib_saved_updated', handleSavedChange);
      clearInterval(interval);
    };
  }, []);

  const toggleLanguage = () => {
    const newLang = preferences.preferredLanguage === 'en' ? 'hi' : 'en';
    savePreferences({ preferredLanguage: newLang });
  };

  const handleThemeChange = (theme: UserPreferences['theme']) => {
    savePreferences({ theme });
  };

  const handleToggleDarkMode = () => {
    const next = toggleTheme();
    setPreferences(prev => ({ ...prev, theme: next }));
  };

  const handleFontSizeCycle = () => {
    const nextSize: Record<UserPreferences['fontSize'], UserPreferences['fontSize']> = {
      normal: 'large',
      large: 'xlarge',
      xlarge: 'normal'
    };
    savePreferences({ fontSize: nextSize[preferences.fontSize] });
  };

  const isDarkMode = preferences.theme === 'dark';
  const { t } = useTranslation();

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/about', label: t.nav.about, icon: Info },
    { to: '/search', label: t.nav.search, icon: Search },
    { to: '/my-pib-feed', label: t.nav.feed, icon: Bell },
    { 
      to: '/saved', 
      label: t.nav.saved, 
      icon: Bookmark, 
      badge: savedCount > 0 ? String(savedCount) : undefined 
    },
    { to: '/media-facilitation', label: t.nav.mediaFacilitation, icon: Newspaper },
    { to: '/ministry/all', label: t.nav.ministries },
    { to: '/preferences', label: t.nav.preferences, icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* 1. Indian National Tricolor Top Stripe */}
      <div className="tricolor-stripe" aria-hidden="true" />

      {/* 2. Official Citizen Accessibility & Language Bar */}
      <div className="bg-slate-100 dark:bg-slate-950 text-xs border-b border-slate-200 dark:border-slate-800 py-1.5 px-4">
        <div className="pib-container flex flex-wrap items-center justify-between gap-2">
          {/* Left: Govt Identity & Skip to Content */}
          <div className="flex items-center gap-3">
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:bg-amber-400 focus:text-slate-900 focus:px-2 focus:py-0.5 focus:rounded text-xs font-semibold"
            >
              Skip to Main Content
            </a>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>भारत सरकार | Government of India</span>
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{currentTimeIST || 'Asia/Kolkata (IST)'}</span>
            </span>
          </div>

          {/* Right: Accessibility Controls, Dark/Light Mode, & Language Selector */}
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            {/* Direct High-Visibility Dark / Light Mode Switch */}
            <button
              onClick={handleToggleDarkMode}
              title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-medium transition-colors cursor-pointer shadow-2xs"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-bold">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-[11px] font-bold">Dark Mode</span>
                </>
              )}
            </button>

            {/* Font Sizing Toggle */}
            <button
              onClick={handleFontSizeCycle}
              title={`Cycle font size (Current: ${preferences.fontSize})`}
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <Type className="w-3 h-3" />
              <span className="font-bold">
                {preferences.fontSize === 'normal' ? 'A' : preferences.fontSize === 'large' ? 'A+' : 'A++'}
              </span>
            </button>

            {/* Reading Themes */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-0.5 rounded">
              <button
                onClick={() => handleThemeChange('default')}
                title="Standard Government Blue Theme"
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  preferences.theme === 'default' ? 'bg-[#0b3558] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Std
              </button>
              <button
                onClick={() => handleThemeChange('parchment')}
                title="Warm Parchment Theme"
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  preferences.theme === 'parchment' ? 'bg-amber-200 text-amber-900 ring-1 ring-amber-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Warm
              </button>
              <button
                onClick={() => handleThemeChange('eco-green')}
                title="Tricolor Eco Green Theme"
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  preferences.theme === 'eco-green' ? 'bg-emerald-700 text-white ring-1 ring-emerald-500' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Eco
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0b3558] text-white hover:bg-[#164e7c] dark:bg-sky-600 dark:hover:bg-sky-500 font-medium transition-colors cursor-pointer text-xs"
              title="Toggle English / हिन्दी"
            >
              <Globe className="w-3 h-3" />
              <span>{preferences.preferredLanguage === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Masthead & Brand Identity Bar */}
      <div className="py-2.5 md:py-3 px-4 bg-white dark:bg-slate-900">
        <div className="pib-container flex items-center justify-between">
          <Link to="/" className="hover:opacity-95 transition-opacity" aria-label="PIB Homepage">
            <PibLogo />
          </Link>

            {/* Direct CTA Actions on Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/saved"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-amber-500 fill-current' : 'text-slate-500'}`} />
              <span>Saved Articles</span>
              {savedCount > 0 && (
                <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                  {savedCount}
                </span>
              )}
            </Link>

            <Link
              to="/my-pib-feed"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0b3558] text-white hover:bg-[#164e7c] text-xs font-semibold transition-all shadow-xs"
            >
              <Bell className="w-4 h-4" />
              <span>My PIB Feed</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 4. Global Navigation Menu */}
      <nav className="bg-[#0b3558] dark:bg-slate-950 text-white border-t border-sky-900 dark:border-slate-800">
        <div className="pib-container">
          <ul className="hidden lg:flex items-center gap-1 py-1 text-xs font-medium">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-white/20 text-white font-bold shadow-inner' 
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.icon && <item.icon className="w-3.5 h-3.5 opacity-80" />}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded font-bold font-mono">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#072238] dark:bg-slate-900 border-t border-slate-700 py-3 px-4 animate-in slide-in-from-top duration-200">
            <ul className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm ${
                        isActive ? 'bg-sky-600 text-white font-bold' : 'text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};
