import React from 'react';
import { AnalysisResult, User } from '../types';
import { Lock, Zap, ShieldAlert } from 'lucide-react';

interface HistoryListProps {
  history: AnalysisResult[];
  user: User | null;
  onSelect: (result: AnalysisResult) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onUpgrade: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, user, onSelect, onDelete, onBack, onUpgrade }) => {
  const isPro = user?.isPro || user?.isAdmin;

  // Filter history: Free users see only paid (avulsas) analyses
  // Pro users see everything
  const visibleHistory = isPro
    ? history
    : history.filter(item => item.isPaid);

  const hasHiddenAnalyses = !isPro && history.some(item => !item.isPaid);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto w-full px-4 md:px-0 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] font-title uppercase tracking-tight leading-tight">Histórico de Autópsias</h2>
          <p className="text-[var(--text-secondary)] mt-1 opacity-70">Recupere suas análises e acompanhe sua evolução.</p>
        </div>
        <button
          onClick={onBack}
          className="whitespace-nowrap px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[var(--text-secondary)] hover:text-violet hover:border-violet transition-all font-bold text-xs uppercase tracking-widest"
        >
          Voltar ao Início
        </button>
      </div>

      <div className="space-y-6 relative">
        {visibleHistory.length === 0 && !hasHiddenAnalyses ? (
          <div className="glass rounded-[2.5rem] p-16 text-center border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
              <ShieldAlert size={32} />
            </div>
            <p className="text-[var(--text-secondary)] font-medium">Nenhuma análise salva no histórico ainda.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {visibleHistory.map((item) => (
              <div
                key={item.id}
                className="glass border border-white/10 rounded-2xl p-6 hover:border-violet/50 transition-all group flex items-center justify-between"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelect(item)}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-xl text-[var(--text-primary)] group-hover:text-violet transition-colors">{item.overview.title}</h3>
                    {item.isPaid && (
                      <span className="text-[8px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-500 border border-amber-400/20 font-black uppercase tracking-widest">
                        Avulsa
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] opacity-60 font-medium">
                    <span>{new Date(item.timestamp).toLocaleDateString('pt-BR')} • {new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse"></span>
                      Nota {item.score}/10
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onSelect(item)}
                    className="px-5 py-2.5 rounded-xl bg-violet/10 text-violet hover:bg-violet hover:text-white transition-all text-xs font-black uppercase tracking-widest"
                  >
                    Abrir Relatório
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2.5 rounded-xl bg-red-500/5 text-red-500/40 hover:bg-red-500/20 hover:text-red-500 transition-all"
                    title="Excluir do histórico"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRO Lock for hidden analyses */}
        {hasHiddenAnalyses && (
          <div className="mt-12 glass p-10 rounded-[2.5rem] border-violet/20 bg-violet/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 translate-x-4 -translate-y-4 transition-transform group-hover:rotate-0">
              <Zap size={120} fill="currentColor" className="text-violet" />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-20 h-20 bg-violet/20 rounded-3xl flex items-center justify-center text-violet shadow-inner border border-violet/20">
                <Lock size={32} />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold mb-2">Análises Bloqueadas</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed max-w-lg">
                  Você possui análises recentes que não estão visíveis no seu histórico gratuito. Assine o plano PRO para desbloquear o histórico completo e exportações ilimitadas.
                </p>
              </div>
              <button
                onClick={onUpgrade}
                className="w-full md:w-auto px-8 py-4 bg-violet text-white rounded-2xl font-bold text-lg shadow-[0_10px_25px_rgba(139,92,246,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Zap size={20} fill="currentColor" />
                Desbloquear Tudo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
