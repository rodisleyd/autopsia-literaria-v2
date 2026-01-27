import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { FileUpload } from './components/FileUpload';
import { ReportView } from './components/ReportView/ReportView';
import { HistoryList } from './components/HistoryList';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthorEvolution } from './components/AuthorEvolution';
import { PricingModal } from './components/PricingModal';
import { HowItWorks } from './components/HowItWorks';
import { analyzeLiteraryText } from './services/geminiService';
import { authService } from './services/authService';
import { AnalysisResult, AppStatus, User } from './types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './services/firebase';
import { collection, query, where, getDocs, orderBy, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';


const THEME_KEY = 'autopsia_literaria_theme';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.LANDING);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [proOnlyMode, setProOnlyMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analysisType, setAnalysisType] = useState<'novel' | 'tv_pilot'>('novel');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'light';
  });

  // Theme effect
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        if (status === AppStatus.LANDING || status === AppStatus.LOGIN) {
          setStatus(AppStatus.IDLE);
        }
      } else {
        setUser(null);
        setStatus(AppStatus.LANDING);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Check for Stripe Redirect Status
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('status') === 'success') {
      alert('Pagamento confirmado com sucesso! 🚀\nSua conta foi atualizada.');
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    else if (query.get('status') === 'cancel') {
      alert('Pagamento cancelado. Se tiver dúvidas, entre em contato.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Load history from Firestore when user changes
  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, 'analyses'),
            where('userId', '==', user.id)
          );
          const querySnapshot = await getDocs(q);
          const results: AnalysisResult[] = [];
          querySnapshot.forEach((doc) => {
            results.push(doc.data() as AnalysisResult);
          });
          // Sort manually to avoid composite index requirement in Firestore
          results.sort((a, b) => b.timestamp - a.timestamp);
          setHistory(results);
        } catch (e) {
          console.error("Failed to load history from Firestore", e);
        }
      } else {
        setHistory([]);
      }
    };
    loadHistory();
  }, [user]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleStartAnalysis = () => {
    if (user) {
      setStatus(AppStatus.IDLE);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleTextUpload = async (text: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setStatus(AppStatus.ANALYZING);
    setErrorDetails(null);
    try {
      const result = await analyzeLiteraryText(text, analysisType);

      const finalResult: AnalysisResult = {
        ...result,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        userId: user?.id || '',
        isPaid: !!(user?.isPro || user?.isAdmin)
      };

      // Save to Firestore if user is logged in
      if (user) {
        await addDoc(collection(db, 'analyses'), finalResult);
      }

      setAnalysisResult(finalResult);
      setHistory(prev => [finalResult, ...prev]);

      setStatus(AppStatus.COMPLETED);
    } catch (error: any) {
      console.error("Analysis failed:", error);
      setErrorDetails(error.message || "Erro desconhecido");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setErrorDetails(null);
    setStatus(user ? AppStatus.IDLE : AppStatus.LANDING);
  };

  const handleSelectFromHistory = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setStatus(AppStatus.COMPLETED);
  };

  const navigateToAdmin = () => {
    if (user?.isAdmin) {
      setStatus(AppStatus.ADMIN);
    }
  };

  const handleDeleteFromHistory = async (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));

    if (user) {
      try {
        // Find the firestore document with this analysis ID
        const q = query(
          collection(db, 'analyses'),
          where('id', '==', id),
          where('userId', '==', user.id)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          await deleteDoc(doc(db, 'analyses', document.id));
        });
      } catch (e) {
        console.error("Failed to delete from Firestore", e);
      }
    }
  };


  const navigateToHistory = () => {
    if (user) {
      setStatus(AppStatus.HISTORY);
    } else {
      setShowAuthModal(true);
    }
  };

  const navigateToEvolution = () => {
    if (user) {
      setStatus(AppStatus.EVOLUTION);
    } else {
      setShowAuthModal(true);
    }
  };

  const navigateToHowItWorks = () => {
    setStatus(AppStatus.HOW_IT_WORKS);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setStatus(AppStatus.LANDING);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout
      theme={theme}
      onToggleTheme={toggleTheme}
      onNavigateHome={handleReset}
      onNavigateHistory={navigateToHistory}
      user={user}
      onLogout={handleLogout}
      onLogin={() => setShowAuthModal(true)}
      onNavigateAdmin={navigateToAdmin}
      onNavigateEvolution={navigateToEvolution}
      onNavigateHowItWorks={navigateToHowItWorks}
    >
      {status === AppStatus.ADMIN && user?.isAdmin ? (
        <AdminDashboard
          onSelectAnalysis={handleSelectFromHistory}
          onBack={handleReset}
        />
      ) : status === AppStatus.EVOLUTION ? (
        <AuthorEvolution
          history={history}
          user={user}
          onBack={handleReset}
          onUpgrade={(proOnly) => {
            setProOnlyMode(!!proOnly);
            setShowPricingModal(true);
          }}
        />
      ) : status === AppStatus.HOW_IT_WORKS ? (
        <HowItWorks
          onBack={handleReset}
          onStart={handleStartAnalysis}
        />
      ) : status === AppStatus.LANDING ? (
        <LandingPage
          onStart={handleStartAnalysis}
          onLogin={() => setShowAuthModal(true)}
        />
      ) : status === AppStatus.IDLE || status === AppStatus.ANALYZING ? (
        <div className="flex flex-col items-center py-12 md:py-24 max-w-4xl mx-auto px-4">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-1000">
            <span className="inline-block px-4 py-1 rounded-full bg-violet/5 text-violet/60 text-[10px] font-black uppercase tracking-[0.4em] mb-10 border border-violet/10 font-sans">
              Inteligência Artificial para Escritores
            </span>
            <h2 className="text-4xl md:text-6xl font-semibold mb-10 font-title leading-tight tracking-normal uppercase text-[var(--text-primary)]">
              Eleve sua prosa à <br />
              <span className="text-violet opacity-80">Imortalidade</span>
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-70 font-body">
              Submeta seus escritos a uma análise profunda e cirúrgica. Receba feedback detalhado sobre estrutura, personagens e estilo, como se fosse editado por um mestre.
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <FileUpload
              onUpload={handleTextUpload}
              isLoading={status === AppStatus.ANALYZING}
              analysisType={analysisType}
              onAnalysisTypeChange={setAnalysisType}
            />
          </div>
        </div>
      ) : status === AppStatus.COMPLETED && analysisResult ? (
        <ReportView
          data={analysisResult}
          onReset={handleReset}
          user={user}
          onShowPricing={() => {
            setProOnlyMode(false);
            setShowPricingModal(true);
          }}
        />
      ) : status === AppStatus.HISTORY ? (
        <HistoryList
          history={history}
          user={user}
          onSelect={handleSelectFromHistory}
          onDelete={handleDeleteFromHistory}
          onBack={handleReset}
          onUpgrade={(proOnly) => {
            setProOnlyMode(!!proOnly);
            setShowPricingModal(true);
          }}
        />
      ) : status === AppStatus.ERROR ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-red-500/10 p-8 rounded-2xl border border-red-500/20 max-w-md">
            <h3 className="text-xl font-bold text-red-400 mb-2">Erro na Autópsia</h3>
            <p className="opacity-70 mb-4">
              Não conseguimos processar o seu texto. Isso pode ocorrer por limite de quota, erro na chave API ou conteúdo bloqueado.
            </p>
            {errorDetails && (
              <div className="bg-black/20 p-3 rounded-lg text-xs font-mono text-red-300 text-left mb-6 overflow-auto max-h-32">
                {errorDetails}
              </div>
            )}
            <button
              onClick={handleReset}
              className="w-full py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-white hover:bg-red-500/30 transition-all font-bold"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      ) : null}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(u) => {
            setUser(u);
            setShowAuthModal(false);
            if (status === AppStatus.LANDING) {
              setStatus(AppStatus.IDLE);
            }
          }}
        />
      )}

      {showPricingModal && (
        <PricingModal
          proOnly={proOnlyMode}
          onClose={() => {
            setShowPricingModal(false);
            setProOnlyMode(false);
          }}
          onSelectPlan={async (plan) => {
            // Simulated payment
            if (user) {
              const isMensal = plan === 'mensal';

              // Only Monthly stays "isPro" forever in this simplified simulation
              // Unitary marks the current analysis as paid
              if (isMensal) {
                await authService.updateUserPermissions(user.id, { isPro: true, plan });
                setUser({ ...user, isPro: true, plan });
              } else {
                // If unitary, mark CURRENT analysis as paid in Firestore
                if (analysisResult) {
                  const updatedResult = { ...analysisResult, isPaid: true };
                  setAnalysisResult(updatedResult);

                  // Update in history too
                  setHistory(prev => prev.map(a => a.id === updatedResult.id ? updatedResult : a));

                  // Persist to Firestore: find the doc and update
                  try {
                    const q = query(
                      collection(db, 'analyses'),
                      where('id', '==', analysisResult.id),
                      where('userId', '==', user.id)
                    );
                    const snap = await getDocs(q);
                    snap.forEach(async (d) => {
                      await updateDoc(doc(db, 'analyses', d.id), { isPaid: true });
                    });
                  } catch (e) { console.error(e); }
                }

                // For 'unitario', we DO NOT set isPro: true globally.
                // The access is controlled by 'analysisResult.isPaid'.
                // We just insure the user object remains correct.
                setUser({ ...user });
              }
            } else {
            }
            setShowPricingModal(false);
            setProOnlyMode(false);
          }}
        />
      )}
    </Layout>
  );
};

export default App;
