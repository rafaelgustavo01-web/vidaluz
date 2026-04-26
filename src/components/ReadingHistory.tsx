import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { History, Calendar, ChevronRight, Trash2, Star, Filter, Share2, Check } from 'lucide-react';
import { getCardImageUrl } from '../constants/cards';
import { UserProfile } from '../hooks/useAppUser';

interface Reading {
  id: string;
  timestamp: any;
  cards: any[];
  interpretation: string;
  question: string;
  type: string;
  isFavorite?: boolean;
}

interface ReadingHistoryProps {
  profile: UserProfile | null;
}

export const ReadingHistory: React.FC<ReadingHistoryProps> = ({ profile }) => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!selectedReading) return;
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}?view=reading&id=${selectedReading.id}`;
    const shareText = `Minha Tiragem de Tarot - VidaLuz\n\nPergunta: ${selectedReading.question || 'Tiragem Diária'}\n\nCartas:\n${selectedReading.cards.map(c => `- ${c.position}: ${c.name}${c.isReversed ? ' (Invertida)' : ''}`).join('\n')}\n\nInterpretação:\n${selectedReading.interpretation}\n\nVeja minha tiragem completa aqui: ${shareUrl}`;

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

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'readings'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reading[];
      setReadings(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'readings');
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile?.isPremium && profile?.role !== 'admin') return;
    try {
      await deleteDoc(doc(db, 'readings', id));
      if (selectedReading?.id === id) setSelectedReading(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `readings/${id}`);
    }
  };

  const toggleFavorite = async (reading: Reading, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const readingRef = doc(db, 'readings', reading.id);
      await updateDoc(readingRef, {
        isFavorite: !reading.isFavorite
      });
      if (selectedReading?.id === reading.id) {
        setSelectedReading({ ...selectedReading, isFavorite: !reading.isFavorite });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `readings/${reading.id}`);
    }
  };

  const filteredReadings = readings.filter(r => filter === 'all' || r.isFavorite);

  if (loading) return <div className="p-8 text-center text-slate-400">Carregando histórico...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-tarot-gold" />
          <h2 className="font-display text-xl sm:text-2xl font-bold gold-text uppercase tracking-tight">Histórico</h2>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/5 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
              filter === 'all' ? 'bg-tarot-gold text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Filter className="w-3 h-3" />
            Todas
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
              filter === 'favorites' ? 'bg-tarot-gold text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-3 h-3" />
            Favoritas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className={`md:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 ${selectedReading ? 'hidden md:block' : 'block'}`}>
          {filteredReadings.length === 0 ? (
            <div className="text-center py-12 px-4 glass-panel border-dashed">
              <p className="text-slate-500 text-sm italic">
                {filter === 'favorites' ? 'Nenhuma leitura favoritada ainda.' : 'Nenhuma tiragem encontrada.'}
              </p>
            </div>
          ) : (
            filteredReadings.map((reading) => (
              <div
                key={reading.id}
                onClick={() => setSelectedReading(reading)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedReading(reading);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`w-full text-left p-4 rounded-xl transition-all border group relative cursor-pointer ${
                  selectedReading?.id === reading.id
                    ? 'bg-tarot-gold/10 border-tarot-gold'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-tarot-gold font-bold">
                    {reading.type === 'daily' ? 'Diária' : 'Consulta'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => toggleFavorite(reading, e)} 
                      className={`transition-colors p-1 -m-1 ${reading.isFavorite ? 'text-tarot-gold' : 'text-slate-500 hover:text-tarot-gold'}`}
                      title={reading.isFavorite ? "Remover dos favoritos" : "Favoritar"}
                    >
                      <Star className={`w-3.5 h-3.5 ${reading.isFavorite ? 'fill-tarot-gold' : ''}`} />
                    </button>
                    {(profile?.isPremium || profile?.role === 'admin') && (
                      <button 
                        onClick={(e) => handleDelete(reading.id, e)} 
                        className="text-slate-500 hover:text-red-400 p-1 -m-1"
                        title="Excluir leitura"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-medium text-sm mb-1">
                  <Calendar className="w-3 h-3" />
                  {reading.timestamp?.toDate ? format(reading.timestamp.toDate(), 'dd MMM yyyy', { locale: ptBR }) : 'Recent'}
                </div>
                <p className="text-xs text-slate-400 truncate pr-4">{reading.question || 'Sem pergunta específica'}</p>
              </div>
            ))
          )}
        </div>

        <div className={`md:col-span-2 ${selectedReading ? 'block' : 'hidden md:block'}`}>
          <AnimatePresence mode="wait">
            {selectedReading ? (
              <motion.div
                key={selectedReading.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel p-6 sm:p-8 space-y-6 relative"
              >
                <div className="flex justify-between items-start">
                  <button 
                    onClick={() => setSelectedReading(null)}
                    className="md:hidden flex items-center gap-2 text-slate-400 hover:text-tarot-gold"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Voltar
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleShare}
                      className="p-2 rounded-full transition-all bg-white/5 text-slate-500 hover:text-tarot-gold"
                      title="Compartilhar Leitura"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                    </button>
                    <button 
                      onClick={(e) => toggleFavorite(selectedReading, e)}
                      className={`p-2 rounded-full transition-all ${selectedReading.isFavorite ? 'bg-tarot-gold/20 text-tarot-gold' : 'bg-white/5 text-slate-500 hover:text-tarot-gold'}`}
                      title={selectedReading.isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                    >
                      <Star className={`w-5 h-5 ${selectedReading.isFavorite ? 'fill-tarot-gold' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-tarot-gold font-display text-xl">{selectedReading.question || 'Tiragem Diária'}</h3>
                  <p className="text-xs text-slate-400">
                    Realizada em {format(selectedReading.timestamp.toDate(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 py-4 border-y border-white/5">
                  {selectedReading.cards.map((card, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                        {card.position}
                      </span>
                      <div className={`w-[141px] h-[229px] sm:w-[176px] sm:h-[282px] rounded-xl border border-tarot-gold/30 bg-slate-950 flex items-center justify-center overflow-hidden relative shadow-xl ${card.isReversed ? 'rotate-180' : ''}`}>
                        <img 
                          src={getCardImageUrl(card.name)} 
                          alt={card.name} 
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain p-1.5 transition-transform hover:scale-110 duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-tarot-gold uppercase tracking-tight max-w-[128px]">
                          {card.name}
                        </p>
                        {card.isReversed && (
                          <span className="text-[9px] text-slate-500 uppercase block">Invertida</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm">
                    {selectedReading.interpretation}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic glass-panel p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <History className="w-8 h-8 text-slate-500" />
                  </div>
                  <p>Selecione uma tiragem para ver os detalhes.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
