
import React, { useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, collection, query, getDocs, where, limit } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Shield, Users, Settings as SettingsIcon, Search, Star } from 'lucide-react';
import { UserProfile, AppSettings } from '../hooks/useAppUser';

interface AdminPanelProps {
  settings: AppSettings | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ settings }) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  React.useEffect(() => {
    if (settings) {
      setWhatsappNumber(settings.whatsappNumber || '');
      setWhatsappMessage(settings.whatsappMessage || '');
    }
  }, [settings]);

  const toggleLimit = async () => {
    try {
      const settingsRef = doc(db, 'settings', 'global');
      const newValue = settings ? !settings.isReadingLimitEnabled : true;
      await setDoc(settingsRef, {
        isReadingLimitEnabled: newValue
      }, { merge: true });
      setMessage({ type: 'success', text: `Limite de tiragens ${newValue ? 'ativado' : 'desativado'}` });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/global');
    }
  };

  const saveWhatsappSettings = async () => {
    try {
      const settingsRef = doc(db, 'settings', 'global');
      await setDoc(settingsRef, {
        whatsappNumber: whatsappNumber.replace(/\D/g, ''),
        whatsappMessage: whatsappMessage
      }, { merge: true });
      setMessage({ type: 'success', text: 'Configurações do WhatsApp salvas com sucesso!' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/global');
    }
  };

  const searchUser = async () => {
    if (!searchEmail.trim()) return;
    setLoading(true);
    setFoundUser(null);
    setMessage(null);
    try {
      const q = query(collection(db, 'users'), where('email', '==', searchEmail.trim()), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setFoundUser(snap.docs[0].data() as UserProfile);
      } else {
        setMessage({ type: 'error', text: 'Usuário não encontrado' });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'users');
    } finally {
      setLoading(false);
    }
  };

  const togglePremium = async (user: UserProfile) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        isPremium: !user.isPremium
      }, { merge: true });
      setFoundUser({ ...user, isPremium: !user.isPremium });
      setMessage({ type: 'success', text: `Status Premium de ${user.displayName} atualizado` });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const toggleAdmin = async (user: UserProfile) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      await setDoc(userRef, {
        role: newRole
      }, { merge: true });
      setFoundUser({ ...user, role: newRole as any });
      setMessage({ type: 'success', text: `Papel de ${user.displayName} atualizado para ${newRole}` });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-tarot-gold/10 rounded-xl">
          <Shield className="w-6 h-6 text-tarot-gold" />
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold gold-text uppercase tracking-tight">Painel Administrativo</h2>
          <p className="text-slate-400 text-sm">Gerencie as regras de negócio e membros premium.</p>
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Global Settings */}
        <div className="glass-panel p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <SettingsIcon className="w-5 h-5 text-tarot-gold" />
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-sm">Configurações Globais</h3>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div>
              <p className="text-slate-200 font-medium">Limitar Tiragens</p>
              <p className="text-xs text-slate-400">1 tiragem/dia para não-premium</p>
            </div>
            <button
              onClick={toggleLimit}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings?.isReadingLimitEnabled ? 'bg-tarot-gold' : 'bg-slate-700'
              }`}
            >
              <motion.div
                animate={{ x: settings?.isReadingLimitEnabled ? 26 : 2 }}
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suporte WhatsApp</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Número (com DDD)</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="5511999999999"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-tarot-gold/50"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Mensagem Inicial</label>
                <textarea
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  placeholder="Olá, gostaria de tirar uma dúvida..."
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-tarot-gold/50 resize-none h-20"
                />
              </div>
              <button
                onClick={saveWhatsappSettings}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold rounded-lg border border-white/10 transition-colors"
              >
                Salvar WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="glass-panel p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Users className="w-5 h-5 text-tarot-gold" />
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-sm">Gerenciar Usuários</h3>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Email do usuário..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-tarot-gold/50 placeholder:text-slate-500"
              />
            </div>
            <button
              onClick={searchUser}
              disabled={loading}
              className="px-4 py-2 bg-tarot-gold text-slate-950 font-bold rounded-lg text-sm hover:bg-yellow-600 transition-colors disabled:opacity-50"
            >
              {loading ? '...' : 'Buscar'}
            </button>
          </div>

          {foundUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-200 font-bold">{foundUser.displayName}</p>
                  <p className="text-xs text-slate-400">{foundUser.email}</p>
                </div>
                {foundUser.isPremium && (
                  <span className="px-2 py-1 bg-tarot-gold/20 text-tarot-gold text-[10px] font-bold rounded uppercase">Premium</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => togglePremium(foundUser)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                    foundUser.isPremium 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                      : 'bg-tarot-gold/10 text-tarot-gold border border-tarot-gold/20 hover:bg-tarot-gold/20'
                  }`}
                >
                  <Star className={`w-3 h-3 ${foundUser.isPremium ? 'fill-current' : ''}`} />
                  {foundUser.isPremium ? 'Remover Premium' : 'Tornar Premium'}
                </button>
                <button
                  onClick={() => toggleAdmin(foundUser)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                    foundUser.role === 'admin'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  {foundUser.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
