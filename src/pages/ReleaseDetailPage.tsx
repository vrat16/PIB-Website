import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Printer, Share2, Bot, Download, 
  ArrowLeft, Globe, FileText, Check, Tag, ShieldCheck, AlertTriangle, Bookmark 
} from 'lucide-react';
import { getReleaseById, getRelatedReleases } from '../services/searchService';
import { isReleaseSaved, toggleSaveRelease } from '../services/bookmarkService';
import { savePreferences } from '../services/preferenceService';
import { BrokenLinkModal } from '../components/common/BrokenLinkModal';
import { OfficialImage } from '../components/common/OfficialImage';
import { generateReleasePdf } from '../utils/pdfGenerator';
import { useTranslation } from '../i18n/useTranslation';
import { MINISTRIES_DATA } from '../data/ministries';
import { getLocalizedRelease } from '../services/languageService';

export const ReleaseDetailPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [copiedToast, setCopiedToast] = useState(false);
  const [brokenModalOpen, setBrokenModalOpen] = useState(false);

  const rawRelease = id ? getReleaseById(id) : undefined;
  const [isSaved, setIsSaved] = useState(() => rawRelease ? isReleaseSaved(rawRelease.id) : false);
  const [inArticleLang, setInArticleLang] = useState<'en' | 'hi'>(() => {
    return rawRelease?.language || lang;
  });

  const release = getLocalizedRelease(rawRelease, inArticleLang) || rawRelease;

  const handleLanguageSwitch = (targetLang: 'en' | 'hi') => {
    setInArticleLang(targetLang);
    savePreferences({ preferredLanguage: targetLang });
    if (rawRelease?.availableLanguages) {
      const match = rawRelease.availableLanguages.find(l => l.lang === targetLang);
      if (match && match.releaseId !== rawRelease.id) {
        navigate(`/release/${match.releaseId}`);
      }
    }
  };

  const isHi = inArticleLang === 'hi';
  const displayMinistry = release?.ministry || '';
  const displayContentType = release?.contentType || '';
  const displayLocation = release?.location || '';

  if (!release) {
    return (
      <div className="pib-container py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Official Release Record Not Found
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          The requested Press Release ID (PRID: {id}) is not catalogued in the local demonstration dataset.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0b3558] text-white text-xs font-semibold rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  const relatedReleases = getRelatedReleases(release);

  const formattedDate = new Date(release.publishedAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const formattedTime = new Date(release.publishedAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAttachmentClick = (e: React.MouseEvent) => {
    if (release.attachmentStatus === 'unavailable') {
      e.preventDefault();
      setBrokenModalOpen(true);
    }
  };

  return (
    <div className="pib-container py-8 space-y-8 max-w-5xl">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-3 no-print">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-[#0b3558] hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <Link to={`/ministry/${release.ministryId}`} className="hover:text-[#0b3558] hover:underline">
            {displayMinistry}
          </Link>
          <span>/</span>
          <span className="font-mono text-slate-400">PRID: {release.prid}</span>
        </div>

        {/* Action Buttons: Language, Print, Share, AI Assistant */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* In-Article Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 sm:p-0.5 rounded border border-slate-200 dark:border-slate-700 min-h-[36px] sm:min-h-0">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <button
              onClick={() => handleLanguageSwitch('en')}
              className={`px-2.5 py-1 sm:py-0.5 rounded text-xs sm:text-[11px] font-bold cursor-pointer transition-colors ${
                inArticleLang === 'en'
                  ? 'bg-[#0b3558] text-white shadow-2xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageSwitch('hi')}
              className={`px-2.5 py-1 sm:py-0.5 rounded text-xs sm:text-[11px] font-bold cursor-pointer transition-colors ${
                inArticleLang === 'hi'
                  ? 'bg-[#0b3558] text-white shadow-2xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <button
            onClick={() => {
              if (release) {
                const next = toggleSaveRelease(release.id);
                setIsSaved(next);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-1 min-h-[36px] sm:min-h-0 rounded border transition-colors cursor-pointer text-xs ${
              isSaved
                ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 font-bold'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title={isSaved ? 'Release is saved in your reading list (Click to remove)' : 'Save release to reading list'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-amber-600 dark:text-amber-400' : ''}`} />
            <span>{isSaved ? t.common.saved : t.common.save}</span>
          </button>

          <button
            onClick={() => generateReleasePdf(release)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-1 min-h-[36px] sm:min-h-0 rounded bg-[#0b3558] hover:bg-[#164e7c] text-white font-semibold transition-colors cursor-pointer shadow-2xs text-xs"
            title="Download Official PDF Release"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.common.downloadPdf}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-1 min-h-[36px] sm:min-h-0 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-xs"
          >
            {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedToast ? 'URL Copied' : t.common.share}</span>
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.common.print}</span>
          </button>

          <Link
            to={`/assistant?releaseId=${release.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-1 min-h-[36px] sm:min-h-0 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors cursor-pointer shadow-2xs text-xs"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{t.common.askAi}</span>
          </Link>
        </div>
      </div>

      {/* Main Release Article */}
      <article className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 md:p-10 shadow-xs space-y-6">
        {/* Release Metadata Header */}
        <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs md:text-sm font-bold text-[#0b3558] dark:text-sky-400 uppercase tracking-wider">
              {displayMinistry}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                {displayContentType}
              </span>
              <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                PRID: {release.prid}
              </span>
            </div>
          </div>

          <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-serif leading-tight">
            {release.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{displayLocation}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate} at {formattedTime} (IST)</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Government Release</span>
            </span>
          </div>

          {/* In-Article Language Switcher Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#0b3558] dark:text-sky-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'hi' ? 'आधिकारिक भाषा संस्करण (Language Options):' : 'Official Language Options:'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLanguageSwitch('en')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  inArticleLang === 'en'
                    ? 'bg-[#0b3558] text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageSwitch('hi')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  inArticleLang === 'hi'
                    ? 'bg-[#0b3558] text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image (Only rendered if authentic image exists and loads, no placeholder if absent) */}
        {release.imageUrl && (
          <OfficialImage 
            src={release.imageUrl} 
            alt={release.title} 
            caption={`Official Press Information Bureau Photo Stream • ${displayMinistry} • PRID: ${release.prid}`}
            className="my-4 max-h-96"
          />
        )}

        {/* Highlighted Policy Metrics Callout Box */}
        {release.keyFigures && release.keyFigures.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-bold text-[#0b3558] dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Official Key Figures & Targets</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {release.keyFigures.map((fig, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{fig.metric}</div>
                  <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 my-0.5">{fig.value}</div>
                  <div className="text-[10px] text-slate-400">{fig.context}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Authentic Body Text */}
        <div className="prose dark:prose-invert max-w-none text-sm md:text-base leading-relaxed text-slate-800 dark:text-slate-200 space-y-4">
          {release.originalText.split('\n\n').map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Key Summary Bullets Box */}
        {release.summaryBullets && release.summaryBullets.length > 0 && (
          <div className="bg-sky-50/60 dark:bg-sky-950/30 rounded-xl p-5 border border-sky-200 dark:border-sky-900 space-y-2.5">
            <h3 className="text-xs font-bold text-sky-900 dark:text-sky-300 uppercase tracking-wider">
              Summary Highlights
            </h3>
            <ul className="space-y-1.5 text-xs md:text-sm text-sky-950 dark:text-sky-200">
              {release.summaryBullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Document Attachments Section */}
        {release.attachmentTitle && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
              Official Attachments & Gazette Notifications
            </h3>
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#0b3558] dark:text-sky-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {release.attachmentTitle}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Size: {release.attachmentSize || 'Document'} • {release.attachmentStatus === 'unavailable' ? 'Archived Attachment' : 'Official PDF'}
                  </div>
                </div>
              </div>

              {release.attachmentStatus === 'unavailable' ? (
                <button
                  onClick={handleAttachmentClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Check Archive Status</span>
                </button>
              ) : (
                <button
                  onClick={() => generateReleasePdf(release)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b3558] hover:bg-[#164e7c] text-white rounded text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document (PDF)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Official Source Footnote */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>Release ID: <strong>{release.prid}</strong></span>
          <span>Source: <a href={release.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">{release.sourceUrl}</a></span>
        </div>
      </article>

      {/* SECTION 13: RELATED RELEASES GROUPING */}
      {relatedReleases.length > 0 && (
        <section aria-labelledby="related-announcements-heading" className="space-y-4 no-print">
          <h2 id="related-announcements-heading" className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            Related Official Announcements ({relatedReleases.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedReleases.map(rel => (
              <div
                key={rel.id}
                className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#0b3558] dark:text-sky-400 uppercase tracking-wider">
                    {rel.ministry}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                    <Link to={`/release/${rel.id}`} className="hover:underline">
                      {rel.title}
                    </Link>
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">PRID: {rel.prid}</span>
                  <Link to={`/release/${rel.id}`} className="text-sky-600 font-semibold hover:underline">
                    View Release →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Broken-Link Recovery Modal (Section 14 & Recovery workflow) */}
      <BrokenLinkModal
        isOpen={brokenModalOpen}
        onClose={() => setBrokenModalOpen(false)}
        documentTitle={release.attachmentTitle || 'Archived Document'}
        documentUrl={release.attachmentUrl}
        alternativeOfficialUrl={release.alternativeOfficialUrl}
        releaseTitle={release.title}
        releasePrid={release.prid}
      />
    </div>
  );
};
