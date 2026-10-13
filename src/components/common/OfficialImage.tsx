import React, { useState } from 'react';
import { ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { EmblemOfIndia } from '../brand/EmblemOfIndia';

interface OfficialImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'banner' | 'square';
  caption?: string;
}

export const OfficialImage: React.FC<OfficialImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'video',
  caption
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If there is no image source or if the image fails to load, do not keep an empty placeholder
  if (!src || hasError) {
    return null;
  }

  return (
    <figure className={`relative overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-80'}`}
      />

      {/* Official Government Verification Tag overlay */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-[10px] text-white font-medium border border-white/20">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>Official PIB Photo Archive</span>
      </div>

      {caption && (
        <figcaption className="p-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
