
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '../types';
import { ICONS, COLORS } from '../constants';

interface DashboardProps {
  data: AnalysisResult;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const radarData = [
    { subject: 'Ritmo', A: data.metrics.rhythmScore * 10, fullMark: 100 },
    { subject: 'Subtexto', A: data.languageAndDialog.subtextEfficiency * 10, fullMark: 100 },
    { subject: 'Estrutura', A: 85, fullMark: 100 },
    { subject: 'Personagens', A: 70, fullMark: 100 },
    { subject: 'Coerência', A: data.worldBuilding.coherence * 10, fullMark: 100 },
  ];

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleExportTXT = () => {
    const sections = [
      `AUTÓPSIA LITERÁRIA 2.0 - RELATÓRIO DE ANÁLISE`,
      `==========================================`,
      `OBRA: ${data.overview.title.toUpperCase()}`,
      `DATA DA ANÁLISE: ${new Date(data.timestamp).toLocaleString('pt-BR')}`,
      `NOTA GLOBAL: ${data.score}/10`,
      ``,
      `VISÃO GERAL`,
      `-----------`,
      `PREMISSA: ${data.overview.premise}`,
      `ENREDO CENTRAL: ${data.overview.centralPlot}`,
      `TEMAS: ${data.overview.mainThemes.join(', ')}`,
      `GÊNERO: ${data.genre.primary}`,
      `SUBGÊNEROS: ${data.genre.subgenres.join(', ') || 'Nenhum identificado'}`,
      ``,
      `JUSTIFICATIVA DA NOTA`,
      `---------------------`,
      `PONTOS FORTES:`,
      ...data.scoreJustification.strengths.map(s => `- ${s}`),
      `OPORTUNIDADES DE MELHORIA:`,
      ...data.scoreJustification.weaknesses.map(w => `- ${w}`),
      ``,
      `MÉTRICAS DE FLUXO E IDENTIDADE`,
      `------------------------------`,
      `INTENSIDADE: ${data.metrics.intensity}`,
      `DESCRIÇÃO: ${data.metrics.intensityDescription}`,
      `RITMO (PACING): ${data.metrics.rhythmScore}/10`,
      `ANÁLISE DE RITMO: ${data.metrics.rhythmDescription}`,
      `TOM: ${data.metrics.tone}`,
      `ANÁLISE DE TOM: ${data.metrics.toneDescription}`,
      `SINTAXE: ${data.metrics.toneAnalysis.sentenceStructure}`,
      `MARCADORES LEXICAIS: ${data.metrics.toneAnalysis.lexicalMarkers.join(', ')}`,
      `ATMOSFERA: ${data.metrics.toneAnalysis.atmosphericElements.join(', ')}`,
      `COMPLEXIDADE: ${data.metrics.complexity}`,
      `DESCRIÇÃO DE COMPLEXIDADE: ${data.metrics.complexityDescription}`,
      ``,
      `ESTRUTURAS NARRATIVAS`,
      `---------------------`,
      ...[data.narrativeStructures.herosJourney, data.narrativeStructures.saveTheCat, data.narrativeStructures.storyCircle].map(framework => {
        return `\n[${framework.name.toUpperCase()}]\n` + 
          framework.stages.map(s => `${s.foundInText ? '[X]' : '[ ]'} ${s.label}: ${s.description}${s.evidence ? `\n    Evidência: "${s.evidence}"` : ''}`).join('\n');
      }),
      ``,
      `AUTÓPSIA DE PERSONAGENS`,
      `-----------------------`,
      ...data.characters.map(c => 
        `NOME: ${c.name}\nPAPEL: ${c.role}\nARCO: ${c.arc}\nVIRTUDES: ${c.strengths.join(', ')}\nFALHAS: ${c.weaknesses.join(', ')}\nIMPACTO: ${c.impact}\n`
      ),
      ``,
      `LABORATÓRIO DE LINGUAGEM`,
      `------------------------`,
      `QUALIDADE DOS DIÁLOGOS: ${data.languageAndDialog.dialogueQuality}`,
      `EFICIÊNCIA DE SUBTEXTO: ${data.languageAndDialog.subtextEfficiency}/10`,
      `ANÁLISE DE EXPOSIÇÃO: ${data.languageAndDialog.expositionCheck}`,
      ``,
      `PRESCRIÇÃO LITERÁRIA (DICAS DE REESCRITA)`,
      `-----------------------------------------`,
      ...data.rewritingTips.map((tip, i) => `${i + 1}. [${tip.section}] ${tip.suggestion}`),
      ``,
      `-----------------------------------------`,
      `Gerado por Autópsia Literária 2.0 - Analista de IA Nível Sênior`
    ];

    const content = sections.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Autopsia_${data.overview.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Print-only Header */}
      <div className="print-only mb-12 border-b-2 border-black pb-6 text-center">
        <h1 className="text-4xl font-serif font-bold italic mb-2">Relatório de Autópsia Literária 2.0</h1>
        <p className="text-gray-600">Dissecação Crítica e Analítica de Manuscrito</p>
        <p className="mt-4 font-bold uppercase tracking-widest text-sm">Obra: {data.overview.title}</p>
      </div>

      {/* Top bar with Score and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-charcoal/10 p-6 rounded-2xl border border-charcoal/30">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center no-print">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-charcoal/20" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * data.score) / 10}
                className="text-violet transition-all duration-1000 ease-out" />
            </svg>
            <span className="absolute text-3xl font-bold text-white font-serif">{data.score}</span>
          </div>
          <div className="print-only mb-4">
            <p className="text-5xl font-serif font-bold">Nota: {data.score}/10</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white md:text-white print:text-black mb-1">{data.overview.title}</h2>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded bg-violet/20 text-violet text-xs font-bold uppercase tracking-wider border border-violet/30 print:border-black print:text-black">
                {data.genre.primary}
              </span>
              <span className="px-2 py-0.5 rounded bg-teal/20 text-teal text-xs font-bold uppercase tracking-wider border border-teal/30 print:border-black