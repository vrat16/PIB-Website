import React from 'react';

interface PibLogoProps {
  variant?: 'full' | 'compact' | 'light';
  className?: string;
}

export const PibLogo: React.FC<PibLogoProps> = ({ variant = 'full', className = '' }) => {
  const isLight = variant === 'light';
  const isCompact = variant === 'compact';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 1. Official State Emblem of India (Ashoka Pillar) */}
      <div className="flex-shrink-0 flex items-center">
        <img
          src="/assets/brand/ashoka-pillar.png"
          alt="State Emblem of India"
          className={`${isCompact ? 'h-9 md:h-10' : 'h-11 md:h-12'} w-auto object-contain ${
            isLight ? 'brightness-0 invert' : 'dark:brightness-0 dark:invert'
          }`}
        />
      </div>

      {/* Vertical divider */}
      <div className={`h-10 md:h-11 w-px ${isLight ? 'bg-white/30' : 'bg-slate-300 dark:bg-slate-700'}`} />

      {/* 2. Official Circular PIB Logo & Bilingual Identity */}
      <div className="flex items-center gap-2.5">
        <img
          src="/assets/brand/pib-official-logo.png"
          alt="Press Information Bureau Official Emblem"
          className={`${isCompact ? 'w-10 h-10 md:w-11 md:h-11' : 'w-11 h-11 md:w-13 md:h-13'} object-contain flex-shrink-0 drop-shadow-2xs`}
        />

        {/* Bilingual Typography */}
        <div className="flex flex-col justify-center">
          <span
            className={`text-sm md:text-base font-bold font-serif leading-tight ${
              isLight ? 'text-white' : 'text-[#0b3558] dark:text-sky-300'
            }`}
          >
            पत्र सूचना कार्यालय
          </span>
          <span
            className={`text-xs md:text-sm font-bold tracking-wider leading-tight ${
              isLight ? 'text-slate-100' : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            PRESS INFORMATION BUREAU
          </span>
          <span
            className={`text-[10px] md:text-[11px] font-semibold tracking-wide leading-tight ${
              isLight ? 'text-amber-200' : 'text-[#b45309] dark:text-amber-400'
            }`}
          >
            भारत सरकार • GOVERNMENT OF INDIA
          </span>
        </div>
      </div>
    </div>
  );
};
