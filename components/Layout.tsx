import React, { useState } from 'react';
import { Sun, Moon, LogOut, User as UserIcon, Menu, X, ShieldCheck, TrendingUp, FileSearch } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigateHome: () => void;
  onNavigateHistory: () => void;
  user: User | null;
  onLogin: () => void;
  onNavigateAdmin: () => void;
  onNavigateEvolution: () => void;
  onNavigateHowItWorks: () => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  theme,
  onToggleTheme,
  onNavigateHome,
  onNavigateHistory,
  user,
  onLogout,
  onLogin,
  onNavigateAdmin,
  onNavigateEvolution,
  onNavigateHowItWorks
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className="border-b border-white/[0.05] bg-[var(--bg-header)] backdrop-blur-md sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer group"
            onClick={onNavigateHome}
          >
            <img
              src={theme === 'light'
                ? 'https://i.ibb.co/qMqVKj7g/LOGO-AUTOPSIA-POSITIVO.png'
                : 'https://i.ibb.co/0ppJjgFX/LOGO-AUTOPSIA-NEGATIVO.png'
              }
              alt="Autópsia Literária Logo"
              className="h-12 md:h-14 w-auto object-contain transition-all duration-500 group-hover:scale-105"
            />
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <nav className="hidden md:flex gap-8 text-xs font-black uppercase tracking-widest">
              <button
                onClick={onNavigateHome}
                className="hover:text-violet transition-colors"
              >
                Início
              </button>
              <button
                onClick={onNavigateHowItWorks}
                className="hover:text-violet transition-colors"
              >
                Como Funciona
              </button>
              {user && (
                <button
                  onClick={onNavigateHistory}
                  className="hover:text-violet transition-colors"
                >
                  Histórico
                </button>
              )}
              {user?.isAdmin && (
                <button
                  onClick={onNavigateAdmin}
                  className="text-violet hover:text-violet/80 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck size={14} />
                  Painel Admin
                </button>
              )}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={onToggleTheme}
                className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-card)] hover:bg-[var(--card-hover)] transition-all group shadow-sm"
                title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="text-amber-400 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon size={18} className="text-slate-600 group-hover:-rotate-12 transition-transform" />
                )}
              </button>

              {user ? (
                <div
                  className="relative"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-xl bg-violet/10 border border-violet/20 hover:bg-violet/20 transition-all group"
                  >
                    <span className="text-xs font-bold text-violet hidden sm:inline-block max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-violet text-white flex items-center justify-center">
                      <UserIcon size={16} />
                    </div>
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-0"
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-56 glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-10">
                        <div className="px-4 py-3 border-b border-white/5 mb-2">
                          <p className="text-xs font-black text-violet uppercase tracking-widest mb-1">
                            {user.isPro ? 'Plano PRO' : 'Plano Free'}
                          </p>
                          <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                            {user.email}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            onNavigateHistory();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors flex items-center gap-3"
                        >
                          <Menu size={16} className="opacity-50" />
                          Minhas Análises
                        </button>
                        <button
                          onClick={() => {
                            onNavigateEvolution();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors flex items-center gap-3"
                        >
                          <TrendingUp size={16} className="text-violet opacity-70" />
                          Minha Evolução
                        </button>
                        <button
                          onClick={() => {
                            onNavigateHowItWorks();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors flex items-center gap-3 border-t border-white/5"
                        >
                          <FileSearch size={16} className="opacity-50" />
                          Como Funciona
                        </button>
                        {user.isAdmin && (
                          <button
                            onClick={() => {
                              onNavigateAdmin();
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-violet/10 text-violet transition-colors flex items-center gap-3 border-t border-white/5"
                          >
                            <ShieldCheck size={16} />
                            Painel Admin
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onLogout();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-3"
                        >
                          <LogOut size={16} />
                          Sair
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="px-5 py-2.5 bg-violet text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-violet/80 transition-all shadow-[0_5px_15px_rgba(139,92,246,0.3)]"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full overflow-x-hidden">
        {children}
      </main>

      <footer className="border-t border-white/[0.05] py-12 mt-auto bg-[var(--bg-footer)] no-print">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs opacity-50 uppercase tracking-widest font-medium">
            © 2026 Autópsia Literária 2.0
          </p>
        </div>
      </footer>
    </div>
  );
};
