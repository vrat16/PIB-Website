import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, RotateCcw, ArrowUpDown, 
  Sparkles, AlertCircle
} from 'lucide-react';
import { searchReleases } from '../services/searchService';
import { MINISTRIES_DATA } from '../data/ministries';
import { ReleaseCard } from '../components/common/ReleaseCard';
import { useTranslation } from '../i18n/useTranslation';
import type { SearchFilters } from '../types';

export const SearchPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read state from URL search params to preserve across navigation
  const queryParam = searchParams.get('q') || '';
  const ministryParam = searchParams.get('ministry') || 'all';
  const categoryParam = searchParams.get('category') || 'all';
  const typeParam = searchParams.get('type') || 'all';
  const langParam = searchParams.get('lang') || 'all';
  const sortParam = (searchParams.get('sort') as 'newest' | 'oldest') || 'newest';
  const startDateParam = searchParams.get('startDate') || '';
  const endDateParam = searchParams.get('endDate') || '';

  const [inputQuery, setInputQuery] = useState(queryParam);

  const currentFilters: SearchFilters = {
    query: queryParam,
    ministryId: ministryParam,
    category: categoryParam,
    contentType: typeParam,
    language: langParam,
    sortBy: sortParam,
    startDate: startDateParam,
    endDate: endDateParam
  };

  const searchResult = searchReleases(currentFilters);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('q', inputQuery.trim());
  };

  const handleClearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setInputQuery('');
  };

  const handleApplySuggestion = (suggestion: string) => {
    setInputQuery(suggestion);
    updateParam('q', suggestion);
  };

  const hasActiveFilters = Boolean(
    queryParam || 
    (ministryParam && ministryParam !== 'all') || 
    (categoryParam && categoryParam !== 'all') || 
    (typeParam && typeParam !== 'all') || 
    (langParam && langParam !== 'all') || 
    startDateParam || 
    endDateParam
  );

  return (
    <div className="pib-container py-8 space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
            <span>Smart Search 2.0</span>
            <span className="text-xs bg-[#0b3558] text-white px-2 py-0.5 rounded font-mono font-normal">
              Official PIB Index
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search across headlines, official ministerial releases, cabinet statements, and statistical reports.
          </p>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search by keywords, cabinet decisions, PRID or schemes..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0b3558] outline-hidden"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0b3558] hover:bg-[#164e7c] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Typo Tolerance Suggestion Banner ("Did you mean...?") */}
        {searchResult.suggestions.length > 0 && (
          <div className="mt-3 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Did you mean:</span>
            <div className="flex flex-wrap gap-1.5">
              {searchResult.suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => handleApplySuggestion(s)}
                  className="font-bold underline hover:text-amber-700 cursor-pointer"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Filters Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Filter className="w-4 h-4 text-[#0b3558] dark:text-sky-400" />
                <span>Filters & Refinements</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Ministry Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Ministry / Department
              </label>
              <select
                value={ministryParam}
                onChange={(e) => updateParam('ministry', e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Ministries ({MINISTRIES_DATA.length})</option>
                {MINISTRIES_DATA.map(m => (
                  <option key={m.id} value={m.id}>{m.shortName} - {m.nameEn}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Category
              </label>
              <select
                value={categoryParam}
                onChange={(e) => updateParam('category', e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="Economy & Finance">Economy & Finance</option>
                <option value="Science & Technology">Science & Technology</option>
                <option value="Agriculture & Rural">Agriculture & Rural</option>
                <option value="Health & Family Welfare">Health & Family Welfare</option>
                <option value="Defence & Security">Defence & Security</option>
                <option value="Environment & Climate">Environment & Climate</option>
                <option value="Education & Skill">Education & Skill</option>
                <option value="Commerce & Industry">Commerce & Industry</option>
                <option value="Infrastructure & Transport">Infrastructure & Transport</option>
              </select>
            </div>

            {/* Content Type Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Content Format
              </label>
              <select
                value={typeParam}
                onChange={(e) => updateParam('type', e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Content Types</option>
                <option value="Press Release">Press Release</option>
                <option value="Factsheet">Factsheet</option>
                <option value="Feature">Feature Article</option>
              </select>
            </div>

            {/* Language Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Language
              </label>
              <select
                value={langParam}
                onChange={(e) => updateParam('lang', e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Languages</option>
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* Date Range Filters */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Date Range
              </span>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">From Date:</label>
                <input
                  type="date"
                  value={startDateParam}
                  onChange={(e) => updateParam('startDate', e.target.value)}
                  className="w-full text-xs p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">To Date:</label>
                <input
                  type="date"
                  value={endDateParam}
                  onChange={(e) => updateParam('endDate', e.target.value)}
                  className="w-full text-xs p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Search Results Column */}
        <main className="lg:col-span-3 space-y-5">
          {/* Results Bar: Total Count & Sorting */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-700 dark:text-slate-300 font-medium">
              Found <strong className="text-slate-900 dark:text-white font-bold">{searchResult.totalCount}</strong> verified record{searchResult.totalCount === 1 ? '' : 's'}
              {queryParam && <span> for query "<strong className="text-slate-900 dark:text-white">{queryParam}</strong>"</span>}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 flex items-center gap-1 font-medium">
                <ArrowUpDown className="w-3 h-3" />
                <span>Sort By:</span>
              </span>
              <select
                value={sortParam}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* ZERO RESULTS CASE (Section 11 Zero-result requirements) */}
          {searchResult.totalCount === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-5">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No matching releases found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  We could not find verified official records matching your exact filter combination.
                </p>
              </div>

              {/* Suggestions to user */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-lg max-w-lg mx-auto text-left text-xs space-y-2 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  Recommended Steps:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                  <li>Check spelling or try more general keywords.</li>
                  <li>Clear specific ministry or content-type filters.</li>
                  <li>Broaden the date range if searching for older announcements.</li>
                  {searchResult.relatedTerms.length > 0 && (
                    <li>
                      Explore related terms: {' '}
                      {searchResult.relatedTerms.map((t, idx) => (
                        <button
                          key={t}
                          onClick={() => handleApplySuggestion(t)}
                          className="font-semibold text-sky-600 dark:text-sky-400 hover:underline mr-1"
                        >
                          {t}{idx < searchResult.relatedTerms.length - 1 ? ',' : ''}
                        </button>
                      ))}
                    </li>
                  )}
                </ul>
              </div>

              <button
                onClick={handleClearAllFilters}
                className="px-4 py-2 bg-[#0b3558] hover:bg-[#164e7c] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Results List */
            <div className="space-y-4">
              {searchResult.releases.map(rel => (
                <ReleaseCard key={rel.id} release={rel} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
