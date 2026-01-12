import React from 'react';
import {
    Upload,
    Cpu,
    FileSearch,
    Dna,
    Map,
    Users,
    MessageSquare,
    PenTool,
    Sparkles,
    ChevronRight,
    ArrowDown,
    BrainCircuit
} from 'lucide-react';

interface HowItWorksProps {
    onBack: () => void;
    onStart: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onBack, onStart }) => {
    return (
        <div className="w-full bg-[var(--bg-page)] text-[var(--text-primary)] min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden border-b border-[var(--border-main)]">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet/30 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal/20 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <button
                        onClick={onBack}
                        className="mb-8 text-xs font-black uppercase tracking-[0.3em] text-violet flex items-center gap-2 mx-auto hover:opacity-70 transition-opacity"
                    >
                        <ChevronRight className="rotate-180" size={14} />
                        Voltar ao Início
                    </button>
                    <h1 className="text-4xl md:text-6xl font-title font-bold mb-6 tracking-tight">
                        Como Funciona a <span className="text-violet">Autópsia Literária</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-body">
                        Entenda o processo científico e literário por trás da nossa inteligência artificial e como dissecamos cada camada da sua obra.
                    </p>
                    <div className="mt-12 flex justify-center">
                        <ArrowDown className="animate-bounce text-violet/50" />
                    </div>
                </div>
            </section>

            {/* The Process - Steps */}
            <section className="py-24 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-black text-violet uppercase tracking-[0.4em]">O Ciclo da Evolução</span>
                        <h2 className="text-3xl md:text-4xl font-title font-bold mt-2">Três Passos para a Perfeição</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-violet/20 via-teal/20 to-violet/20 -translate-y-1/2 z-0"></div>

                        <StepCard
                            number="01"
                            icon={<Upload className="text-violet" />}
                            title="Submissão"
                            description="Você faz o upload do seu manuscrito (PDF/DOCX/TXT). Nossa plataforma lê e processa o texto bruto, preparando-o para a incisão."
                        />
                        <StepCard
                            number="02"
                            icon={<Cpu className="text-teal" />}
                            title="Análise IA Avançada"
                            description="Nossos modelos treinados em clássicos e best-sellers escaneiam o ritmo, estruturas narrativas e o DNA dos seus personagens."
                        />
                        <StepCard
                            number="03"
                            icon={<FileSearch className="text-violet" />}
                            title="O Veredito"
                            description="Você recebe um relatório cirúrgico com métricas precisas, gráficos de estrutura e recomendações acionáveis."
                        />
                    </div>
                </div>
            </section>

            {/* The Anatomy Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-title font-bold mb-6">A Anatomia do Relatório</h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Dissecamos sua obra em cinco pilares fundamentais para que você saiba exatamente onde brilhar e onde corrigir.
                        </p>
                    </div>

                    <div className="space-y-24">
                        <AnatomySection
                            icon={<Sparkles className="text-violet" />}
                            title="Justificativa do Diagnóstico"
                            details={[
                                "Pontos Fortes: Identificamos o que torna sua escrita única e impactante.",
                                "Oportunidades de Melhoria: Apontamos falhas técnicas ou lógicas que podem afastar o leitor.",
                                "Nota Global: Uma métrica de 0 a 10 baseada na maturidade literária do texto."
                            ]}
                            image="/diagnostic_justification_section_1768238586844.png"
                            reversed={false}
                        />

                        <AnatomySection
                            icon={<Dna className="text-teal" />}
                            title="Identidade (O DNA da Obra)"
                            details={[
                                "Premissa Central: A inteligência extrai o conflito principal da sua história.",
                                "Enredo Central: Um resumo objetivo da jornada para validar se a ideia original está passando com clareza.",
                                "Gênero e Temas: Identificação automática de subgêneros e as camadas filosóficas exploradas."
                            ]}
                            image="/literary_identity_section_1768238563569.png"
                            reversed={true}
                        />

                        <AnatomySection
                            icon={<Map className="text-violet" />}
                            title="Narrativa (Engenharia de Enredo)"
                            details={[
                                "7 Estruturas Clássicas: Testamos seu texto contra a Jornada do Herói, Metodologia Save the Cat, Kishotenketsu e outras.",
                                "Gráfico de Progressão: Visualize onde a tensão sobe e onde o ritmo desacelera.",
                                "Validação de Etapas: Entenda se o seu Incidente Incitante ou Clímax estão posicionados no momento ideal."
                            ]}
                            image="/narrative_engineering_section_1768238528009.png"
                            reversed={false}
                        />

                        <AnatomySection
                            icon={<Users className="text-teal" />}
                            title="Psicologia dos Personagens"
                            details={[
                                "Arco de Evolução: Seu protagonista mudou do ponto A ao ponto B? Nós rastreamos essa mudança.",
                                "Impacto Narrativo: Avaliamos o peso que cada personagem exerce no enredo principal.",
                                "Pontos Fortes e Fraquezas: Identificamos se as motivações são críveis e se há profundidade psicológica."
                            ]}
                            image="/character_psychology_section_1768238546748.png"
                            reversed={true}
                        />

                        <AnatomySection
                            icon={<MessageSquare className="text-violet" />}
                            title="Linguagem e Atmosfera"
                            details={[
                                "Eficiência de Subtexto: Medimos o que é dito 'nas entrelinhas' e a qualidade dos diálogos.",
                                "Tom e Atmosfera: Descobrimos se o seu texto é Melancólico, Épico, Sombrio ou Satírico através de marcadores lexicais.",
                                "Vocabulário: Analisamos se o nível de complexidade das palavras está alinhado ao público-alvo."
                            ]}
                            image="/language_atmosphere_section_1768238604456.png"
                            reversed={false}
                        />

                        <AnatomySection
                            icon={<PenTool className="text-teal" />}
                            title="Prescrição Literária"
                            details={[
                                "Dicas de Reescrita: Sugestões práticas de como reconstruir cenas ou frases específicas.",
                                "Foco de Edição: Indicamos qual parte da sua técnica deve ser priorizada no próximo rascunho.",
                                "Próximos Passos: Um mapa estratégico para finalizar sua obra com qualidade profissional."
                            ]}
                            image="/literary_prescription_section_1768238493798.png"
                            reversed={true}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-violet/5 border-t border-violet/10">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <BrainCircuit className="w-16 h-16 text-violet mx-auto mb-8 animate-pulse" />
                    <h2 className="text-3xl md:text-4xl font-title font-bold mb-8">Agora que você conhece a ciência, que tal começar a incisão?</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={onStart}
                            className="w-full sm:w-auto px-10 py-5 bg-violet text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-violet/20"
                        >
                            Começar Autópsia Grátis
                        </button>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all font-sans uppercase tracking-[0.2em] text-xs"
                        >
                            Voltar ao Topo
                        </button>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-[var(--border-main)] text-center opacity-40 text-xs">
                <p>© 2026 Autópsia Literária 2.0 • A precisão de um editor, a velocidade da luz.</p>
            </footer>
        </div>
    );
};

const StepCard: React.FC<{ number: string, icon: React.ReactNode, title: string, description: string }> = ({ number, icon, title, description }) => (
    <div className="relative z-10 p-8 glass-card border-none bg-[var(--card-bg)] hover:-translate-y-2 group transition-all">
        <div className="absolute -top-6 -right-6 text-6xl font-black text-white/5 group-hover:text-violet/10 transition-colors uppercase">{number}</div>
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            {React.cloneElement(icon as React.ReactElement, { size: 30 })}
        </div>
        <h3 className="text-xl font-title font-bold mb-4">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </div>
);

const AnatomySection: React.FC<{ icon: React.ReactNode, title: string, details: string[], image: string, reversed: boolean }> = ({ icon, title, details, image, reversed }) => (
    <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20`}>
        <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl">
                    {React.cloneElement(icon as React.ReactElement, { size: 24 })}
                </div>
                <h3 className="text-2xl md:text-3xl font-title font-bold text-[var(--text-primary)]">{title}</h3>
            </div>
            <ul className="space-y-4">
                {details.map((detail, i) => {
                    const [label, text] = detail.split(': ');
                    return (
                        <li key={i} className="flex gap-4 group">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet shrink-0 group-hover:scale-150 transition-transform"></div>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                <strong className="text-[var(--text-primary)]">{label}:</strong> {text}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
        <div className="flex-1 w-full aspect-video md:aspect-square relative group">
            <div className="absolute inset-0 bg-violet/20 rounded-[2rem] blur-2xl group-hover:blur-3xl transition-all opacity-0 group-hover:opacity-100"></div>
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src={image} alt={title} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-page)]/80 to-transparent"></div>
            </div>
        </div>
    </div>
);
