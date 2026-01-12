
import React from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface Stage {
    label: string;
    description: string;
    foundInText: boolean;
    evidence?: string;
}

interface NarrativeStructure {
    name: string;
    stages: Stage[];
}

interface NarrativeChartProps {
    structures: {
        herosJourney: NarrativeStructure;
        saveTheCat: NarrativeStructure;
        storyCircle: NarrativeStructure;
        sevenPointStructure: NarrativeStructure;
        characterArc: NarrativeStructure;
        kishotenketsu: NarrativeStructure;
        threeActStructure: NarrativeStructure;
    };
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

export const NarrativeChart: React.FC<NarrativeChartProps> = ({ structures }) => {
    // Determine the initial framework safely
    const availableFrameworks = Object.keys(structures || {}) as Array<keyof typeof structures>;
    const defaultFramework = availableFrameworks.includes('herosJourney')
        ? 'herosJourney'
        : availableFrameworks[0];

    const [activeFramework, setActiveFramework] = React.useState<keyof typeof structures>(defaultFramework);

    const current = structures?.[activeFramework];

    if (!current) {
        return (
            <div className="glass-card p-12 text-center">
                <p className="text-[var(--text-secondary)]">Nenhuma análise estrutural disponível para este framework.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="flex flex-wrap gap-2 p-1 bg-[var(--card-bg)] border border-[var(--border-main)] rounded-xl self-start inline-flex no-print shadow-sm">
                {availableFrameworks.map((key) => (
                    <button
                        key={key as string}
                        onClick={() => setActiveFramework(key)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeFramework === key
                            ? 'bg-violet text-white shadow-md'
                            : 'text-[var(--text-secondary)] opacity-60 hover:opacity-100'
                            }`}
                    >
                        {FRAMEWORK_DISPLAY_NAMES[key as string] || (structures as any)?.[key]?.name || (key as string)}
                    </button>
                ))}
            </div>

            <div className="glass-card relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <h2 className="text-8xl font-serif font-black italic">{current?.name || 'Estrutura'}</h2>
                </div>

                <div className="relative z-10">
                    <div className="mb-8 border-b border-white/5 pb-4">
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">{current?.name || 'Estrutura'}</h3>
                        <p className="text-slate-400 text-sm">
                            Análise de correspondência estrutural baseada no manuscrito submetido.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {(current?.stages || []).map((stage, index) => (
                            <div
                                key={index}
                                className={`flex gap-4 p-4 rounded-xl transition-all duration-500 ${stage?.foundInText ? 'bg-teal/5 border border-teal/10' : 'opacity-40 grayscale filter'
                                    }`}
                            >
                                <div className="flex-shrink-0 mt-1">
                                    {stage?.foundInText ? (
                                        <CheckCircle2 className="text-teal" size={20} />
                                    ) : (
                                        <Circle className="text-slate-600" size={20} />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold py-0.5 px-2 bg-[var(--card-bg)] border border-[var(--border-card)] rounded uppercase tracking-tighter text-[var(--text-secondary)]">
                                            Passo {index + 1}
                                        </span>
                                        <h4 className="font-bold text-white text-sm uppercase tracking-wide">
                                            {stage?.label || 'Etapa'}
                                        </h4>
                                    </div>
                                    <p className="text-xs opacity-70 leading-relaxed">
                                        {stage?.description || 'Nenhuma descrição fornecida.'}
                                    </p>
                                    {stage?.evidence && (
                                        <div className="bg-[var(--bg-page)]/40 p-3 rounded-lg border-l-2 border-slate-300">
                                            <p className="text-[10px] text-[var(--text-muted)] uppercase font-black mb-1">Evidência Diagnóstica</p>
                                            <p className="text-xs text-[var(--text-secondary)] italic font-serif">"{stage.evidence}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
