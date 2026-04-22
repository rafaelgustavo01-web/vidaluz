import { useState, useEffect } from 'react';
import { auth, logout } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Auth } from './components/Auth';
import { DailyReading } from './components/DailyReading';
import { PublicReading } from './components/PublicReading';
import { PublicVision } from './components/PublicVision';
import { ReadingHistory } from './components/ReadingHistory';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { ManifestVision } from './components/ManifestVision';
import { WhatsAppButton } from './components/WhatsAppButton';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, History, Sparkles, LogOut, Shield, ImagePlus, Lock, Bell, BellRing } from 'lucide-react';
import { useAppUser } from './hooks/useAppUser';
import { usePushNotifications } from './hooks/usePushNotifications';
import { PremiumModal } from './components/PremiumModal';

import { Logo } from './components/Logo';

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reading' | 'history' | 'admin' | 'manifest'>('reading');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [publicView, setPublicView] = useState<{ type: 'reading' | 'vision', id: string } | null>(null);
  const [isAdminLoginRoute, setIsAdminLoginRoute] = useState(false);
  
  const { permission, requestPermission } = usePushNotifications();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const id = params.get('id');
    const tab = params.get('tab');
    
    if (id && (view === 'reading' || view === 'vision')) {
      setPublicView({ type: view as any, id });
    }
    
    if (tab === 'admin') {
      setActiveTab('admin');
      window.history.replaceState({}, '', '/');
    }

    if (window.location.pathname === '/admin') {
      setIsAdminLoginRoute(true);
    }
  }, []);

  const { profile, settings, loading: profileLoading, isAdmin } = useAppUser(firebaseUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading || (firebaseUser && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Moon className="w-12 h-12 text-tarot-gold" />
        </motion.div>
      </div>
    );
  }

  if (isAdminLoginRoute && !firebaseUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="glass-panel p-4 sticky top-0 z-50 border-x-0 border-t-0">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => (window.location.href = '/')}>
              <div className="w-10 h-10">
                <Logo hideText className="w-full h-full" />
              </div>
              <h1 className="font-display text-xl font-bold gold-text uppercase tracking-tighter">
                Diário VIDALUZ
              </h1>
            </div>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center p-4">
          <AdminLogin />
        </main>
      </div>
    );
  }

  if (publicView) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="glass-panel p-4 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => (window.location.href = '/')}>
              <div className="w-12 h-12">
                <Logo hideText className="w-full h-full" />
              </div>
              <h1 className="font-display text-2xl font-bold gold-text uppercase tracking-tighter">
                Diário VIDALUZ
              </h1>
            </div>
            {!firebaseUser && (
              <button 
                onClick={() => (window.location.href = '/')}
                className="px-4 py-2 bg-tarot-gold/10 text-tarot-gold border border-tarot-gold/50 rounded-full text-xs font-bold uppercase tracking-widest"
              >
                Entrar / Iniciar
              </button>
            )}
          </div>
        </header>
        <main className="flex-grow">
          {publicView.type === 'reading' ? (
            <PublicReading id={publicView.id} />
          ) : (
            <PublicVision id={publicView.id} />
          )}
        </main>
        <footer className="p-8 text-center border-t border-white/5">
          <button 
            onClick={() => (window.location.href = '/')}
            className="text-xs text-tarot-gold hover:underline"
          >
            Faça sua própria leitura e manifeste sua visão no Diário VidaLuz
          </button>
        </footer>
      </div>
    );
  }

  if (!firebaseUser) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-panel rounded-none border-x-0 border-t-0 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12">
              <Logo hideText className="w-full h-full" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold gold-text uppercase tracking-tighter hidden xs:block">
              Diário VIDALUZ
            </h1>
          </div>

          <nav className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-full border border-white/10 shadow-inner">
            <button
              onClick={() => setActiveTab('reading')}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors z-10 ${
                activeTab === 'reading' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'reading' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-tarot-gold rounded-full -z-10 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Sparkles className={`w-3 h-3 sm:w-4 sm:h-4 ${activeTab === 'reading' ? 'animate-pulse' : ''}`} />
              <span className="hidden xs:inline">Tiragem</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors z-10 ${
                activeTab === 'history' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'history' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-tarot-gold rounded-full -z-10 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <History className={`w-3 h-3 sm:w-4 sm:h-4 ${activeTab === 'history' ? 'animate-pulse' : ''}`} />
              <span className="hidden xs:inline">Histórico</span>
            </button>
            <button
              onClick={() => {
                if (!profile?.isPremium && !isAdmin) {
                  setIsPremiumModalOpen(true);
                } else {
                  setActiveTab('manifest');
                }
              }}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors z-10 ${
                activeTab === 'manifest' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'manifest' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-tarot-gold rounded-full -z-10 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <ImagePlus className={`w-3 h-3 sm:w-4 sm:h-4 ${activeTab === 'manifest' ? 'animate-pulse' : ''}`} />
              <span className="hidden xs:inline flex items-center gap-1">
                Visão {(!profile?.isPremium && !isAdmin) && <Lock className="w-3 h-3 inline pb-0.5 opacity-50" />}
              </span>
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors z-10 ${
                  activeTab === 'admin' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {activeTab === 'admin' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-tarot-gold rounded-full -z-10 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Shield className={`w-3 h-3 sm:w-4 sm:h-4 ${activeTab === 'admin' ? 'animate-pulse' : ''}`} />
                <span className="hidden xs:inline">Admin</span>
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Notificações Push */}
            {permission !== 'granted' && permission !== 'denied' && (
              <button
                onClick={requestPermission}
                className="p-2 text-slate-400 hover:text-tarot-gold hover:bg-tarot-gold/10 rounded-lg transition-colors relative group"
                title="Ativar Notificações"
              >
                <div className="absolute top-1 right-1 w-2 h-2 bg-tarot-gold rounded-full animate-ping"></div>
                <div className="absolute top-1 right-1 w-2 h-2 bg-tarot-gold rounded-full"></div>
                <Bell className="w-5 h-5" />
                <span className="hidden group-hover:block absolute top-full mt-2 right-0 bg-slate-800 text-[10px] text-white px-2 py-1 rounded whitespace-nowrap shadow-xl">
                  Ativar Notificações
                </span>
              </button>
            )}
            
            {permission === 'granted' && (
              <div className="p-2 text-tarot-gold/50 rounded-lg" title="Notificações Ativas">
                <BellRing className="w-5 h-5" />
              </div>
            )}

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`p-2 transition-colors rounded-lg ${
                  activeTab === 'admin' 
                    ? 'text-tarot-gold bg-tarot-gold/10' 
                    : 'text-slate-400 hover:text-tarot-gold hover:bg-white/5'
                }`}
                title="Painel Administrativo"
              >
                <Shield className="w-5 h-5" />
              </button>
            )}
            
            <div className="hidden md:flex flex-col items-end leading-tight">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                {profile?.isPremium ? 'Membro Premium' : 'Consulente'}
              </span>
              <span className="text-xs text-slate-200 font-medium">
                {firebaseUser.displayName?.split(' ')[0]}
              </span>
            </div>

            <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'reading' ? -20 : 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: activeTab === 'reading' ? 20 : -20, scale: 0.98 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {activeTab === 'reading' ? (
              <DailyReading profile={profile} settings={settings} />
            ) : activeTab === 'history' ? (
              <ReadingHistory />
            ) : activeTab === 'manifest' && (profile?.isPremium || isAdmin) ? (
              <ManifestVision />
            ) : activeTab === 'admin' && isAdmin ? (
              <AdminPanel settings={settings} />
            ) : (
              <DailyReading profile={profile} settings={settings} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center border-t border-white/5">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">
          Baseado no Tarot de Waite
        </p>
      </footer>
      <WhatsAppButton 
        number={settings?.whatsappNumber} 
        message={settings?.whatsappMessage} 
      />
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        whatsappNumber={settings?.whatsappNumber || undefined} 
      />
    </div>
  );
}

