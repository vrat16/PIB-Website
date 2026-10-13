import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, Trash2, Download, Printer, Search, 
  ArrowRight, ShieldCheck, Filter, FileText, CheckCircle2 
} from 'lucide-react';
import { getSavedReleases, removeSavedRelease, clearAllSavedReleases } from '../services/bookmarkService';
import { ReleaseCard } from '../components/common/ReleaseCard';
import { generateSavedReleasesPdf } from '../utils/pdfGenerator';
import { useTranslation } from '../i18n/useTranslation';
import type { PressRelease, Category } from '../types';

export const SavedReleasesPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const [savedItems, setSavedItems] = useState<PressRelease[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadItems = () => {
    setSavedItems(getSavedReleases());
  };

  useEffect(() => {
    loadItems();
    const handleUpdate = () => loadItems();
    window.addEventListener('pib_saved_updated', handleUpdate);
    return () => window.removeEventListener('pib_saved_updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRemove = (id: string, title: string) => {
    removeSavedRelease(id);
    showToast(`Removed "${title.slice(0, 32)}..." from saved items`);
  };

  const handleClearAll = () => {
    if (savedItems.length === 0) return;
    if (window.confirm('Are you sure you want to clear all saved press releases?')) {
      clearAllSavedReleases();
      showToast('All saved releases cleared');
    }
  };

  const handleExportJSON = () => {
    if (savedItems.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pib-saved-releases-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported saved list as JSON');
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter items
  const filteredItems = savedItems.filter(item => {
    const matchesSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prid.includes(searchQuery) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(savedItems.map(item => item.category)));

  return (
    <div className="pib-container py-8 max-w-6xl space-y-6" id="main-content">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3 bg-slate-900 text-white rounded-lg shadow-lg flex items-center gap-2 text-xs border border-slate-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Bookmark className="w-5 h-5 fill-current" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-serif text-slate-900 dark:text-white">
              Saved Press Releases & Articles
            </h1>
            <span className="text-xs bg-[#0b3558] text-white px-2.5 py-0.5 rounded-full font-bold ml-2">
              {savedItems.length}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Your personal official reading list, policy reference documents, and competitive exam preparation notes.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => generateSavedReleasesPdf(savedItems)}
            disabled={savedItems.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b3558] hover:bg-[#164e7c] text-white text-xs font-semibold disabled:opacity-40 cursor-pointer transition-colors shadow-2xs"
            title="Download saved releases as an official PDF dossier"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.saved.downloadDossierPdf}</span>
          </button>

          <button
            onClick={handleExportJSON}
            disabled={savedItems.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium disabled:opacity-40 cursor-pointer transition-colors"
            title="Download saved releases as structured JSON data"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.saved.exportJson}</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={savedItems.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium disabled:opacity-40 cursor-pointer transition-colors"
            title="Print saved reading list"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.common.print}</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={savedItems.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium disabled:opacity-40 cursor-pointer transition-colors"
            title="Clear all saved articles"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.saved.clearAll}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      {savedItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter saved releases by keyword, ministry, or PRID..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0b3558]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Categories ({savedItems.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Saved Releases Listing or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing {filteredItems.length} of {savedItems.length} saved releases</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(release => (
              <div key={release.id} className="relative group">
                <ReleaseCard release={release} showExcerpt={true} />
              </div>
            ))}
          </div>
        </div>
      ) : savedItems.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No matching saved releases found
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords or resetting the category filter.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Empty State when no releases saved at all */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
              You Have No Saved Press Releases Yet
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Whenever you browse any official press release or cabinet briefing on PIB, click the <strong>Bookmark (🔖)</strong> icon to save it here for fast offline reading, policy review, or competitive examination preparation.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b3558] hover:bg-[#164e7c] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <span>Explore Latest Releases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Smart Search</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
