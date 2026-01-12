import React, { useMemo } from 'react';
import {
    TrendingUp,
    Award,
    BookOpen,
    Lock,
    ChevronLeft,
    Zap,
    LayoutDashboard,
    PieChart as PieChartIcon,
    LineChart as LineChartIcon
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { AnalysisResult, User } from '../types';

interface AuthorEvolutionProps {
    history: AnalysisResult[];
    user: User | null;
    onBack: () => void;
    onUpgrade: () => void;
}

export const AuthorEvolution: React.FC<AuthorEvolutionProps> = ({ history, user, onBack, onUpgrade }) => {
    const isPro = user?.isPro || user?.isAdmin;

    // Process data for charts
    const chartData = useMemo(() => {
        return history
            .slice()
            .reverse() // Chronological order
            .map(item => ({
                date: new Date(item.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                score: item.score,
                title: item.overview.title
            }));
    }, [history]);

    const genreData = useMemo(() => {
        const counts: Record<string, number> = {};
        history.forEach(item => {
            const genre = item.genre.primary;
            counts[genre] = (counts[genre] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [history]);

    const averageScore = useMemo(() => {
        if (history.length === 0) return 0;
        const sum = history.reduce((acc, curr) => acc + curr.score, 0);
        return (sum / history.length).toFixed(1);
    }, [history]);

    const COLORS = ['#8B5CF6', '#34D399', '#3B82F6', '#F59E0B', '#EC4899'];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[var(--text-muted)] hover:text-violet transition-colors mb-4 uppercase text-[10px] font-black tracking-[0.2em]"
                    >
                        <ChevronLeft size={14} />
                        Voltar
                    </button>
                    <h1 className="text-4xl md:text-5xl font-title font-bold text-[var(--text-primary)]">
                        Minha <span className="text-violet">Evolução</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-2">
                        Acompanhe seu crescimento técnico e métricas literárias.
                    </p>
                </div>

                {!isPro && (
                    <button
                        onClick={onUpgrade}
                        className="flex items-center gap-3 px-6 py-3 bg-violet text-white rounded-2xl font-bold hover:bg-violet/80 transition-all shadow-lg active:scale-95"
                    >
                        <Zap size={18} fill="currentColor" />
                        Desbloquear Evolução PRO
                    </button>
                )}
            </div>

            {/* Content Container */}
            <div className={`relative ${!isPro ? 'min-h-[600px]' : ''}`}>
                {/* Overlay for non-pro */}
                {!isPro && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md bg-black/20 rounded-[3rem] border border-white/10 p-8 text-center">
                        <div className="max-w-md animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-violet/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lock size={40} className="text-violet" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Recurso Exclusivo PRO</h2>
                            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                                Visualize seus gráficos de progresso, análise de tendências e histórico de desempenho técnico. Comece sua jornada profissional hoje.
                            </p>
                            <button
                                onClick={onUpgrade}
                                className="w-full py-5 bg-violet text-white rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:scale-[1.02] transition-all"
                            >
                                Assinar Plano PRO
                            </button>
                        </div>
                    </div>
                )}

                {/* Dashboard Grid */}
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${!isPro ? 'opacity-20 select-none grayscale pointer-events-none' : ''}`}>

                    {/* Stats Summary */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatItem
                            icon={<BookOpen className="text-blue-400" />}
                            label="Obras Analisadas"
                            value={history.length}
                        />
                        <StatItem
                            icon={<TrendingUp className="text-violet" />}
                            label="Média Técnica"
                            value={averageScore}
                        />
                        <StatItem
                            icon={<Award className="text-amber-400" />}
                            label="Melhor Score"
                            value={Math.max(...history.map(h => h.score), 0)}
                        />
                    </div>

                    {/* Progress Chart */}
                    <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border-white/10 min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <LineChartIcon className="text-violet" />
                                Curva de Aprendizado
                            </h3>
                            <span className="text-[10px] font-black uppercase text-violet/60 tracking-widest bg-violet/5 px-3 py-1 rounded-full">Score Global</span>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 10]}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(8px)' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#8B5CF6"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorScore)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Genre Distribution */}
                    <div className="glass p-8 rounded-[2.5rem] border-white/10 min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <PieChartIcon className="text-amber-400" />
                                DNA Temático
                            </h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={genreData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        width={80}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {genreData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatItem: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => (
    <div className="glass-card p-8 border-white/5 hover:border-white/10 transition-all">
        <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-white/5 rounded-2xl">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
        </div>
        <div className="text-4xl font-title font-bold text-[var(--text-primary)]">{value}</div>
    </div>
);
