import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Shield, Loader2, Lock, Mail } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      
      // Ensure the user has a profile document in Firestore
      const userRef = doc(db, 'users', userCred.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        try {
          await setDoc(userRef, {
            uid: userCred.user.uid,
            email: userCred.user.email,
            displayName: 'Master Admin',
            createdAt: Timestamp.now(),
            isPremium: true,
            role: 'admin' // Note: This might fail initially if Firestore rules prevent creating admins directly.
          });
        } catch (err) {
          console.warn("Could not create admin profile automatically due to security rules. Ensure this user is granted admin level in Firebase or Firestore Rules.");
        }
      }
      
      // Redirect to admin panel
      window.location.href = '/?tab=admin';
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Erro ao realizar login. Verifique se o provedor Email/Senha está ativo no painel do Firebase.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 sm:p-12 relative overflow-hidden text-center"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tarot-gold to-transparent opacity-50"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-tarot-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-center mb-6">
          <div className="p-3 bg-slate-900/50 rounded-full border border-white/5">
            <Shield className="w-8 h-8 text-tarot-gold" />
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold gold-text uppercase tracking-tight mb-2">
          Acesso Restrito
        </h2>
        <p className="text-slate-400 text-xs tracking-widest uppercase mb-8">
          Painel de Administração
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4 text-left">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail de Administrador"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-tarot-gold/50 transition-all"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha Master"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-tarot-gold/50 transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3 bg-tarot-gold hover:bg-yellow-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Autenticar'
            )}
          </button>
        </form>
      </motion.div>
      
      <div className="mt-8 text-center">
        <button onClick={() => window.location.href = '/'} className="text-[10px] text-slate-500 hover:text-tarot-gold transition-colors uppercase tracking-widest border-b border-transparent hover:border-tarot-gold/30 pb-0.5">
          &larr; Voltar para o Diário
        </button>
      </div>
    </div>
  );
};
