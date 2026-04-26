import React, { useState } from 'react';
import { TAROT_CARDS, POSITIONS, getCardImageUrl } from '../constants/cards';
import { TarotCard } from './TarotCard';
import { getTarotInterpretation, TarotCard as ITarotCard } from '../lib/gemini';
import { db, auth } from '../lib/firebase';
import { addDoc, collection, Timestamp, query, where, getDocs, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, ChevronRight, Share2, Check, Crown } from 'lucide-react';
import Markdown from 'react-markdown';
import { UserProfile, AppSettings } from '../hooks/useAppUser';
import { PremiumModal } from './PremiumModal';

interface DailyReadingProps {
  profile: UserProfile | null;
  settings: AppSettings | null;
}

export const DailyReading: React.FC<DailyReadingProps> = ({ profile, settings }) => {
  const [step, setStep] = useState<'question' | 'shuffle' | 'reveal' | 'interpretation'>('question');
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<ITarotCard[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastReadingId, setLastReadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isCheckingLimit, setIsCheckingLimit] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  const checkReadingLimit = async () => {
    if (!auth.currentUser || !settings?.isReadingLimitEnabled) return true;
    if (profile?.isPremium || profile?.role === 'admin') return true;

    setIsCheckingLimit(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const q = query(
        collection(db, 'readings'),
        where('userId', '==', auth.currentUser.uid),
        where('timestamp', '>=', Timestamp.fromDate(today)),
        limit(1)
      );
      
      const snap = await getDocs(q);
      if (!snap.empty) {
        setIsPremiumModalOpen(true);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error checking limit:", err);
      return true; // Allow if check fails to not block user
    } finally {
      setIsCheckingLimit(false);
    }
  };

  const handleShare = async () => {
    const baseUrl = window.location.origin;
    const shareUrl = lastReadingId ? `${baseUrl}?view=reading&id=${lastReadingId}` : window.location.href;
    const shareText = `Minha Tiragem de Tarot - VidaLuz\n\nPergunta: ${question || 'Tiragem Diária'}\n\nCartas:\n${selectedCards.map((c, i) => `- ${POSITIONS[i]}: ${c.name}${c.isReversed ? ' (Invertida)' : ''}`).join('\n')}\n\nInterpretação:\n${interpretation}\n\nVeja sua tiragem completa em: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha Tiragem de Tarot - VidaLuz',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
    }
  };

  const startShuffle = async () => {
    setError(null);
    const canProceed = await checkReadingLimit();
    if (canProceed) {
      setStep('shuffle');
    }
  };

  const drawCards = () => {
    setIsPreloading(true);
    const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 3).map(name => ({
      name,
      isReversed: Math.random() > 0.8, // 20% chance of being reversed
      meaning: '' // Will be filled by AI
    }));
    setSelectedCards(picked);

    let loadedCount = 0;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === 3) {
        setIsPreloading(false);
        setStep('reveal');
      }
    };

    picked.forEach(card => {
      const img = new Image();
      img.src = getCardImageUrl(card.name);
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded;
    });
  };

  const revealCard = (index: number) => {
    if (index === revealedCount) {
      setRevealedCount(prev => prev + 1);
    }
  };

  const getInterpretation = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTarotInterpretation(selectedCards, question || "Tiragem diária para orientação geral.");
      
      // Check if result is an error message from gemini.ts
      if (result.startsWith("Erro") || result.startsWith("A conexão") || result.startsWith("O oráculo permaneceu")) {
        setError(result);
        setLoading(false);
        return;
      }

      setInterpretation(result);
      
      // Save to Firestore
      try {
        if (auth.currentUser) {
          const docRef = await addDoc(collection(db, 'readings'), {
            userId: auth.currentUser.uid,
            timestamp: Timestamp.now(),
            type: question ? 'question' : 'daily',
            question: question || 'Tiragem Diária',
            cards: selectedCards.map((c: any, i: number) => ({ ...c, position: POSITIONS[i] })),
            interpretation: result
          });
          setLastReadingId(docRef.id);
        }
      } catch (fsError) {
        console.error("Failed to save reading to history:", fsError);
      }
      
      setStep('interpretation');
    } catch (err) {
      console.error("Interpretation error:", err);
      setError("Ocorreu um erro inesperado ao consultar o oráculo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-[80vh] flex flex-col items-center justify-center">
      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} whatsappNumber={settings?.whatsappNumber || undefined} />
      
      <AnimatePresence mode="wait">
        {step === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-xl glass-panel p-10 space-y-8 text-center"
          >
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-bold gold-text uppercase tracking-tight">O que você deseja saber?</h2>
              <p className="text-slate-400 text-sm">Concentre-se em sua pergunta ou deixe em branco para uma orientação geral para o dia de hoje.</p>
            </div>
            
            <textarea
              value={question}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
              placeholder="Ex: Como será meu dia? O que devo focar no trabalho?"
              className="w-full h-32 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-tarot-gold/50 transition-all resize-none"
            />
            
            <button
              onClick={startShuffle}
              disabled={isCheckingLimit}
              className="w-full py-5 sm:py-4 bg-tarot-gold hover:bg-yellow-600 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group text-lg sm:text-base disabled:opacity-50"
            >
              {isCheckingLimit ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Iniciar Tiragem
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {!profile?.isPremium && settings?.isReadingLimitEnabled && (
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest">
                <Crown className="w-3 h-3 text-tarot-gold" />
                Limite: 1 tiragem gratuita por dia
              </div>
            )}
          </motion.div>
        )}

        {step === 'shuffle' && (
          <motion.div
            key="shuffle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-12"
          >
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-bold gold-text uppercase tracking-tight">Embaralhando...</h2>
              <p className="text-slate-400">Concentre-se na sua energia e na sua pergunta.</p>
            </div>
            
            <div className="flex justify-center -space-x-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    x: [0, 20, -20, 0],
                    rotate: [0, 5, -5, 0],
                    y: [0, -10, 10, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-48 rounded-xl border-2 border-tarot-gold/30 card-gradient shadow-2xl"
                />
              ))}
            </div>
            
            <button
              onClick={drawCards}
              disabled={isPreloading}
              className="px-12 py-4 bg-tarot-gold hover:bg-yellow-600 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 mx-auto"
            >
              {isPreloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Conectando ao Oráculo...
                </>
              ) : (
                'Parar e Tirar Cartas'
              )}
            </button>
          </motion.div>
        )}

        {step === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full space-y-12 text-center"
          >
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-bold gold-text uppercase tracking-tight">Suas Cartas</h2>
              <p className="text-slate-400">Clique em cada carta para revelá-la.</p>
            </div>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              className="flex flex-wrap justify-center gap-6 sm:gap-12 py-4"
            >
              {selectedCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex justify-center"
                >
                  <TarotCard
                    name={card.name}
                    isReversed={card.isReversed}
                    isRevealed={idx < revealedCount}
                    positionLabel={POSITIONS[idx]}
                    onClick={() => revealCard(idx)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {revealedCount === 3 && (
              <div className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm max-w-md mx-auto"
                  >
                    {error}
                  </motion.div>
                )}
                
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={getInterpretation}
                  disabled={loading}
                  className="px-12 py-4 bg-tarot-gold hover:bg-yellow-600 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Consultando Oráculo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      {error ? "Tentar Novamente" : "Ver Interpretação"}
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'interpretation' && (
          <motion.div
            key="interpretation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl space-y-8"
          >
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-8 py-4"
            >
              {selectedCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  className="flex justify-center"
                >
                  <TarotCard
                    name={card.name}
                    isReversed={card.isReversed}
                    isRevealed={true}
                    positionLabel={POSITIONS[idx]}
                  />
                </motion.div>
              ))}
            </motion.div>

            <div className="glass-panel p-6 sm:p-8 md:p-12 space-y-8 relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-tarot-gold/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-tarot-gold/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-tarot-gold" />
                  </div>
                  <h3 className="font-display text-2xl gold-text tracking-tight">A Voz do Tarot</h3>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleShare} 
                    className="p-2 text-slate-400 hover:text-tarot-gold transition-colors flex items-center gap-2 bg-white/5 rounded-lg border border-white/10"
                    title="Compartilhar"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-tarot-gold/50 via-tarot-gold/10 to-transparent rounded-full"></div>
                <div className="prose prose-invert prose-slate max-w-none pl-4">
                  <div className="text-slate-200 leading-relaxed text-lg font-light">
                    <Markdown>{interpretation}</Markdown>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

