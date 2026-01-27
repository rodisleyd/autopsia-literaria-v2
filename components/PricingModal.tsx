import React from 'react';
import { X, Check, Sparkles, CreditCard, Zap } from 'lucide-react';
import { X, Check, Sparkles, CreditCard, Zap } from 'lucide-react';
import { createCheckoutSession, STRIPE_PRICES } from '../services/stripeService';

interface PricingModalProps {
    onClose: () => void;
    onSelectPlan: (planId: 'unitario' | 'mensal') => void;
    proOnly?: boolean;
    analysisId?: string;
}

export const PricingModal: React.FC<PricingModalProps> = ({ onClose, onSelectPlan, proOnly, analysisId }) => {
    const [loading, setLoading] = React.useState<string | null>(null);

    const handlePurchase = async (planKey: 'unitario' | 'mensal') => {
        try {
            setLoading(planKey);

            // Map internal plan keys to Stripe Price IDs
            const priceId = planKey === 'unitario'
                ? STRIPE_PRICES.ONE_TIME_AUTOPSY
                : STRIPE_PRICES.SUBSCRIPTION_MONTHLY;

            // If buying a specific analysis (not subscription), save ID to link after payment
            if (planKey === 'unitario' && analysisId) {
                localStorage.setItem('pending_payment_aid', analysisId);
            }

            await createCheckoutSession(priceId);



        } catch (error) {
            console.error('Erro ao iniciar checkout:', error);
            alert('Erro ao iniciar o pagamento. Tente novamente.');
            setLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start md:justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
            <div className="relative w-full max-w-3xl glass border border-white/20 rounded-[2rem] animate-in zoom-in-95 duration-300 my-auto">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all z-[110]"
                    aria-label="FECHAR"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-6 md:p-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet/10 text-violet text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-violet/20">
                            <Sparkles className="w-3.5 h-3.5 mr-2" />
                            Desbloqueie seu potencial máximo
                        </div>
                        <h2 className="text-3xl md:text-4xl font-title font-bold text-[var(--text-primary)] mb-3">
                            Escolha seu <span className="text-violet">Plano PRO</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] text-base max-w-lg mx-auto">
                            Exporte relatórios ilimitados, acesse métricas avançadas e imortalize sua obra hoje mesmo.
                        </p>
                    </div>

                    <div className={`grid md:grid-cols-${proOnly ? '1 max-w-md mx-auto' : '2'} gap-6 lg:gap-8 py-4`}>
                        {/* Unitary Plan */}
                        {!proOnly && (
                            <div className="glass-card flex flex-col p-8 border-white/10 hover:border-violet/30 transition-all group">
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-black uppercase tracking-widest opacity-50">Autópsia Única</span>
                                        <div className="p-2 rounded-lg bg-white/5 text-[var(--text-muted)]">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-title font-bold text-[var(--text-primary)]">R$ 5,99</span>
                                        <span className="text-[var(--text-muted)] text-sm">/análise</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-10 flex-grow">
                                    <PricingFeature text="Análise Completa da Obra" />
                                    <PricingFeature text="Exportação PDF Premium" />
                                    <PricingFeature text="Acesso aos 7 Modelos Narrativos" />
                                    <PricingFeature text="Métricas de Ritmo e Tom" />
                                    <PricingFeature text="Histórico na Área de Membros" />
                                </ul>
                                <button
                                    onClick={() => handlePurchase('unitario')}
                                    disabled={!!loading}
                                    className="w-full py-4 border border-white/10 rounded-xl font-bold text-[var(--text-primary)] hover:bg-white/5 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {loading === 'unitario' ? (
                                        <span className="animate-spin mr-2">⏳</span>
                                    ) : null}
                                    {loading === 'unitario' ? 'Processando...' : 'Comprar Acesso Único'}
                                </button>
                            </div>
                        )}
                        {/* Monthly Plan */}
                        <div className="glass-card flex flex-col p-8 border-violet/30 bg-violet/[0.03] relative overflow-hidden group scale-105 shadow-[0_20px_60px_rgba(139,92,246,0.15)]">
                            <div className="absolute top-0 right-0 bg-violet text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-[0.2em] z-10">
                                Mais Popular
                            </div>
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-violet/10 via-transparent to-teal/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <div className="mb-6 relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-black uppercase tracking-widest text-violet">Assinatura Mensal</span>
                                    <div className="p-2 rounded-lg bg-violet/20 text-violet">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-title font-bold text-[var(--text-primary)]">R$ 9,90</span>
                                    <span className="text-[var(--text-muted)] text-sm">/mês</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow relative z-10">
                                <PricingFeature text="Análises Profissionais Ilimitadas" highlight />
                                <PricingFeature text="Exportações PDF Ilimitadas" highlight />
                                <PricingFeature text="Dashboard de Evolução do Autor" highlight />
                                <PricingFeature text="Suporte Prioritário" highlight />
                                <PricingFeature text="Novas Funções Antecipadas" highlight />
                            </ul>
                            <button
                                onClick={() => handlePurchase('mensal')}
                                disabled={!!loading}
                                className="w-full py-4 bg-violet text-white rounded-xl font-bold transition-all text-base shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] hover:scale-[1.02] active:scale-95 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {loading === 'mensal' ? (
                                    <span className="animate-spin mr-2">⏳</span>
                                ) : null}
                                {loading === 'mensal' ? 'Processando...' : 'Assinar Agora'}
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 text-center flex flex-col items-center gap-4">
                        <p className="text-[var(--text-muted)] text-sm">
                            Pagamento seguro via Stripe ou PIX. Cancele sua assinatura a qualquer momento.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-slate-500 hover:text-violet dark:text-slate-400 dark:hover:text-violet transition-all text-xs font-black uppercase tracking-[0.2em] border border-transparent hover:border-violet/20 bg-transparent hover:bg-violet/5 active:scale-95"
                        >
                            TALVEZ MAIS TARDE, VOLTAR AO RELATÓRIO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PricingFeature: React.FC<{ text: string, highlight?: boolean }> = ({ text, highlight }) => (
    <li className="flex items-center text-sm md:text-base">
        <div className={`mr-3 p-1 rounded-full ${highlight ? 'bg-violet/20 text-violet' : 'bg-white/5 text-[var(--text-muted)]'}`}>
            <Check className="w-3.5 h-3.5" />
        </div>
        <span className={highlight ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}>
            {text}
        </span>
    </li>
);
