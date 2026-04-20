import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Sparkles, Calendar, User } from 'lucide-react';
import Markdown from 'react-markdown';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getCardImageUrl } from '../constants/cards';

interface PublicReadingProps {
  id: string;
}

export const PublicReading: React.FC<PublicReadingProps> = ({ id }) => {
  const [reading, setReading] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReading = async () => {
      try {
        const docRef = doc(db, 'readings', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReading(docSnap.data());
        } else {
          setError("Leitura não encontrada.");
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar a leitura.");
      } finally {
        setLoading(false);
      }
    };
    fetchReading();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Sparkles className="w-8 h-8 text-tarot-gold animate-pulse" />
        <p className="text-slate-400 animate-pulse uppercase tracking-[0.2em] text-[10px]">Carregando Tiragem...</p>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
        <p className="text-red-400 font-medium">{error}</p>
        <button onClick={() => window.location.href = '/'} className="text-tarot-gold underline decoration-tarot-gold/30">Voltar para o Início</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-12 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 sm:p-12 space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-tarot-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl font-bold gold-text uppercase tracking-tight">Leitura de Tarot</h2>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400 uppercase tracking-widest font-bold">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-tarot-gold" />
              {reading.timestamp?.toDate ? format(reading.timestamp.toDate(), "dd 'de' MMMM", { locale: ptBR }) : 'Recent'}
            </div>
            {reading.question && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-tarot-gold" />
                Pergunta Realizada
              </div>
            )}
          </div>
        </div>

        {reading.question && (
          <div className="max-w-xl mx-auto text-center px-4">
            <p className="text-slate-200 italic font-medium leading-relaxed">
              "{reading.question}"
            </p>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-8 py-8 border-y border-white/5">
          {reading.cards.map((card: any, idx: number) => (
            <div key={idx} className="flex flex-col items-center gap-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                {card.position}
              </span>
              <div className={`w-32 h-52 sm:w-44 sm:h-72 rounded-xl border-2 border-tarot-gold/30 bg-slate-950 flex items-center justify-center overflow-hidden relative shadow-[0_0_30px_rgba(212,175,55,0.1)] ${card.isReversed ? 'rotate-180' : ''}`}>
                <img 
                  src={getCardImageUrl(card.name)} 
                  alt={card.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-[10px] font-bold text-white text-center uppercase tracking-tighter">
                    {card.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto space-y-6 pt-4">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="h-px flex-grow bg-white/5"></div>
            <h3 className="text-tarot-gold font-display text-lg uppercase tracking-widest font-bold">A Interpretação</h3>
            <div className="h-px flex-grow bg-white/5"></div>
          </div>
          <div className="prose prose-invert prose-slate max-w-none">
            <div className="text-slate-200 leading-relaxed text-lg font-light text-center sm:text-left">
              <Markdown>{reading.interpretation}</Markdown>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
