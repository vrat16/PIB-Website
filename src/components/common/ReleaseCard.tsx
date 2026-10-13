import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Bot, ArrowRight, Tag, Bookmark, Download } from 'lucide-react';
import type { PressRelease } from '../../types';
import { isReleaseSaved, toggleSaveRelease } from '../../services/bookmarkService';
import { useTranslation } from '../../i18n/useTranslation';
import { generateReleasePdf } from '../../utils/pdfGenerator';
import { MINISTRIES_DATA } from '../../data/ministries';

interface ReleaseCardProps {
  release: PressRelease;
  variant?: 'compact' | 'featured' | 'standard';
  className?: string;
  showExcerpt?: boolean;
}

export const ReleaseCard: React.FC<ReleaseCardProps> = ({ 
  release, 
  variant = 'standard',
  className = '',
  showExcerpt = true
}) => {
  const { lang, t } = useTranslation();
  const [isSaved, setIsSaved] = useState<boolean>(() => isReleaseSaved(release.id));

  // If user prefers Hindi and this release has a paired Hindi translation, use Hindi title
  const hindiPair = release.availableLanguages?.find(l => l.lang === 'hi');
  const displayTitle = (lang === 'hi' && hindiPair?.title) ? hindiPair.title : release.title;

  const ministryHi = MINISTRIES_DATA.find(m => m.id === release.ministryId)?.nameHi;
  const displayMinistry = (lang === 'hi' && ministryHi) ? ministryHi : release.ministry;

  const CATEGORY_HI: Record<string, string> = {
    'Economy & Finance': 'अर्थव्यवस्था एवं वित्त',
    'Science & Technology': 'विज्ञान एवं प्रौद्योगिकी',
    'Defence & Security': 'रक्षा एवं सुरक्षा',
    'Health & Family Welfare': 'स्वास्थ्य एवं परिवार कल्याण',
    'Environment & Climate': 'पर्यावरण एवं जलवायु',
    'Agriculture & Rural': 'कृषि एवं ग्रामीण विकास',
    'Education & Skill': 'शिक्षा एवं कौशल',
    'Commerce & Industry': 'वाणिज्य एवं उद्योग',
    'National & Governance': 'राष्ट्रीय एवं प्रशासनिक',
    'Infrastructure & Transport': 'बुनियादी ढांचा एवं परिवहन'
  };
  const displayCategory = lang === 'hi' ? (CATEGORY_HI[release.category] || release.category) : release.category;

  const CONTENT_TYPE_HI: Record<string, string> = {
    'Press Release': 'प्रेस विज्ञप्ति',
    'Factsheet': 'तथ्य पत्रक',
    'Feature': 'विशेष लेख',
    'Infographic': 'इन्फोग्राफिक'
  };
  const displayContentType = lang === 'hi' ? (CONTENT_TYPE_HI[release.contentType] || release.contentType) : release.contentType;

  useEffect(() => {
    const handleSavedChange = (e: Event) => {
      const detail = (e as CustomEvent<{ id?: string; count?: number }>).detail;
      if (!detail?.id || detail.id === release.id) {
        setIsSaved(isReleaseSaved(release.id));
      }
    };
    window.addEventListener('pib_saved_updated', handleSavedChange);
    return () => window.removeEventListener('pib_saved_updated', handleSavedChange);
  }, [release.id]);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = toggleSaveRelease(release.id);
    setIsSaved(nextSaved);
  };

  const formattedDate = new Date(release.publishedAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = new Date(release.publishedAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  return (
    <article
      className={`group bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-[#0b3558] dark:hover:border-sky-500 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        variant === 'featured' ? 'ring-1 ring-amber-400/60 dark:ring-amber-500/40 bg-gradient-to-b from-amber-50/20 to-white dark:from-slate-900 dark:to-slate-900' : ''
      } ${className}`}
    >
      <div className="p-5">
        {/* Top Meta Header: Ministry, Category & Bookmark Button */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Link
            to={`/ministry/${release.ministryId}`}
            className="inline-flex items-center text-xs font-bold text-[#0b3558] dark:text-sky-400 hover:underline tracking-wide uppercase truncate max-w-[65%]"
          >
            {displayMinistry}
          </Link>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {displayCategory}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hidden sm:inline-block">
              {displayContentType}
            </span>

            {/* Quick Bookmark Button */}
            <button
              onClick={handleBookmarkToggle}
              title={isSaved ? 'Saved in your reading list (Click to remove)' : 'Save release to reading list'}
              aria-label={isSaved ? 'Remove saved release' : 'Save release'}
              className={`p-1 rounded-md transition-colors cursor-pointer ml-1 ${
                isSaved 
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700' 
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title Headline */}
        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0b3558] dark:group-hover:text-sky-400 transition-colors mb-2.5">
          <Link to={`/release/${release.id}`}>
            {displayTitle}
          </Link>
        </h3>

        {/* Excerpt */}
        {showExcerpt && (
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 md:line-clamp-3 mb-4 leading-relaxed">
            {release.excerpt}
          </p>
        )}

        {/* Highlighted figures snippet if available */}
        {release.keyFigures && release.keyFigures.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded p-2.5 mb-3 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3 text-xs">
            <Tag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white font-semibold">{release.keyFigures[0].metric}:</strong>{' '}
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{release.keyFigures[0].value}</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Footer: Date, Location, PRID & Action Links */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate} • {formattedTime}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{release.location}</span>
          </span>
          <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
            PRID: {release.prid}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Quick PDF Download */}
          <button
            onClick={() => generateReleasePdf(release)}
            title="Download Official Release PDF"
            className="p-1 rounded text-slate-500 hover:text-[#0b3558] dark:hover:text-sky-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Ask AI Assistant about this release */}
          <Link
            to={`/assistant?releaseId=${release.id}`}
            title="Ask AI Assistant about this release"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-semibold text-xs transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">{t.common.askAi}</span>
          </Link>

          {/* Full release page */}
          <Link
            to={`/release/${release.id}`}
            className="flex items-center gap-1 text-[#0b3558] dark:text-sky-400 font-semibold hover:underline"
          >
            <span>{t.common.readFull}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
