import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, ArrowLeft, ArrowRight } from 'lucide-react';
import { MINISTRIES_DATA } from '../data/ministries';
import { RELEASES_DATA } from '../data/releases';
import { ReleaseCard } from '../components/common/ReleaseCard';

export const MinistryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // If 'all' or no specific id, show list of all ministries
  if (!id || id === 'all') {
    return (
      <div className="pib-container py-8 space-y-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#0b3558] text-white">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-serif text-slate-900 dark:text-white">
              Ministries & Departments of India
            </h1>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Browse official press releases and policy briefs classified by Union Ministry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {MINISTRIES_DATA.map(ministry => {
            const count = RELEASES_DATA.filter(r => r.ministryId === ministry.id).length;
            return (
              <Link
                key={ministry.id}
                to={`/ministry/${ministry.id}`}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-[#0b3558] dark:hover:border-sky-500 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#0b3558] dark:text-sky-400 font-mono">
                      {ministry.shortName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {count} release{count === 1 ? '' : 's'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0b3558] dark:group-hover:text-sky-400 transition-colors">
                    {ministry.nameEn}
                  </h3>
                  <div className="text-xs font-serif text-slate-500">
                    {ministry.nameHi}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {ministry.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-[#0b3558] dark:text-sky-400 font-semibold">
                  <span>Explore Releases</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const ministry = MINISTRIES_DATA.find(m => m.id === id);

  if (!ministry) {
    return (
      <div className="pib-container py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ministry Not Found</h2>
        <Link to="/ministry/all" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0b3558] text-white rounded text-xs font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>View All Ministries</span>
        </Link>
      </div>
    );
  }

  const ministryReleases = RELEASES_DATA.filter(r => r.ministryId === ministry.id);

  return (
    <div className="pib-container py-8 space-y-8">
      {/* Ministry Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <Link to="/ministry/all" className="hover:underline flex items-center gap-1 text-[#0b3558] dark:text-sky-400 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Ministries</span>
          </Link>
          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
            Nodal Code: {ministry.id.toUpperCase()}
          </span>
        </div>

        <div>
          <span className="text-xs font-bold text-[#0b3558] dark:text-sky-400 uppercase tracking-wider block mb-1">
            {ministry.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-slate-900 dark:text-white">
            {ministry.nameEn}
          </h1>
          <h2 className="text-sm font-serif text-slate-500 mt-0.5">
            {ministry.nameHi}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {ministry.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-xs">
          <span>
            Showing <strong>{ministryReleases.length}</strong> authenticated records in local repository
          </span>
        </div>
      </div>

      {/* Releases from this Ministry */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Published Releases & Briefings
        </h3>

        {ministryReleases.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center text-xs text-slate-500 border border-slate-200 dark:border-slate-800">
            No official releases currently catalogued for this ministry in the repository.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ministryReleases.map(rel => (
              <ReleaseCard key={rel.id} release={rel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
