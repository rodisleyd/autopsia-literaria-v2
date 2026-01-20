
import React from 'react';
import { AnalysisResult } from '../../types';
import {
    CheckCircle2,
    Circle,
    Dna,
    Map,
    Users,
    MessageSquare,
    PenTool,
    Target,
    ChevronRight,
    Sparkles
} from 'lucide-react';

interface PrintReportProps {
    data: AnalysisResult;
}

const FRAMEWORK_DISPLAY_NAMES: Record<string, string> = {
    herosJourney: 'Jornada do Herói',
    saveTheCat: 'Save the Cat',
    storyCircle: 'Story Circle',
    sevenPointStructure: 'Sete Pontos',
    characterArc: 'Arco de Personagem',
    kishotenketsu: 'Kishōtenketsu',
    threeActStructure: 'Três Atos'
};

export const PrintReport: React.FC<PrintReportProps> = ({ data }) => {
    // --------------------------------------------------------------------------------
    // LAYOUT 1: TV SERIES / ROTEIRO (SHOWRUNNER MODE)
    // --------------------------------------------------------------------------------
    if (data.tvSeriesAnalysis) {
        return (
            <div id="print-report" className="hidden print:block p-12 bg-white text-slate-900 font-serif min-h-screen">
                {/* Page 1: Cover (TV) */}
                <div className="flex flex-col items-center justify-center h-[90vh] border-8 border-slate-100 p-12 text-center mb-24">
                    <div className="mb-12">
                        <img src="https://i.ibb.co/qMqVKj7g/LOGO-AUTOPSIA-POSITIVO.png" alt="Autópsia Literária" className="h-24 mx-auto" />
                    </div>
                    <h1 className="text-6xl font-title font-bold text-slate-950 mb-8 uppercase tracking-tighter">Bible de Série</h1>
                    <div className="h-1 w-24 bg-violet mx-auto mb-12"></div>
                    <h2 className="text-4xl font-bold text-slate-800 mb-4 font-serif italic">{data.overview.title}</h2>
                    <p className="text-xl text-slate-500 font-sans tracking-widest uppercase">Análise de Viabilidade & Piloto</p>
                    <div className="mt-auto">
                        <p className="text-slate-400 font-sans font-bold uppercase tracking-widest text-xs">Relatório Gerado em</p>
                        <p className="text-slate-600 font-bold">{new Date(data.timestamp).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
                <div className="page-break"></div>

                {/* Page 2: Executive Summary (TV) */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-8 uppercase tracking-widest flex items-center gap-3">
                        <Target className="text-violet" /> Sumário Executivo
                    </h2>
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-12">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Logline Oficial</h3>
                        <p className="text-2xl font-serif italic text-slate-900 leading-relaxed">"{data.tvSeriesAnalysis.overview.logline}"</p>
                    </div>
                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-teal mb-1">Formato</h4>
                                <p className="text-lg font-bold text-slate-800">{data.tvSeriesAnalysis.narrativeEngine.format}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-violet mb-1">Tom</h4>
                                <p className="text-lg font-bold text-slate-800">{data.tvSeriesAnalysis.overview.tone}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Público-Alvo</h4>
                                <p className="text-lg font-bold text-slate-800">{data.tvSeriesAnalysis.overview.targetAudience}</p>
                            </div>
                        </div>
                        <div className="bg-violet/5 p-6 rounded-2xl border border-violet/10">
                            <h4 className="text-xs font-black uppercase tracking-widest text-violet mb-2">Motor Narrativo (Engine)</h4>
                            <p className="text-md text-slate-700 leading-relaxed italic">{data.tvSeriesAnalysis.narrativeEngine.coreConflict}</p>
                            <div className="mt-4 pt-4 border-t border-violet/10">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Potencial de Temporada</span>
                                <p className="text-sm text-slate-800">{data.tvSeriesAnalysis.narrativeEngine.seasonPotential}</p>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="page-break"></div>

                {/* Page 3: Pilot Anatomy */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-8 uppercase tracking-widest flex items-center gap-3">
                        <Map className="text-violet" /> Anatomia do Piloto
                    </h2>
                    <div className="space-y-8 relative border-l-4 border-slate-100 ml-4 pb-4">
                        {[
                            { label: 'Incidente Incitante', value: data.tvSeriesAnalysis.pilotStructure.incitingIncident },
                            { label: 'Ato 1', value: data.tvSeriesAnalysis.pilotStructure.act1 },
                            { label: 'Plot Point 1', value: data.tvSeriesAnalysis.pilotStructure.plotPoint1, highlight: true },
                            { label: 'Midpoint', value: data.tvSeriesAnalysis.pilotStructure.midpoint, highlight: true },
                            { label: 'Plot Point 2', value: data.tvSeriesAnalysis.pilotStructure.plotPoint2, highlight: true },
                            { label: 'Clímax', value: data.tvSeriesAnalysis.pilotStructure.climax },
                            { label: 'Cliffhanger', value: data.tvSeriesAnalysis.pilotStructure.cliffhanger, highlight: true }
                        ].map((beat, i) => (
                            <div key={i} className="pl-8 relative">
                                <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white ${beat.highlight ? 'bg-violet' : 'bg-slate-300'}`}></div>
                                <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${beat.highlight ? 'text-violet' : 'text-slate-400'}`}>{beat.label}</h4>
                                <p className="text-slate-800 leading-relaxed text-sm">{beat.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Notas Estruturais</h4>
                        <p className="text-sm text-slate-600 italic">{data.tvSeriesAnalysis.pilotStructure.comments}</p>
                    </div>
                </section>
                <div className="page-break"></div>

                {/* Page 4: Characters & World */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-8 uppercase tracking-widest flex items-center gap-3">
                        <Users className="text-violet" /> Cast & Universo
                    </h2>
                    <div className="grid grid-cols-2 gap-8 mb-12">
                        {data.tvSeriesAnalysis.charactersAspects.map((char, i) => (
                            <div key={i} className="border border-slate-100 p-6 rounded-2xl bg-slate-50">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-slate-900">{char.name}</h3>
                                    <span className="text-[10px] font-black uppercase bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">{char.role}</span>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-teal block">Want (Externo)</span>
                                        <p className="text-xs text-slate-700">{char.externalDesire}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-violet block">Need (Interno)</span>
                                        <p className="text-xs text-slate-700">{char.internalNeed}</p>
                                    </div>
                                    <div className="pt-2 border-t border-slate-200 mt-2">
                                        <span className="text-[10px] font-black uppercase text-slate-400 block">Arco da Temporada</span>
                                        <p className="text-xs text-slate-600 italic">"{char.seasonArc}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-slate-900 text-white p-8 rounded-3xl">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-violet mb-2">Regras do Mundo</h4>
                                <p className="text-sm opacity-80 leading-relaxed">{data.tvSeriesAnalysis.worldAndTheme.rules}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-violet mb-2">Questão Filosófica</h4>
                                <p className="text-lg font-serif italic mb-4">"{data.tvSeriesAnalysis.worldAndTheme.philosophicalQuestion}"</p>
                                <h4 className="text-xs font-black uppercase tracking-widest text-violet mb-2">Potencial de Franquia</h4>
                                <p className="text-xs opacity-70">{data.tvSeriesAnalysis.worldAndTheme.franchisePotential}</p>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="page-break"></div>

                {/* Page 5: Diagnosis */}
                <section>
                    <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-8 uppercase tracking-widest flex items-center gap-3">
                        <Sparkles className="text-violet" /> Diagnóstico Final
                    </h2>
                    <div className="flex items-center gap-8 mb-12">
                        <div className="w-32 h-32 rounded-full border-8 border-violet flex items-center justify-center">
                            <span className="text-5xl font-black text-violet">{data.tvSeriesAnalysis.diagnosis.engagementScore}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Veredito do Showrunner</h3>
                            <p className="text-slate-600 leading-relaxed italic">"{data.tvSeriesAnalysis.diagnosis.finalVerdict}"</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mb-12">
                        <div className="p-6 bg-teal/5 border border-teal/10 rounded-2xl">
                            <h4 className="text-xs font-black uppercase tracking-widest text-teal mb-4">Pontos Fortes</h4>
                            <ul className="space-y-2">
                                {data.tvSeriesAnalysis.diagnosis.strengths.map((s, i) => (
                                    <li key={i} className="text-sm text-slate-700 font-bold">• {s}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
                            <h4 className="text-xs font-black uppercase tracking-widest text-red-500 mb-4">Riscos & Fraquezas</h4>
                            <ul className="space-y-2">
                                {data.tvSeriesAnalysis.diagnosis.weaknesses.map((w, i) => (
                                    <li key={i} className="text-sm text-slate-700">• {w}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="border border-slate-200 p-8 rounded-3xl">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Plano de Correção (Fix List)</h4>
                        <div className="grid grid-cols-2 gap-6">
                            {data.tvSeriesAnalysis.diagnosis.improvementSuggestions.map((sug, i) => (
                                <div key={i} className="flex gap-4">
                                    <span className="text-violet font-black text-lg">{i + 1}.</span>
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">{sug.category}</span>
                                        <p className="text-sm text-slate-800">{sug.suggestion}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-12 p-8 bg-slate-950 text-white rounded-3xl text-center">
                        <p className="text-sm opacity-50 uppercase tracking-widest mb-2">Rodisley Comunicação Visual</p>
                        <p className="text-xs opacity-30">© 2026 Autópsia Literária 2.0 • Relatório Confidencial de Série</p>
                    </div>
                </section>
            </div>
        );
    }

    // --------------------------------------------------------------------------------
    // LAYOUT 2: NOVEL / LITERARY (STANDARD MODE)
    // --------------------------------------------------------------------------------
    return (
        <div id="print-report" className="hidden print:block p-12 bg-white text-slate-900 font-serif min-h-screen">
            {/* Page 1: Cover */}
            <div className="flex flex-col items-center justify-center h-[90vh] border-8 border-slate-100 p-12 text-center mb-24">
                <div className="mb-12">
                    <img
                        src="https://i.ibb.co/qMqVKj7g/LOGO-AUTOPSIA-POSITIVO.png"
                        alt="Autópsia Literária"
                        className="h-24 mx-auto"
                    />
                </div>

                <h1 className="text-6xl font-title font-bold text-slate-950 mb-8 uppercase tracking-tighter">
                    Dossiê Literário
                </h1>
                <div className="h-1 w-24 bg-violet mx-auto mb-12"></div>
                <h2 className="text-4xl font-bold text-slate-800 mb-4 font-serif italic">
                    {data.overview.title}
                </h2>
                <p className="text-xl text-slate-500 font-sans tracking-widest uppercase">
                    Autópsia Textual Avançada 2.0
                </p>
                <div className="mt-auto">
                    <p className="text-slate-400 font-sans font-bold uppercase tracking-widest text-xs">
                        Relatório Gerado em
                    </p>
                    <p className="text-slate-600 font-bold">
                        {new Date(data.timestamp).toLocaleDateString('pt-BR')}
                    </p>
                </div>
            </div>

            <div className="page-break"></div>

            {/* Page 2: Summary Dashboard */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-8 uppercase tracking-widest flex items-center gap-3">
                    <Sparkles className="text-violet" /> Sumário Executivo
                </h2>

                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Nota Global de Impacto</span>
                        <span className="text-8xl font-black text-violet leading-none">{data.score}</span>
                        <span className="text-sm font-bold text-slate-500 mt-2">Escala de 0 a 10</span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 font-sans">Veredito do Especialista</h3>
                            <div className="space-y-3">
                                <div className="p-4 bg-teal/5 border border-teal/10 rounded-xl">
                                    <h4 className="text-[10px] font-black uppercase text-teal mb-1">Ponto Forte Dominante</h4>
                                    <p className="text-sm text-slate-700">{data.scoreJustification.strengths[0]}</p>
                                </div>
                                <div className="p-4 bg-violet/5 border border-violet/10 rounded-xl">
                                    <h4 className="text-[10px] font-black uppercase text-violet mb-1">Principal Oportunidade</h4>
                                    <p className="text-sm text-slate-700">{data.scoreJustification.weaknesses[0]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Premissa Central</h4>
                        <p className="text-xl leading-relaxed text-slate-800">{data.overview.premise}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Temas Explorados</h4>
                        <div className="flex flex-wrap gap-2">
                            {data.overview.mainThemes.map((theme, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-600">
                                    {theme}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="page-break"></div>

            {/* Page 3: Narrative Dossiê */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-8 uppercase tracking-widest flex items-center gap-3">
                    <Map className="text-violet" /> Dossiê Narrativo
                </h2>

                <div className="space-y-12">
                    {Object.entries(data.narrativeStructures).map(([key, structure]: [string, any]) => (
                        <div key={key} className="border border-slate-100 rounded-3xl p-8 bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
                                {FRAMEWORK_DISPLAY_NAMES[key] || structure.name}
                                <span className="text-[10px] font-black bg-slate-200 px-2 py-1 rounded uppercase tracking-widest">Estrutura Ativa</span>
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                {structure.stages.map((stage: any, i: number) => (
                                    <div key={i} className={`flex gap-4 p-4 rounded-xl ${stage.foundInText ? 'bg-white shadow-sm border border-slate-100' : 'opacity-30 grayscale'}`}>
                                        <div className="mt-1">
                                            {stage.foundInText ? <CheckCircle2 className="text-teal" size={16} /> : <Circle className="text-slate-300" size={16} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[8px] font-black uppercase text-slate-400">Passo {i + 1}</span>
                                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{stage.label}</h4>
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed mb-2">{stage.description}</p>
                                            {stage.evidence && (
                                                <div className="p-3 bg-slate-50 border-l-2 border-slate-200">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Evidência no Manuscrito</p>
                                                    <p className="text-xs italic text-slate-700">"{stage.evidence}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="page-break"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Page 4: Character Analysis */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-8 uppercase tracking-widest flex items-center gap-3">
                    <Users className="text-violet" /> Elenco & Arquetipia
                </h2>

                <div className="grid grid-cols-2 gap-8">
                    {data.characters.map((char, i) => (
                        <div key={i} className="border border-slate-100 p-8 rounded-3xl bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{char.name}</h3>
                            <p className="text-xs font-black uppercase text-violet tracking-widest mb-4">{char.role}</p>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Arco de Personagem</h4>
                                    <p className="text-sm text-slate-700 leading-relaxed">{char.arc}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase text-teal mb-1">Trunfos</h4>
                                        <ul className="text-xs text-slate-600 space-y-1">
                                            {char.strengths.map((s, idx) => <li key={idx}>• {s}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase text-red-400 mb-1">Falhas</h4>
                                        <ul className="text-xs text-slate-600 space-y-1">
                                            {char.weaknesses.map((w, idx) => <li key={idx}>• {w}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="page-break"></div>

            {/* Page 5: Language & Diagnostics */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-8 uppercase tracking-widest flex items-center gap-3">
                    <MessageSquare className="text-violet" /> Diagnóstico Técnico
                </h2>

                <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-black uppercase text-slate-400 mb-2">Processamento de Linguagem</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Eficiência de Subtexto</label>
                                    <div className="h-1 bg-slate-100 rounded-full mt-1">
                                        <div className="h-full bg-violet" style={{ width: `${data.languageAndDialog.subtextEfficiency * 10}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 mt-1">{data.languageAndDialog.subtextEfficiency}/10</span>
                                </div>
                                <p className="text-sm text-slate-700 italic border-l-4 border-slate-100 pl-4 py-2">
                                    "{data.languageAndDialog.expositionCheck}"
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-black uppercase text-slate-400 mb-2">Veredito do Vocabulário</h3>
                            <p className="text-sm text-slate-800 leading-relaxed">{data.languageAndDialog.vocabulary}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-black uppercase text-slate-400 mb-2">Atmosfera e Tom</h3>
                            <div className="p-6 bg-slate-900 text-white rounded-3xl">
                                <span className="text-[10px] font-black uppercase text-violet tracking-widest mb-1 block">Tom Predominante</span>
                                <p className="text-2xl font-title uppercase mb-4">{data.metrics.tone}</p>
                                <p className="text-xs opacity-70 leading-relaxed">{data.metrics.toneDescription}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {data.metrics.toneAnalysis.lexicalMarkers.map((m, i) => (
                                <span key={i} className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-black uppercase text-slate-500">
                                    {m}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Page 6: Final Prescription */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-8 uppercase tracking-widest flex items-center gap-3">
                    <PenTool className="text-violet" /> Prescrição Profissional
                </h2>

                <div className="space-y-6">
                    {data.rewritingTips.map((tip, i) => (
                        <div key={i} className="flex gap-6 p-6 border border-slate-100 rounded-3xl">
                            <div className="h-12 w-12 bg-violet text-white rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                                {i + 1}
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase text-violet tracking-widest mb-1">{tip.section}</h4>
                                <p className="text-md text-slate-800 font-medium leading-relaxed">{tip.suggestion}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 bg-slate-950 text-white rounded-3xl text-center">
                    <p className="text-sm opacity-50 uppercase tracking-widest mb-2">Rodisley Comunicação Visual</p>
                    <p className="text-xs opacity-30">© 2026 Autópsia Literária 2.0 • Relatório Confidencial de Análise Narrativa</p>
                </div>
            </section>
        </div>
    );
};
