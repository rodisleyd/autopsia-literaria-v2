import React, { useState } from 'react';
import {
    Dna,
    Map,
    Users,
    MessageSquare,
    PenTool,
    Download,
    FileText,
    ChevronRight,
    Sparkles,
    Target
} from 'lucide-react';
import { AnalysisResult, User } from '../../types';
import { CharacterCard } from './CharacterCard';
import { NarrativeChart } from './NarrativeChart';
import { PrintReport } from './PrintReport';

interface ReportViewProps {
    data: AnalysisResult;
    onReset: () => void;
    user: User | null;
    onShowPricing: () => void;
}

const TABS = [
    { id: 'identity', label: 'Identidade', icon: Dna },
    { id: 'narrative', label: 'Narrativa', icon: Map },
    { id: 'characters', label: 'Personagens', icon: Users },
    { id: 'language', label: 'Linguagem', icon: MessageSquare },
    { id: 'prescription', label: 'Prescrição', icon: PenTool },
];

export const ReportView: React.FC<ReportViewProps> = ({ data, onReset, user, onShowPricing }) => {
    const [activeTab, setActiveTab] = useState('identity');


    const handleDownloadPDF = () => {
        if (user?.isPro) {
            window.print();
        } else {
            onShowPricing();
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 pb-20 animate-fade-in relative">
            <div className="no-print">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 pt-8">
                    <div>
                        <div className="flex items-center gap-2 text-violet font-bold mb-2 uppercase tracking-widest text-xs">
                            <Sparkles size={14} />
                            Autópsia Literária 2.0
                        </div>
                        <h1 className="text-4xl md:text-5xl font-title font-bold text-[var(--text-primary)]">
                            {data.overview.title}
                        </h1>
                        <p className="text-[var(--text-secondary)] mt-2 italic">
                            Análise concluída em {new Date(data.timestamp).toLocaleDateString('pt-BR')}
                        </p>
                    </div>

                    <div className="flex gap-3 no-print">
                        <button onClick={handleDownloadPDF} className="btn-primary flex items-center gap-2">
                            <Download size={18} />
                            Baixar PDF
                        </button>
                    </div>
                </header>

                {/* Global Score Card */}
                <section className="glass-card mb-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="opacity-10" />
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                                strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * data.score) / 10}
                                className="text-violet transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-bold text-[var(--text-primary)]">{data.score}</span>
                            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Nota Global</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
                            Justificativa do Diagnóstico
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-teal font-bold text-sm uppercase tracking-wider mb-2">Pontos Fortes</h4>
                                <ul className="space-y-2">
                                    {data.scoreJustification.strengths.map((s, i) => (
                                        <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                                            <ChevronRight size={14} className="mt-1 text-teal flex-shrink-0" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-violet font-bold text-sm uppercase tracking-wider mb-2">Oportunidades</h4>
                                <ul className="space-y-2">
                                    {data.scoreJustification.weaknesses.map((w, i) => (
                                        <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                                            <ChevronRight size={14} className="mt-1 text-violet flex-shrink-0" />
                                            {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navigation Tabs */}
                <nav className="flex flex-wrap gap-2 mb-8 no-print sticky top-[5.5rem] z-40 py-2 px-2">
                    <div className="flex flex-wrap gap-2 bg-[var(--card-bg)] border border-[var(--border-card)] backdrop-blur-md rounded-2xl p-1.5 shadow-lg w-full md:w-auto">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isActive
                                        ? 'bg-violet text-white shadow-lg shadow-violet/20'
                                        : 'text-[var(--text-secondary)] hover:bg-violet/10 hover:text-violet'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Content Area */}
                <main className="min-h-[400px]">
                    {activeTab === 'identity' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="glass-card">
                                <h3 className="text-2xl font-title font-bold text-[var(--text-primary)] mb-6">Visão Geral da Obra</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black text-violet uppercase tracking-[0.2em] mb-2 block">Premissa Central</label>
                                            <p className="text-lg text-[var(--text-primary)] leading-relaxed font-body italic">"{data.overview?.premise || 'Não identificada'}"</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-violet uppercase tracking-[0.2em] mb-2 block">Análise de Enredo</label>
                                            <p className="text-[var(--text-secondary)] leading-relaxed">{data.overview?.centralPlot || 'Análise indisponível'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="p-6 bg-teal/5 rounded-2xl border border-teal/10">
                                            <label className="text-[10px] font-black text-teal uppercase tracking-[0.2em] mb-2 block">Gênero Principal</label>
                                            <p className="text-2xl font-title font-bold text-[var(--text-primary)]">{data.genre?.primary || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-teal uppercase tracking-[0.2em] mb-4 block">Temas Explorados</label>
                                            <div className="flex flex-wrap gap-2">
                                                {(data.overview?.mainThemes || []).map((theme, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-teal/10 text-teal border border-teal/20 rounded-lg text-xs font-bold uppercase tracking-tight">
                                                        {theme}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'narrative' && (
                        <NarrativeChart structures={data.narrativeStructures} />
                    )}

                    {activeTab === 'characters' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {data.characters.map((char, i) => (
                                <CharacterCard key={i} character={char} />
                            ))}
                        </div>
                    )}

                    {activeTab === 'language' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="glass-card">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-2">
                                        <MessageSquare size={20} className="text-violet" />
                                        Métricas de Linguagem
                                    </h3>
                                    <div className="space-y-8">
                                        <div>
                                            <div className="flex justify-between items-end mb-3">
                                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Eficiência de Subtexto</label>
                                                <span className="text-2xl font-title font-bold text-violet">{data.languageAndDialog?.subtextEfficiency || 0}/10</span>
                                            </div>
                                            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div className="h-full bg-gradient-to-r from-violet/50 to-violet transition-all duration-1000" style={{ width: `${(data.languageAndDialog?.subtextEfficiency || 0) * 10}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Veredito do Vocabulário</label>
                                            <p className="text-[var(--text-secondary)] leading-relaxed">{data.languageAndDialog?.vocabulary || 'Análise indisponível'}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Análise de Diálogos</label>
                                            <p className="text-[var(--text-secondary)] leading-relaxed">{data.languageAndDialog?.dialogueQuality || 'Não analisado'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-card">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-2">
                                        <Sparkles size={20} className="text-teal" />
                                        Atmosfera e Tom
                                    </h3>
                                    <div className="space-y-8">
                                        <div className="p-6 bg-violet/5 rounded-2xl border border-violet/10">
                                            <label className="text-[10px] font-black text-violet uppercase tracking-widest mb-2 block">Tom Predominante</label>
                                            <p className="text-3xl font-title font-bold text-[var(--text-primary)]">{data.metrics?.tone || 'Neutro'}</p>
                                            <p className="text-sm text-[var(--text-secondary)] mt-4 leading-relaxed font-body">{data.metrics?.toneDescription || 'Nenhuma descrição disponível.'}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-teal uppercase tracking-widest mb-2 block">Estrutura Sintática</label>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{data.metrics?.toneAnalysis?.sentenceStructure || 'Análise de estrutura sintática indisponível.'}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {(data.metrics?.toneAnalysis?.lexicalMarkers || []).map((m, i) => (
                                                <span key={i} className="px-3 py-1 bg-violet/10 text-violet border border-violet/20 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'prescription' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="glass-card border-l-4 border-teal border-t-0 border-b-0 border-r-0">
                                <h3 className="text-2xl font-title font-bold text-[var(--text-primary)] mb-8">Prescrição Literária</h3>
                                <div className="space-y-6">
                                    {(data.rewritingTips || []).map((tip, i) => (
                                        <div key={i} className="flex gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-teal/30 transition-all group">
                                            <div className="h-12 w-12 bg-teal/10 rounded-2xl flex flex-shrink-0 items-center justify-center text-teal font-black text-xl group-hover:scale-110 transition-transform">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-[10px] font-black text-teal uppercase tracking-[0.2em] block mb-2">Focar em: {tip?.section || 'Melhoria'}</span>
                                                <p className="text-[var(--text-primary)] leading-relaxed font-body text-lg">"{tip?.suggestion || 'Nenhuma sugestão enviada.'}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card bg-violet/5 border-violet/20 p-8">
                                <label className="text-violet font-black mb-4 flex items-center gap-2 uppercase tracking-[0.3em] text-[10px]">
                                    <Target size={16} />
                                    Próximos Passos Recomendados
                                </label>
                                <p className="text-[var(--text-secondary)] leading-relaxed italic border-l-2 border-violet/30 pl-4">
                                    Esta análise dissecou a estrutura profunda do seu manuscrito. Foque nas oportunidades de melhoria destacadas na seção de Linguagem para aumentar o impacto emocional e a fluidez da sua obra.
                                </p>
                            </div>
                        </div>
                    )}
                </main>

                {/* Reset Action */}
                <footer className="mt-20 pt-10 border-t border-white/5 flex justify-center no-print">
                    <button onClick={onReset} className="text-[var(--text-muted)] hover:text-violet transition-all flex items-center gap-3 text-xs uppercase tracking-[0.3em] font-black group">
                        <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                        Efetuar Nova Autópsia
                    </button>
                </footer>
            </div>

            {/* Hidden Print Report */}
            <PrintReport data={data} />

            {/* Print Layout */}
            <PrintReport data={data} />
        </div>
    );
};
