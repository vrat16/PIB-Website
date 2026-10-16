import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Bell, Bookmark, Bot, Layers } from 'lucide-react';
import { getSavedReleaseIds } from '../../services/bookmarkService';
import { useTranslation } from '../../i18n/useTranslation';

interface MobileBottomNavProps {
  onOpenAssistant?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenAssistant }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [savedCount, setSavedCount] = useState<number>(() => getSavedReleaseIds().length);

  useEffect(() => {
    const handleSavedChange = () => {
      setSavedCount(getSavedReleaseIds().length);
    };
    window.addEventListener('pib_saved_updated', handleSavedChange);
    return () => window.removeEventListener('pib_saved_updated', handleSavedChange);
  }, []);

  const navItems = [
    {
      to: '/',
      label: t.nav.home || 'Home',
      icon: Home,
      exact: true
    },
    {
      to: '/search',
      label: t.nav.search || 'Search',
      icon: Search,
      exact: false
    },
    {
      to: '/my-pib-feed',
      label: 'My Feed',
      icon: Bell,
      exact: false
    },
    {
      to: '/saved',
      label: t.nav.saved || 'Saved',
      icon: Bookmark,
      exact: false,
      badge: savedCount > 0 ? savedCount : undefined
    },
    {
      to: '/assistant',
      label: 'PIB AI',
      icon: Bot,
      exact: false,
      isAction: Boolean(onOpenAssistant),
      onClick: onOpenAssistant
    }
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg px-2 py-1 safe-area-bottom"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.to 
            : location.pathname === item.to || location.pathname.startsWith(item.to + '/');

          if (item.isAction && item.onClick) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 px-1 rounded-xl text-slate-600 dark:text-slate-400 hover:text-[#0b3558] dark:hover:text-sky-400 active:scale-95 transition-all cursor-pointer"
                aria-label="Open PIB AI Assistant"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-2xs border border-amber-300/60 dark:border-amber-700/60">
                  <Bot className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 px-1 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-[#0b3558] dark:text-sky-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-slate-950 font-bold font-mono text-[9px] flex items-center justify-center shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-4 h-0.5 rounded-full bg-[#0b3558] dark:bg-sky-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
