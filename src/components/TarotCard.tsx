import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2 } from 'lucide-react';
import { getCardImageUrl } from '../constants/cards';

interface TarotCardProps {
  name?: string;
  isReversed?: boolean;
  isRevealed: boolean;
  positionLabel?: string;
  onClick?: () => void;
}

export const TarotCard: React.FC<TarotCardProps> = ({
  name,
  isReversed,
  isRevealed,
  positionLabel,
  onClick
}) => {
  const imageUrl = name ? getCardImageUrl(name) : '';
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3 perspective-1000">
      {positionLabel && (
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-medium text-center px-2">
          {positionLabel}
        </span>
      )}
      <motion.div
        whileHover={!isRevealed ? { scale: 1.05, y: -5 } : {}}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        initial={false}
        animate={{ 
          rotateY: isRevealed ? 180 : 0,
          scale: isRevealed ? [1, 1.02, 1] : 1,
          z: isRevealed ? 50 : 0
        }}
        transition={{ 
          rotateY: { duration: 0.8, type: "spring", stiffness: 200, damping: 25 },
          scale: { duration: 0.4 },
          z: { duration: 0.4 }
        }}
        className="relative w-32 h-52 sm:w-40 sm:h-64 rounded-xl cursor-pointer preserve-3d group"
      >
        {/* Global Shadow & Glow (Doesn't rotate) */}
        <div className="absolute -inset-1 bg-tarot-purple/20 blur-xl rounded-xl -z-10" />
        
        {/* Card Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl border-2 border-tarot-gold/40 flex items-center justify-center overflow-hidden shadow-2xl shadow-tarot-purple/50">
          {/* Animated Dynamic Gradient Background */}
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, #4c1d95 0%, #1e3a8a 50%, #020617 100%)',
                'radial-gradient(circle at 100% 100%, #4c1d95 0%, #1e3a8a 50%, #020617 100%)',
                'radial-gradient(circle at 0% 100%, #4c1d95 0%, #1e3a8a 50%, #020617 100%)',
                'radial-gradient(circle at 100% 0%, #4c1d95 0%, #1e3a8a 50%, #020617 100%)',
                'radial-gradient(circle at 0% 0%, #4c1d95 0%, #1e3a8a 50%, #020617 100%)',
              ]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0"
          />

          {/* Intricate Pattern Background */}
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" className="text-tarot-gold">
              <defs>
                <pattern id="tarot-pattern-complex" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  {/* Base Diamond */}
                  <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  {/* Inner Circle with dots */}
                  <circle cx="30" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 2" />
                  <circle cx="30" cy="30" r="2" fill="currentColor" />
                  {/* Corner Accents */}
                  <path d="M0 0L15 15M45 45L60 60M60 0L45 15M15 45L0 60" stroke="currentColor" strokeWidth="0.2" />
                  {/* Star-like lines */}
                  <path d="M30 10V50M10 30H50" stroke="currentColor" strokeWidth="0.2" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tarot-pattern-complex)" />
            </svg>
          </div>

          {/* Inner Border */}
          <div className="absolute inset-2 border border-tarot-gold/30 rounded-lg flex items-center justify-center">
            <div className="absolute inset-1 border border-tarot-gold/10 rounded-md"></div>
            
            {/* Central Animated Element */}
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative z-10"
            >
              <Sparkles className="w-14 h-14 text-tarot-gold/60 drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]" />
            </motion.div>
          </div>

          {/* Shimmer Effect */}
          <motion.div 
            animate={{ 
              x: ['-150%', '250%'],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "linear",
              repeatDelay: 3
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-20"
          />
        </div>

        {/* Card Front */}
        <div 
          className={`absolute inset-0 w-full h-full rounded-xl border-2 border-tarot-gold bg-slate-900 flex flex-col items-center justify-between overflow-hidden text-center backface-hidden rotate-y-180 shadow-2xl shadow-tarot-purple/50 ${isReversed ? 'rotate-180' : ''}`}
        >
          {/* Reveal Glow Effect */}
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1, times: [0, 0.5, 1] }}
              className="absolute inset-0 bg-tarot-gold/20 pointer-events-none z-10"
            />
          )}

          <AnimatePresence>
            {!isImageLoaded && name && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-slate-800"
              >
                <Loader2 className="w-8 h-8 text-tarot-gold/40 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {name && (
            <motion.img 
              src={imageUrl} 
              alt={name} 
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0 }}
              animate={{ opacity: isImageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              onLoad={() => setIsImageLoaded(true)}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                // Fallback if image fails
                e.currentTarget.style.display = 'none';
                setIsImageLoaded(true);
              }}
            />
          )}
          <div className={`absolute bottom-0 left-0 right-0 bg-slate-950/80 p-2 backdrop-blur-sm ${isReversed ? 'rotate-180' : ''}`}>
             <h3 className="font-display text-[10px] sm:text-xs font-bold text-tarot-gold uppercase tracking-tight">
               {name}
             </h3>
             {isReversed && <span className="text-[8px] text-slate-400 uppercase mt-0.5 block">Invertida</span>}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
