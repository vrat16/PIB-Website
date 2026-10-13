import React, { useState } from 'react';
import { 
  Archive, Search, Calendar, AlertTriangle, 
  ArrowRight, RotateCcw
} from 'lucide-react';
import { RELEASES_DATA } from '../data/releases';
import { MINISTRIES_DATA } from '../data/ministries';
import { BrokenLinkModal } from '../components/common/BrokenLinkModal';
import type { PressRelease } from '../types';
import { Link } from 'react-router-dom';

export const ArchiveExplorerPage: React.FC = () => {
  const years = ['all', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2015', '2014'];

  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [archiveQuery, setArchiveQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Modal State for Broken Link Recovery Testing
  const [modalOpen, setModalOpen] = useState(false);
  const [activeUnavailableRelease, setActiveUnavailableRelease] = useState<PressRelease | null>(null);

  const filteredReleases = RELEASES_DATA.filter(release => {
    // Year filter
    if (selectedYear !== 'all') {
      const year = new Date(release.publishedAt).getFullYear().toString();
      if (year !== selectedYear) return false;
    }

    // Ministry filter
    if (selectedMinistry !== 'all' && release.ministryId !== selectedMinistry) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && release.category !== selectedCategory) {
      return false;
    }

    // Text query
    if (archiveQuery.trim()) {
      const q = archiveQuery.toLowerCase();
      const match = (
        release.title.toLowerCase().includes(q) ||
        release.originalText.toLowerCase().includes(q) ||
        release.prid.includes(q) ||
        release.ministry.toLowerCase().includes(q)
      );
      if (!match) return false;
    }

    return true;
  });

  // Sort historical oldest first or newest first
  const displayReleases = filteredReleases.slice(0, visibleCount);

  const handleTestUnavailableDocument = (release: PressRelease) => {
    setActiveUnavailableRelease(release);
    setModalOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedYear('all');
    setSelectedMinistry('all');
    setSelectedCategory('all');
    setArchiveQuery('');
    setVisibleCount(6);
  };

  return (
    <div className="pib-container py-8 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-700 text-white">
              <Archive className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-serif text-slate-900 dark:text-white">
              Historical Archive Explorer
            </h1>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Explore authenticated government records spanning 2014 to present. Includes broken-link recovery protocols for historical documents.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 font-mono font-bold px-2.5 py-1 rounded">
            2014 — 2026 Index
          </span>
        </div>
      </div>

      {/* Year Filter Timeline Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
          Filter by Gazette Publication Year
        </label>
        <div className="flex flex-wrap gap-2">
          {years.map(yr => (
            <button
              key={yr}
              onClick={() => {
                setSelectedYear(yr);
                setVisibleCount(6);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedYear === yr
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {yr === 'all' ? 'All Archive Years' : yr}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls: Keywords & Dropdowns */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={archiveQuery}
              onChange={(e) => setArchiveQuery(e.target.value)}
              placeholder="Search historical releases, PRID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Ministry */}
          <select
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">All Ministries</option>
            {MINISTRIES_DATA.map(m => (
              <option key={m.id} value={m.id}>{m.shortName} - {m.nameEn}</option>
            ))}
          </select>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="Economy & Finance">Economy & Finance</option>
            <option value="Science & Technology">Science & Technology</option>
            <option value="National & Governance">National & Governance</option>
            <option value="Agriculture & Rural">Agriculture & Rural</option>
            <option value="Commerce & Industry">Commerce & Industry</option>
            <option value="Education & Skill">Education & Skill</option>
            <option value="Environment & Climate">Environment & Climate</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            Displaying <strong>{displayReleases.length}</strong> of <strong>{filteredReleases.length}</strong> historical releases
          </span>
          {(selectedYear !== 'all' || selectedMinistry !== 'all' || selectedCategory !== 'all' || archiveQuery) && (
            <button
              onClick={handleResetFilters}
              className="text-purple-700 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Archive Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Historical Release Cards */}
      {displayReleases.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            No historical records matched your archive filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-purple-700 text-white text-xs font-semibold rounded-lg"
          >
            View All Historical Records
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayReleases.map(rel => {
            const relYear = new Date(rel.publishedAt).getFullYear();
            const isHistoricalFlag = rel.isHistorical || relYear < 2024;
            const hasUnavailableDoc = rel.attachmentStatus === 'unavailable';

            return (
              <div
                key={rel.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3 hover:border-purple-600 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                      {rel.ministry}
                    </span>
                    {isHistoricalFlag && (
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono font-semibold">
                        Archived {relYear}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400">PRID: {rel.prid}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  <Link to={`/release/${rel.id}`} className="hover:underline">
                    {rel.title}
                  </Link>
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rel.excerpt}
                </p>

                {/* Attachment Status Indicator / Recovery Trigger */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(rel.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* If unavailable attachment, show recovery tester pill */}
                    {hasUnavailableDoc && (
                      <button
                        onClick={() => handleTestUnavailableDocument(rel)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 text-xs font-semibold cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Test Broken-Link Recovery</span>
                      </button>
                    )}

                    <Link
                      to={`/release/${rel.id}`}
                      className="text-purple-700 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Read Release</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More Interaction */}
      {visibleCount < filteredReleases.length && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer transition-colors"
          >
            Load Older Releases ({filteredReleases.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* Broken-Link Recovery Modal */}
      {activeUnavailableRelease && (
        <BrokenLinkModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          documentTitle={activeUnavailableRelease.attachmentTitle || 'Archived Gazette File'}
          documentUrl={activeUnavailableRelease.attachmentUrl}
          alternativeOfficialUrl={activeUnavailableRelease.alternativeOfficialUrl}
          releaseTitle={activeUnavailableRelease.title}
          releasePrid={activeUnavailableRelease.prid}
        />
      )}
    </div>
  );
};
