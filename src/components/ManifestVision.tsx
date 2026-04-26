import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader2, Share2, Download, Check } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { db, auth } from '../lib/firebase';
import { collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../hooks/useAppUser';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const ASPECT_RATIOS = ["1:1", "3:4", "4:3", "9:16", "16:9", "2:3", "3:2", "1:4", "1:8", "4:1", "8:1"];

interface ManifestVisionProps {
  profile: UserProfile | null;
}

export const ManifestVision: React.FC<ManifestVisionProps> = ({ profile }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastVisionId, setLastVisionId] = useState<string | null>(null);

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'visao_manifestada.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareImage = async () => {
    if (!imageUrl) return;
    
    try {
      const baseUrl = window.location.origin;
      const shareUrl = lastVisionId ? `${baseUrl}?view=vision&id=${lastVisionId}` : window.location.href;
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'visao_manifestada.png', { type: blob.type });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Minha Visão Manifestada - VidaLuz',
          text: `Manifestei esta visão mística usando o Tarot:\n"${prompt}"\n\nVeja minha carta materializada aqui: ${shareUrl}`,
          files: [file]
        });
      } else {
        // Fallback or if they just want to copy link
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Erro ao compartilhar imagem:', err);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    // Check limit
    if (profile && profile.role !== 'admin' && profile.lastVisionDate) {
      const lastVisionTime = profile.lastVisionDate.toDate ? profile.lastVisionDate.toDate() : new Date(profile.lastVisionDate);
      const isToday = new Date().toDateString() === lastVisionTime.toDateString();
      if (isToday) {
        setError("Limite atingido. Apenas uma Visão Materializada pode ser gerada por dia. Retorne amanhã.");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              text: `Estilo místico de Tarot, arcano esotérico. ${prompt}`,
            },
          ],
        },
        config: {
          // @ts-ignore - Adding imageConfig as supported by gemini-3.1-flash-image-preview
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: "1K"
          }
        },
      });

      let foundImage = null;
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            foundImage = `data:${part.inlineData.mimeType || 'image/png'};base64,${base64EncodeString}`;
            break;
          }
        }
      }

      if (foundImage) {
        setImageUrl(foundImage);
        // Save to Firestore
        if (auth.currentUser) {
          try {
            const docRef = await addDoc(collection(db, 'visions'), {
              userId: auth.currentUser.uid,
              prompt: prompt,
              imageUrl: foundImage,
              createdAt: Timestamp.now()
            });
            setLastVisionId(docRef.id);
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
              lastVisionDate: Timestamp.now()
            });
          } catch (saveErr) {
            console.error("Failed to save vision:", saveErr);
          }
        }
      } else {
        setError("Não foi possível gerar a imagem. Tente alterar a descrição.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('not found')) {
        // Handle race condition reset
        if (window.aistudio) {
          await window.aistudio.openSelectKey();
        }
      } else {
        setError("Ocorreu um erro ao manifestar a visão. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full glass-panel p-8 sm:p-12 space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-tarot-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl font-bold gold-text uppercase tracking-tight">Manifestar Visão</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Descreva uma energia, um momento ou um sentimento que deseja transformar numa imagem com estética de carta de Tarot mística.
          </p>
        </div>

        <div className="space-y-6 max-w-xl mx-auto relative z-10">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest text-center">Sua Visão</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Exaustão sob a luz do luar num campo de lavandas..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-tarot-gold/50 min-h-[100px] resize-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest text-center">Formato da Imagem</label>
              <div className="flex flex-wrap justify-center gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      aspectRatio === ratio
                        ? 'bg-tarot-gold text-slate-950 shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className="w-full py-4 bg-tarot-gold hover:bg-yellow-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sintonizando Visão...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Criar Carta de Manifestação
              </>
            )}
          </button>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-400 text-sm mt-4 p-4 bg-red-500/10 rounded-xl">
            {error}
          </motion.div>
        )}

        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col items-center gap-4 pb-8"
          >
            <div className="relative rounded-xl overflow-hidden border-2 border-tarot-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.2)] p-2 bg-slate-950">
              <img src={imageUrl} alt="Manifested Vision" className="rounded-lg object-contain" style={{ maxHeight: '600px', maxWidth: '100%' }} />
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleShareImage}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium transition-colors border border-white/10"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                Compartilhar
              </button>
              <button
                onClick={handleDownloadImage}
                className="flex items-center gap-2 px-6 py-3 bg-tarot-gold/10 hover:bg-tarot-gold/20 text-tarot-gold rounded-full font-medium transition-colors border border-tarot-gold/30"
              >
                <Download className="w-4 h-4" />
                Baixar
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
