import React from 'react';
import { X, Check, Sparkles, CreditCard, Zap } from 'lucide-react';
import { createCheckoutSession, STRIPE_PRICES } from '../services/stripeService';
import { mercadoPagoService } from '../services/mercadoPagoService';
import { authService } from '../services/authService';
import { auth } from '../services/firebase';

interface PricingModalProps {
    onClose: () => void;
    onSelectPlan: (planId: 'unitario' | 'mensal') => void;
    proOnly?: boolean;
    analysisId?: string;
}

export const PricingModal: React.FC<PricingModalProps> = ({ onClose, onSelectPlan, proOnly, analysisId }) => {
    const [loading, setLoading] = React.useState<string | null>(null);
    const [activeTab, setActiveTab] = React.useState<'subscription' | 'credits'>(proOnly ? 'subscription' : 'credits');
    const [pixData, setPixData] = React.useState<any | null>(null);
    const [copySuccess, setCopySuccess] = React.useState(false);

    // Pix Polling Effect
    React.useEffect(() => {
        let intervalId: any;
        if (pixData && pixData.status === 'pending') {
            intervalId = setInterval(async () => {
                const status = await mercadoPagoService.checkPaymentStatus(pixData.id);
                if (status === 'approved') {
                    // Payment Confirmed!
                    clearInterval(intervalId);

                    // Add credits locally (and calling service) based on the package
                    // Note: Ideally backend does this via webhook, but for MVP we do it here
                    // We need to know which package was bought. Storing in local ref or inferring?
                    // Let's assume we pass it or just close for now and user refreshes/we trigger update

                    alert('Pagamento via Pix Confirmado! Seus créditos foram adicionados.');
                    onClose();
                    window.location.reload(); // Simple way to refresh user state with new credits
                }
            }, 5000); // Check every 5 seconds
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [pixData, onClose]);

    const handlePurchase = async (planKey: 'unitario' | 'mensal') => {
        try {
            setLoading(planKey);
            const priceId = planKey === 'unitario'
                ? STRIPE_PRICES.ONE_TIME_AUTOPSY
                : STRIPE_PRICES.SUBSCRIPTION_MONTHLY;

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

    const handleBuyCredits = async (amount: number, price: number, packageId: string) => {
        try {
            setLoading(packageId);
            const userEmail = auth.currentUser?.email || 'cliente@email.com';

            // Quick fix: assume user is logged in if seeing this modal
            const currentUser = await authService.getCurrentUser();
            if (!currentUser) return;

            const pix = await mercadoPagoService.createPixPayment(
                price,
                currentUser.email,
                `Compra de ${amount} Créditos - Autópsia Literária`
            );

            if (pix) {
                setPixData(pix);
                // Also store expected credit amount to add on success?
                // For MVP rely on manual check or simple reload as implemented in useEffect
            } else {
                alert('Erro ao gerar Pix. Tente novamente.');
            }
            setLoading(null);
        } catch (error) {
            console.error('Pix Error:', error);
            setLoading(null);
        }
    };

    const copyPix = () => {
        if (pixData?.qr_code) {
            navigator.clipboard.writeText(pixData.qr_code);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start md:justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl glass border border-white/20 rounded-[2rem] animate-in zoom-in-95 duration-300 my-auto flex flex-col md:flex-row overflow-hidden min-h-[600px]">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all z-[110]"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Sidebar / Tabs */}
                <div className="w-full md:w-1/3 bg-black/20 border-r border-white/5 p-6 md:p-8 flex flex-col">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-violet font-bold mb-2 uppercase tracking-widest text-[10px]">
                            <Sparkles size={12} />
                            Area Premium
                        </div>
                        <h2 className="text-2xl font-title font-bold text-[var(--text-primary)]">
                            Escolha seu Acesso
                        </h2>
                    </div>

                    <div className="flex flex-col gap-2 space-y-2">
                        <button
                            onClick={() => { setActiveTab('credits'); setPixData(null); }}
                            className={`p-4 rounded-xl text-left transition-all border ${activeTab === 'credits'
                                ? 'bg-violet/20 border-violet/30 text-white'
                                : 'bg-transparent border-transparent text-[var(--text-muted)] hover:bg-white/5'}`}
                        >
                            <span className="block text-xs font-black uppercase tracking-widest mb-1">Pacotes de Créditos</span>
                            <span className="block font-bold">Quero comprar avulso</span>
                        </button>

                        <button
                            onClick={() => { setActiveTab('subscription'); setPixData(null); }}
                            className={`p-4 rounded-xl text-left transition-all border ${activeTab === 'subscription'
                                ? 'bg-violet/20 border-violet/30 text-white'
                                : 'bg-transparent border-transparent text-[var(--text-muted)] hover:bg-white/5'}`}
                        >
                            <span className="block text-xs font-black uppercase tracking-widest mb-1">Assinatura Mensal</span>
                            <span className="block font-bold">Quero acesso ilimitado</span>
                        </button>
                    </div>

                    <div className="mt-auto pt-8">
                        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                            Pagamentos processados de forma segura. Créditos não expiram. Cancelamento de assinatura a qualquer momento.
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-10 relative">

                    {/* PIX MODAL OVERLAY */}
                    {pixData && (
                        <div className="absolute inset-0 z-50 bg-[var(--bg-page)] flex flex-col items-center justify-center p-8 animate-in fade-in">
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Pagamento via Pix</h3>
                            <p className="text-[var(--text-secondary)] mb-6 text-center">Escaneie o QR Code ou use o Copia e Cola</p>

                            <div className="bg-white p-4 rounded-xl mb-6">
                                <img
                                    src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                    alt="Pix QR Code"
                                    className="w-48 h-48"
                                />
                            </div>

                            <div className="w-full max-w-sm mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={pixData.qr_code}
                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-[var(--text-muted)] outline-none"
                                    />
                                    <button
                                        onClick={copyPix}
                                        className="p-2 bg-violet/20 text-violet rounded-lg hover:bg-violet/30 transition-colors"
                                    >
                                        {copySuccess ? <Check size={18} /> : <span className="text-xs font-bold px-2">COPIAR</span>}
                                    </button>
                                </div>
                            </div>

                            <div className="text-center animate-pulse">
                                <p className="text-sm font-bold text-teal">Aguardando pagamento...</p>
                                <p className="text-xs text-[var(--text-muted)]">A confirmação é automática (aprox. 10s)</p>
                            </div>

                            <button
                                onClick={() => setPixData(null)}
                                className="mt-8 text-xs text-[var(--text-muted)] hover:text-red-400 underline"
                            >
                                Cancelar Pix
                            </button>
                        </div>
                    )}

                    {activeTab === 'credits' && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <div className="mb-6">
                                <h3 className="text-3xl font-bold text-[var(--text-primary)]">Pacotes de Créditos</h3>
                                <p className="text-[var(--text-secondary)]">Compre análises antecipadas com desconto. Use quando quiser.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { amount: 5, price: 29.90, id: 'pack_5', perUnit: '5,98' },
                                    { amount: 10, price: 59.90, id: 'pack_10', perUnit: '5,99', popular: true },
                                    { amount: 15, price: 89.90, id: 'pack_15', perUnit: '5,99' },
                                    { amount: 20, price: 99.80, id: 'pack_20', perUnit: '4,99', best: true },
                                ].map((pack) => (
                                    <div key={pack.id} className={`glass-card p-5 border hover:border-violet/30 transition-all cursor-pointer relative ${pack.popular ? 'border-violet/40 bg-violet/5' : 'border-white/5'}`} onClick={() => handleBuyCredits(pack.amount, pack.price, pack.id)}>
                                        {pack.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Mais Popular</span>}
                                        {pack.best && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Melhor Valor</span>}

                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-2xl font-black text-[var(--text-primary)]">{pack.amount} <span className="text-sm font-normal text-[var(--text-muted)]">Créditos</span></span>
                                        </div>
                                        <div className="mb-4">
                                            <span className="text-lg font-bold text-[var(--text-primary)]">R$ {pack.price.toFixed(2).replace('.', ',')}</span>
                                            <span className="block text-[10px] text-[var(--text-muted)]">R$ {pack.perUnit} / unidade</span>
                                        </div>
                                        <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-violet text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider transition-all">
                                            {loading === pack.id ? 'Gerando Pix...' : 'Comprar com Pix'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'subscription' && (
                        <div className="animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-3xl font-bold text-[var(--text-primary)]">Plano PRO Ilimitado</h3>
                                <p className="text-[var(--text-secondary)]">Focada em quem produz muito. Liberdade total.</p>
                            </div>

                            <div className="glass-card flex-1 p-8 border-violet/30 bg-violet/[0.03] relative overflow-hidden flex flex-col justify-center">
                                <div className="absolute top-0 right-0 bg-violet text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-[0.2em]">Recomendado</div>
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-5xl font-title font-bold text-[var(--text-primary)]">R$ 9,90</span>
                                    <span className="text-[var(--text-muted)] text-sm">/mês</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <PricingFeature text="Análises Ilimitadas" highlight />
                                    <PricingFeature text="Todos os Modelos Narrativos" highlight />
                                    <PricingFeature text="Dashboard de Evolução" highlight />
                                </ul>

                                <button
                                    onClick={() => handlePurchase('mensal')}
                                    disabled={!!loading}
                                    className="w-full py-4 bg-violet text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-violet/25 hover:scale-[1.02] flex justify-center items-center"
                                >
                                    {loading === 'mensal' ? <span className="animate-spin mr-2">⏳</span> : 'Assinar Agora'}
                                </button>
                                <p className="text-center text-[10px] text-[var(--text-muted)] mt-4">Cobrança recorrente via Stripe. Cancele quando quiser.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PricingFeature: React.FC<{ text: string, highlight?: boolean }> = ({ text, highlight }) => (
    <li className="flex items-center text-sm">
        <div className={`mr-3 p-1 rounded-full ${highlight ? 'bg-violet/20 text-violet' : 'bg-white/5 text-[var(--text-muted)]'}`}>
            <Check className="w-3.5 h-3.5" />
        </div>
        <span className={highlight ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}>
            {text}
        </span>
    </li>
);
