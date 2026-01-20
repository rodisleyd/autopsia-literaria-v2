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
    const [tvSubTab, setTvSubTab] = useState('overview');


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
                        {[
                            ...TABS,
                            ...(data.tvSeriesAnalysis ? [{ id: 'tv_series', label: 'DNA da Série', icon: Sparkles }] : [])
                        ].map((tab) => {
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
                    {activeTab === 'tv_series' && data.tvSeriesAnalysis && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Sub-Navigation for TV Series */}
                            <div className="flex flex-wrap gap-4 border-b border-white/5 pb-4">
                                {[
                                    { id: 'overview', label: 'Visão Geral' },
                                    { id: 'beats', label: 'Beat Sheet (Estrutura)' },
                                    { id: 'cast', label: 'Cast & Arcos' },
                                    { id: 'world', label: 'Mundo & Tema' },
                                    { id: 'verdict', label: 'Veredito' }
                                ].map(sub => (
                                    <button
                                        key={sub.id}
                                        onClick={() => setTvSubTab(sub.id)}
                                        className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${tvSubTab === sub.id
                                            ? 'border-teal text-teal'
                                            : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                            }`}
                                    >
                                        {sub.label}
                                    </button>
                                ))}
                            </div>

                            {/* TV SERIES: OVERVIEW TAB */}
                            {tvSubTab === 'overview' && (
                                <div className="space-y-8">
                                    <div className="glass-card">
                                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Logline & Proposta</h3>
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mb-6">
                                            <p className="text-xl font-serif italic text-[var(--text-primary)] leading-relaxed">
                                                "{data.tvSeriesAnalysis.overview.logline}"
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Tom</label>
                                                <p className="text-sm font-bold text-violet">{data.tvSeriesAnalysis.overview.tone}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Público-Alvo</label>
                                                <p className="text-sm font-bold text-teal">{data.tvSeriesAnalysis.overview.targetAudience}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Formato</label>
                                                <p className="text-sm font-bold text-[var(--text-primary)]">{data.tvSeriesAnalysis.narrativeEngine.format}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-card">
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Motor Narrativo</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="p-6 bg-violet/5 rounded-2xl border border-violet/10">
                                                <label className="text-[10px] font-black text-violet uppercase tracking-widest block mb-2">Conflito Central Inesgotável</label>
                                                <p className="text-[var(--text-secondary)] leading-relaxed">
                                                    {data.tvSeriesAnalysis.narrativeEngine.coreConflict}
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Potencial de Temporada</label>
                                                    <p className="text-sm text-[var(--text-secondary)]">{data.tvSeriesAnalysis.narrativeEngine.seasonPotential}</p>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Descrição do Motor</label>
                                                    <p className="text-sm text-[var(--text-secondary)] italic">{data.tvSeriesAnalysis.narrativeEngine.engineDescription}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TV SERIES: BEAT SHEET TAB */}
                            {tvSubTab === 'beats' && (
                                <div className="glass-card">
                                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                                        <Map className="text-violet" />
                                        Beat Sheet do Piloto
                                    </h3>
                                    <div className="relative border-l-2 border-white/10 ml-4 space-y-12 pb-4">
                                        {[
                                            { label: 'Incidente Incitante', value: data.tvSeriesAnalysis.pilotStructure.incitingIncident, color: 'text-white' },
                                            { label: 'Ato 1 (Promessa)', value: data.tvSeriesAnalysis.pilotStructure.act1, color: 'text-[var(--text-muted)]' },
                                            { label: 'Plot Point 1', value: data.tvSeriesAnalysis.pilotStructure.plotPoint1, color: 'text-violet' },
                                            { label: 'Ato 2 (Desenvolvimento)', value: data.tvSeriesAnalysis.pilotStructure.act2, color: 'text-[var(--text-muted)]' },
                                            { label: 'Midpoint', value: data.tvSeriesAnalysis.pilotStructure.midpoint, color: 'text-teal' },
                                            { label: 'Plot Point 2 (All is Lost)', value: data.tvSeriesAnalysis.pilotStructure.plotPoint2, color: 'text-violet' },
                                            { label: 'Ato 3 (Clímax)', value: data.tvSeriesAnalysis.pilotStructure.act3, color: 'text-[var(--text-muted)]' },
                                            { label: 'Clímax do Piloto', value: data.tvSeriesAnalysis.pilotStructure.climax, color: 'text-white' },
                                            { label: 'Cliffhanger (Gancho)', value: data.tvSeriesAnalysis.pilotStructure.cliffhanger, color: 'text-violet font-bold' }
                                        ].map((beat, idx) => (
                                            <div key={idx} className="relative pl-8 group">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-[var(--bg-page)] bg-white/20 group-hover:bg-violet group-hover:scale-125 transition-all"></div>
                                                <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ${beat.label.includes('Plot') || beat.label.includes('Cliff') ? 'text-violet' : 'text-[var(--text-muted)]'}`}>
                                                    {beat.label}
                                                </label>
                                                <p className={`text-[var(--text-primary)] leading-relaxed text-sm ${beat.color}`}>
                                                    {beat.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-6 bg-black/20 rounded-xl">
                                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-2">Comentários Estruturais</label>
                                        <p className="text-[var(--text-secondary)] text-sm italic">{data.tvSeriesAnalysis.pilotStructure.comments}</p>
                                    </div>
                                </div>
                            )}

                            {/* TV SERIES: CAST TAB */}
                            {tvSubTab === 'cast' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {data.tvSeriesAnalysis.charactersAspects.map((char, i) => (
                                        <div key={i} className="glass-card relative overflow-hidden group hover:border-violet/30 transition-all">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-violet group-hover:opacity-20 transition-opacity">
                                                {char.name.charAt(0)}
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="text-xl font-bold text-[var(--text-primary)]">{char.name}</h4>
                                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${char.role === 'Protagonista' ? 'bg-violet/20 text-violet' :
                                                        char.role === 'Antagonista' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-white/10 text-[var(--text-secondary)]'
                                                        }`}>{char.role}</span>
                                                </div>
                                                <p className="text-xs text-[var(--text-muted)] mb-6 uppercase tracking-wider font-bold">{char.dramaticFunction}</p>

                                                <div className="space-y-4">
                                                    <div className="p-3 bg-black/20 rounded-lg">
                                                        <span className="text-[10px] text-teal block mb-1 font-black uppercase">Desejo Externo (Want)</span>
                                                        <p className="text-sm text-[var(--text-secondary)]">{char.externalDesire}</p>
                                                    </div>
                                                    <div className="p-3 bg-black/20 rounded-lg">
                                                        <span className="text-[10px] text-violet block mb-1 font-black uppercase">Necessidade Interna (Need)</span>
                                                        <p className="text-sm text-[var(--text-secondary)]">{char.internalNeed}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-[var(--text-muted)] block mb-1 font-black uppercase">Arco de Temporada</span>
                                                        <p className="text-sm text-[var(--text-secondary)] italic">"{char.seasonArc}"</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* TV SERIES: WORLD & THEME TAB */}
                            {tvSubTab === 'world' && (
                                <div className="space-y-8">
                                    <div className="glass-card">
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                            <Map size={20} className="text-teal" />
                                            World Building
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="text-[10px] font-black text-teal uppercase tracking-widest block mb-2">Regras do Universo</label>
                                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{data.tvSeriesAnalysis.worldAndTheme.rules}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-teal uppercase tracking-widest block mb-2">Espaço Social & Moral</label>
                                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{data.tvSeriesAnalysis.worldAndTheme.socialMoralSpace}</p>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-white/5">
                                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-2">Potencial de Franquia</label>
                                            <p className="text-[var(--text-primary)] italic">"{data.tvSeriesAnalysis.worldAndTheme.franchisePotential}"</p>
                                        </div>
                                    </div>

                                    <div className="glass-card">
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                            <Sparkles size={20} className="text-violet" />
                                            Temas & Subtexto
                                        </h3>
                                        <div className="p-6 bg-violet/5 rounded-2xl border border-violet/10 mb-6">
                                            <label className="text-[10px] font-black text-violet uppercase tracking-widest block mb-2">Questão Filosófica Central</label>
                                            <p className="text-lg font-serif italic text-[var(--text-primary)]">{data.tvSeriesAnalysis.worldAndTheme.philosophicalQuestion}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-2">Tema Central</label>
                                                <p className="text-[var(--text-secondary)]">{data.tvSeriesAnalysis.worldAndTheme.centralTheme}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-2">Temas Secundários</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {data.tvSeriesAnalysis.worldAndTheme.secondaryThemes.map((t, i) => (
                                                        <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-[var(--text-secondary)] border border-white/10">{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TV SERIES: VERDICT TAB */}
                            {tvSubTab === 'verdict' && (
                                <div className="space-y-8">
                                    <div className="glass-card flex flex-col items-center">
                                        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent"
                                                    strokeDasharray={439.8}
                                                    strokeDashoffset={439.8 - (439.8 * data.tvSeriesAnalysis.diagnosis.engagementScore) / 10}
                                                    className="text-violet transition-all duration-1000 ease-out" />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-5xl font-black text-violet">{data.tvSeriesAnalysis.diagnosis.engagementScore}</span>
                                                <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)]">Engajamento</span>
                                            </div>
                                        </div>
                                        <div className="text-center max-w-2xl">
                                            <h4 className="text-xl font-bold text-[var(--text-primary)] mb-2">Veredito Final</h4>
                                            <p className="text-[var(--text-secondary)] leading-relaxed italic">"{data.tvSeriesAnalysis.diagnosis.finalVerdict}"</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="glass-card border-t-4 border-teal">
                                            <h4 className="text-teal font-black uppercase tracking-widest mb-4">Pontos Fortes (Highlights)</h4>
                                            <ul className="space-y-2">
                                                {data.tvSeriesAnalysis.diagnosis.strengths.map((s, i) => (
                                                    <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                                                        <span className="text-teal font-bold">+</span> {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="glass-card border-t-4 border-red-500/50">
                                            <h4 className="text-red-400 font-black uppercase tracking-widest mb-4">Pontos Fracos & Riscos</h4>
                                            <ul className="space-y-2">
                                                {data.tvSeriesAnalysis.diagnosis.weaknesses.map((w, i) => (
                                                    <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                                                        <span className="text-red-400 font-bold">!</span> {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="glass-card bg-violet/5 border-violet/10">
                                        <h3 className="text-lg font-bold text-violet mb-6 flex items-center gap-2">
                                            <PenTool size={18} />
                                            Sugestões de Script Doctor
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {data.tvSeriesAnalysis.diagnosis.improvementSuggestions.map((sug, i) => (
                                                <div key={i} className="p-4 bg-black/20 rounded-xl">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-2">{sug.category}</span>
                                                    <p className="text-sm text-[var(--text-primary)]">{sug.suggestion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
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
