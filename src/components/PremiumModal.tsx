import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Infinity, ImagePlus, Star } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, whatsappNumber }) => {
  if (!isOpen) return null;

  const handleContact = () => {
    if (whatsappNumber) {
      const message = encodeURIComponent("Olá! Gostaria de saber mais sobre a assinatura Premium do VidaLuz Tarot.");
      const cleanNumber = whatsappNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-2xl overflow-hidden border border-tarot-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.2)]"
        >
          {/* Decorative background element */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-tarot-gold/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900/50 rounded-full transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-6 relative z-10">
            <div className="inline-flex items-center justify-center p-4 bg-tarot-gold/10 rounded-full mb-2">
              <Sparkles className="w-10 h-10 text-tarot-gold" />
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold gold-text mb-2 tracking-tight">
                Desbloqueie o Premium
              </h2>
              <p className="text-slate-400 text-sm">
                Aprofunde sua jornada espiritual com acesso ilimitado a todas as ferramentas místicas.
              </p>
            </div>

            <div className="space-y-4 text-left mt-8">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="mt-1 p-2 bg-white/5 rounded-lg text-tarot-gold">
                  <Infinity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">Leituras Ilimitadas</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Consulte o Tarot quantas vezes desejar, sem limites diários restritivos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="mt-1 p-2 bg-white/5 rounded-lg text-tarot-gold">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">Interpretações Profundas</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Receba respostas ainda mais detalhadas usando IA avançada, focadas em sua jornada e desenvolvimento pessoal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="mt-1 p-2 bg-white/5 rounded-lg text-tarot-gold">
                  <ImagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">Manifestar Visão</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Traduza seus sentimentos e visões em cartas de Tarot exclusivas, completamente desenhadas e materializadas via IA (Geração de Imagens).
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleContact}
              className="w-full py-4 mt-4 bg-tarot-gold hover:bg-yellow-600 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            >
              Falar com Suporte para Assinar
            </button>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-4">
              Consulte os planos com nossa equipe
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
