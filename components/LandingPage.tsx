import React from 'react';
import { BookOpen, Sparkles, Feather, Shield, PenTool, BarChart3, ChevronRight, FileText } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
    onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
    return (
        <div className="w-full bg-[var(--bg-page)] text-[var(--text-primary)]">
            {/* Hero Section - Full Screen Responsive */}
            <section className="relative min-h-[95vh] md:h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-12 md:py-0">
                {/* Background Image Layer - Desktop Only */}
                <div className="absolute inset-0 z-0 hidden md:block">
                    <img
                        src="https://i.ibb.co/6RkQR15g/imagem-hero.png"
                        alt="Background Hero"
                        className="w-full h-full object-cover select-none pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                {/* Mobile Background Fade - No blocking clicks */}
                <div className="absolute inset-0 z-0 md:hidden bg-gradient-to-b from-violet/20 to-transparent opacity-30 pointer-events-none"></div>

                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
                    {/* Mobile Decorative Image */}
                    <div className="md:hidden w-full max-w-[280px] aspect-video mb-8 shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                        <img
                            src="https://i.ibb.co/6RkQR15g/imagem-hero.png"
                            alt="Visual Decorativo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Tag - Pill (Strictly White on Mobile as per screenshot) */}
                    <div className="inline-flex items-center px-5 py-2 rounded-full bg-white text-black md:bg-white/10 md:glass border border-white/20 md:text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-lg">
                        A Revolução na Crítica Literária
                    </div>

                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-title font-bold leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
                        <span className="text-[var(--text-muted)] md:text-white/60">SUA OBRA SOB <br /> UMA</span> <br className="md:hidden" />
                        <span className="text-[var(--text-primary)] md:text-white">NOVA LUZ</span>
                    </h1>

                    <p className="text-base md:text-lg text-[var(--text-secondary)] md:text-white/90 mb-10 max-w-lg leading-relaxed font-body">
                        A Autópsia Literária usa inteligência artificial avançada para
                        dissecar sua narrativa, personagens e estilo com a precisão
                        de um grande editor.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-[280px] sm:max-w-md pointer-events-auto">
                        <button
                            onClick={onStart}
                            className="w-full sm:w-auto px-8 py-4 bg-[#8B5CF6] text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl group cursor-pointer"
                        >
                            Começar Grátis
                            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={onLogin}
                            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/10 text-black dark:text-white border border-black/5 dark:border-white/20 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md flex items-center justify-center cursor-pointer"
                        >
                            Entrar
                        </button>
                    </div>
                </div>

                {/* Decorative Bottom Fade - No blocking clicks */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bg-page)] to-transparent z-10 pointer-events-none"></div>
            </section>

            {/* Stats/Social Proof */}
            <section className="py-20 border-y border-[var(--border-main)] bg-[var(--bg-page)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: 'Escritores Ativos', value: '5k+' },
                            { label: 'Análises Realizadas', value: '12k+' },
                            { label: 'Acerto Narrativo', value: '98%' },
                            { label: 'Exportações PDF', value: '8k+' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-3xl md:text-4xl font-title font-bold text-violet mb-2">{stat.value}</div>
                                <div className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--text-muted)] font-sans">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 md:py-32 relative bg-[var(--bg-page)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-title font-bold mb-6 text-[var(--text-primary)]">
                            Ferramentas de <span className="text-teal">Alta Performance</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
                            Tudo o que você precisa para transformar seu rascunho em um best-seller.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        <FeatureCard
                            icon={<BookOpen className="text-violet" />}
                            title="7 Estruturas Narrativas"
                            description="Análise automática baseada na Jornada do Herói, Kishōtenketsu, Sete Pontos e muito mais."
                        />
                        <FeatureCard
                            icon={<Feather className="text-teal" />}
                            title="Análise de Estilo"
                            description="Avaliação profunda de vocabulário, ritmo, tom e a eficiência do subtexto em seus diálogos."
                        />
                        <FeatureCard
                            icon={<Sparkles className="text-violet" />}
                            title="Arco de Personagens"
                            description="Identificação de motivações, forças, fraquezas e a evolução de cada protagonista e antagonista."
                        />
                        <FeatureCard
                            icon={<Shield className="text-teal" />}
                            title="Feedback Imparcial"
                            description="Crítica honesta e técnica, livre de vieses emocionais, focada apenas na qualidade literária."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-violet" />}
                            title="Métricas de Ritmo"
                            description="Visualize a intensidade da sua história e descubra onde a narrativa precisa acelerar ou pausar."
                        />
                        <FeatureCard
                            icon={<FileText className="text-teal" />}
                            title="PDF Profissional"
                            description="Exporte relatórios completos e elegantes para compartilhar com editores ou usar como guia."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Teaser */}
            <section className="py-24 md:py-32 bg-violet/5 border-y border-violet/10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-title font-bold mb-12 text-[var(--text-primary)]">Pronto para elevar seu texto?</h2>
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
                        <div className="glass-card text-left border-violet/20">
                            <div className="text-violet font-black mb-2 uppercase tracking-tighter text-xs">Plano Unitário</div>
                            <div className="text-3xl md:text-4xl font-title font-bold mb-4 text-[var(--text-primary)]">R$ 5,99<span className="text-xs font-sans font-normal opacity-50"> /análise</span></div>
                            <ul className="space-y-3 mb-8 text-sm text-[var(--text-secondary)]">
                                <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-violet" /> Análise Profissional Completa</li>
                                <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-violet" /> Exportação PDF Premium</li>
                                <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-violet" /> Histórico Permanente</li>
                            </ul>
                        </div>
                        <div className="glass-card text-left border-teal/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-teal text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest">Melhor Valor</div>
                            <div className="text-teal font-black mb-2 uppercase tracking-tighter text-xs">Assinatura Mensal</div>
                            <div className="text-3xl md:text-4xl font-title font-bold mb-4 text-[var(--text-primary)]">R$ 9,90<span className="text-xs font-sans font-normal opacity-50"> /mês</span></div>
                            <ul className="space-y-3 mb-8 text-sm text-[var(--text-secondary)]">
                                <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-teal" /> Análises Ilimitadas</li>
                                <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-teal" /> Suporte Prioritário</li>
                                <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-teal" /> Acesso a Novas Funções</li>
                            </ul>
                        </div>
                    </div>
                    <button
                        onClick={onStart}
                        className="px-10 py-5 bg-violet text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl cursor-pointer"
                    >
                        Começar Agora
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-[var(--border-main)] text-center opacity-50 text-xs text-[var(--text-secondary)]">
                <p>© 2026 Autópsia Literária 2.0. Desenvolvido para imortalizar grandes histórias.</p>
            </footer>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="glass-card hover:-translate-y-2 transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-violet/10 flex items-center justify-center mb-6">
            {React.cloneElement(icon as React.ReactElement, { size: 24 })}
        </div>
        <h3 className="text-lg md:text-xl font-title font-bold mb-4 text-[var(--text-primary)]">{title}</h3>
        <p className="text-[var(--text-secondary)] leading-relaxed text-xs md:text-sm">
            {description}
        </p>
    </div>
);
