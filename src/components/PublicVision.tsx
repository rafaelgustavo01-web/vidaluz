import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PublicVisionProps {
  id: string;
}

export const PublicVision: React.FC<PublicVisionProps> = ({ id }) => {
  const [vision, setVision] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVision = async () => {
      try {
        const docRef = doc(db, 'visions', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVision(docSnap.data());
        } else {
          setError("Visão não encontrada.");
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar a visão.");
      } finally {
        setLoading(false);
      }
    };
    fetchVision();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Sparkles className="w-8 h-8 text-tarot-gold animate-pulse" />
        <p className="text-slate-400 animate-pulse uppercase tracking-[0.2em] text-[10px]">Materializando Visão...</p>
      </div>
    );
  }

  if (error || !vision) {
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
        className="glass-panel p-8 sm:p-12 space-y-8 relative overflow-hidden flex flex-col items-center"
      >
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-tarot-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl font-bold gold-text uppercase tracking-tight">Visão Manifestada</h2>
          <div className="flex justify-center gap-4 text-xs text-slate-400 uppercase tracking-widest font-bold">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-tarot-gold" />
              {vision.createdAt?.toDate ? format(vision.createdAt.toDate(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Recent'}
            </div>
          </div>
        </div>

        <div className="relative group max-w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-tarot-gold/50 to-purple-500/50 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative rounded-xl overflow-hidden border-2 border-tarot-gold/50 shadow-2xl p-2 bg-slate-950">
            <img 
              src={vision.imageUrl} 
              alt="Public Manifested Vision" 
              className="rounded-lg object-contain mx-auto" 
              style={{ maxHeight: '70vh', maxWidth: '100%' }} 
            />
          </div>
        </div>

        <div className="max-w-xl w-full space-y-4 text-center">
          <div className="flex items-center gap-2 justify-center text-tarot-gold">
            <Info className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">O Prompt da Manifestação</span>
          </div>
          <p className="text-slate-300 italic text-lg leading-relaxed">
            "{vision.prompt}"
          </p>
        </div>
      </motion.div>
    </div>
  );
};
