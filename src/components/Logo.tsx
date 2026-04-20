import React from 'react';

export const Logo: React.FC<{ className?: string; hideText?: boolean }> = ({ className, hideText }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full text-tarot-gold">
        {/* Sun Rays */}
        <g stroke="currentColor" strokeWidth="0.5">
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2="50"
              y2="20"
              transform={`rotate(${i * 15} 50 50)`}
            />
          ))}
        </g>
        {/* Sun Circle */}
        <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
        {/* Crescent Moon */}
        <path
          d="M50 42 A 8 8 0 1 1 50 58 A 6 6 0 1 0 50 42"
          fill="currentColor"
        />
      </svg>
      {!hideText && (
        <>
          <h1 className="font-display text-2xl font-bold gold-text tracking-[0.2em] mt-2">
            VIDALUZ
          </h1>
          <div className="flex gap-12 -mt-8 w-full justify-center opacity-50">
            <span className="text-tarot-gold">✦</span>
            <span className="text-tarot-gold">✦</span>
          </div>
        </>
      )}
    </div>
  );
};
