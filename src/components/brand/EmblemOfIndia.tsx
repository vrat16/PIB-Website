import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
}

export const EmblemOfIndia: React.FC<EmblemProps> = ({ className = 'h-10 w-auto', size = 40 }) => {
  return (
    <img
      src="/assets/brand/ashoka-pillar.png"
      alt="State Emblem of India"
      style={{ height: size, width: 'auto' }}
      className={`object-contain inline-block dark:brightness-0 dark:invert ${className}`}
    />
  );
};
