import React from 'react';
import { signInWithGoogle } from '../lib/firebase';
import { motion } from 'motion/react';
import { Logo } from './Logo';

export const Auth: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-panel p-10 sm:p-12 space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tarot-purple via-tarot-gold to-tarot-blue"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-2">
            <Logo className="w-48 h-48" />
          </div>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Conecte-se com a sabedoria ancestral do Tarot de Waite. 
            Receba orientações diárias e explore sua intuição.
          </p>
          
          <button
            onClick={signInWithGoogle}
            className="w-full py-4 px-6 bg-tarot-gold hover:bg-yellow-600 text-slate-950 font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-tarot-gold/20"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" referrerPolicy="no-referrer" />
            Entrar com Google
          </button>
        </div>
        
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-tarot-purple/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-tarot-blue/20 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
};
