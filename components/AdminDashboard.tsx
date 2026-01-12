import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Trash2,
    ShieldCheck,
    Zap,
    ZapOff,
    FileText,
    RefreshCcw,
    ArrowRight,
    ChevronLeft,
    Calendar,
    Layers,
    ShieldAlert,
    Loader2
} from 'lucide-react';
import { authService } from '../services/authService';
import { User, AnalysisResult } from '../types';

interface AdminDashboardProps {
    onSelectAnalysis: (analysis: AnalysisResult) => void;
    onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectAnalysis, onBack }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ totalUsers: 0, proUsers: 0, totalAnalyses: 0 });
    const [selectedUserAnalyses, setSelectedUserAnalyses] = useState<any[] | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersData, statsData] = await Promise.all([
                authService.getAllUsers(),
                authService.getSystemStats()
            ]);
            setUsers(usersData);
            setStats(statsData);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTogglePro = async (user: User) => {
        setActionLoading(user.id);
        try {
            await authService.updateUserPermissions(user.id, { isPro: !user.isPro });
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isPro: !u.isPro } : u));
            setStats(prev => ({ ...prev, proUsers: user.isPro ? prev.proUsers - 1 : prev.proUsers + 1 }));
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleAdmin = async (user: User) => {
        if (!confirm(`Deseja realmente ${user.isAdmin ? 'REMOVER' : 'ADICIONAR'} privilégios de administrador para ${user.name}?`)) return;

        setActionLoading(user.id);
        try {
            await authService.updateUserPermissions(user.id, { isAdmin: !user.isAdmin });
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u));
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteUser = async (user: User) => {
        if (!confirm(`CUIDADO: Deseja apagar permanentemente a conta de ${user.name}? Esta ação não pode ser desfeita.`)) return;

        setActionLoading(user.id);
        try {
            await authService.deleteUserAccount(user.id);
            setUsers(prev => prev.filter(u => u.id !== user.id));
        } finally {
            setActionLoading(null);
        }
    };

    const handleViewAnalyses = async (user: User) => {
        setViewingUser(user);
        setActionLoading(`view-${user.id}`);
        try {
            const analyses = await authService.getUserAnalyses(user.id);
            setSelectedUserAnalyses(analyses);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-violet animate-spin" />
                <p className="text-[var(--text-secondary)] font-medium">Carregando painel de controle...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[var(--text-muted)] hover:text-violet transition-colors mb-4 uppercase text-[10px] font-black tracking-[0.2em]"
                    >
                        <ChevronLeft size={14} />
                        Voltar ao Início
                    </button>
                    <h1 className="text-4xl font-title font-bold text-[var(--text-primary)] mb-2">Painel Admin</h1>
                    <p className="text-[var(--text-secondary)]">Gestão total da plataforma Autópsia Literária</p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-3 rounded-xl glass border border-white/10 hover:border-violet/30 text-[var(--text-secondary)] transition-all flex items-center gap-2"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Atualizar Dados
                </button>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<Users className="text-blue-400" />}
                    label="Total de Usuários"
                    value={stats.totalUsers}
                    color="blue"
                />
                <StatCard
                    icon={<Zap className="text-amber-400" />}
                    label="Assinantes PRO"
                    value={stats.proUsers}
                    color="amber"
                />
                <StatCard
                    icon={<Layers className="text-violet" />}
                    label="Autópsias Realizadas"
                    value={stats.totalAnalyses}
                    color="violet"
                />
            </div>

            {/* User List */}
            <div className="glass overflow-hidden rounded-[2rem] border border-white/10">
                <div className="p-8 border-b border-white/10 flex flex-col md:flex-row justify-between gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <ShieldCheck className="text-violet" />
                        Lista de Usuários
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 outline-none focus:border-violet transition-all w-full md:w-80"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest">
                                <th className="px-8 py-4">Usuário</th>
                                <th className="px-8 py-4">E-mail</th>
                                <th className="px-8 py-4 text-center">Plan</th>
                                <th className="px-8 py-4 text-center">Role</th>
                                <th className="px-8 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-inner ${user.isAdmin ? 'bg-violet/20 text-violet' : 'bg-white/10 text-[var(--text-secondary)]'}`}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-[var(--text-primary)]">{user.name}</div>
                                                <div className="text-[10px] text-[var(--text-muted)] opacity-50">Logado: {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('pt-BR') : 'Sem data'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-[var(--text-secondary)]">{user.email}</td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${user.isPro ? 'bg-amber-400/10 text-amber-400' : 'bg-white/5 text-[var(--text-muted)]'}`}>
                                            {user.isPro ? 'PRO' : 'Free'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${user.isAdmin ? 'bg-violet/10 text-violet' : 'bg-white/5 text-[var(--text-muted)]'}`}>
                                            {user.isAdmin ? 'Admin' : 'Membro'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ActionButton
                                                onClick={() => handleViewAnalyses(user)}
                                                icon={<FileText size={16} />}
                                                label="Ver Análises"
                                                loading={actionLoading === `view-${user.id}`}
                                            />
                                            <ActionButton
                                                onClick={() => handleTogglePro(user)}
                                                icon={user.isPro ? <ZapOff size={16} /> : <Zap size={16} />}
                                                label={user.isPro ? "Remover PRO" : "Tornar PRO"}
                                                loading={actionLoading === user.id}
                                                variant={user.isPro ? 'danger' : 'success'}
                                            />
                                            <ActionButton
                                                onClick={() => handleToggleAdmin(user)}
                                                icon={<ShieldCheck size={16} />}
                                                label={user.isAdmin ? "Remover Admin" : "Tornar Admin"}
                                                loading={actionLoading === user.id}
                                            />
                                            <ActionButton
                                                onClick={() => handleDeleteUser(user)}
                                                icon={<Trash2 size={16} />}
                                                label="Excluir Usuário"
                                                variant="danger"
                                                loading={actionLoading === user.id}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Analysis Inspector (Overlay/Drawer) */}
            {viewingUser && (
                <div className="fixed inset-0 z-[110] flex items-center justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingUser(null)} />
                    <div className="relative w-full max-w-2xl h-full glass border-l border-white/10 p-10 overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl">
                        <button
                            onClick={() => setViewingUser(null)}
                            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8 uppercase text-xs font-black tracking-widest"
                        >
                            <ChevronLeft size={16} />
                            Voltar para Lista
                        </button>

                        <div className="mb-10">
                            <h3 className="text-3xl font-title font-bold text-[var(--text-primary)] mb-2">Histórico de {viewingUser.name}</h3>
                            <p className="text-[var(--text-secondary)]">{viewingUser.email}</p>
                        </div>

                        <div className="space-y-4">
                            {!selectedUserAnalyses ? (
                                <div className="p-10 text-center text-[var(--text-muted)] flex flex-col items-center gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                    Carregando autópsias...
                                </div>
                            ) : selectedUserAnalyses.length === 0 ? (
                                <div className="p-20 text-center text-[var(--text-muted)] flex flex-col items-center gap-4 bg-white/5 rounded-3xl">
                                    <ShieldAlert size={40} className="opacity-20" />
                                    Este usuário ainda não realizou nenhuma análise.
                                </div>
                            ) : (
                                selectedUserAnalyses.map((analysis, i) => (
                                    <div key={i} className="p-6 glass-card border-white/5 hover:border-violet/30 transition-all flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-violet/10 rounded-2xl flex items-center justify-center text-violet font-black">
                                                {analysis.score || '??'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[var(--text-primary)]">{analysis.overview?.title || 'Sem Título'}</h4>
                                                <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-black opacity-50 mt-1">
                                                    <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(analysis.timestamp).toLocaleDateString('pt-BR')}</span>
                                                    <span>•</span>
                                                    <span>{analysis.genre?.primary || 'Gênero Indefinido'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onSelectAnalysis(analysis)}
                                            className="p-2.5 rounded-xl bg-white/5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all hover:bg-violet hover:text-white"
                                        >
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Supporting Components
const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: number, color: string }> = ({ icon, label, value, color }) => (
    <div className="glass p-8 border border-white/10 hover:border-white/20 transition-all rounded-[2rem]">
        <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-2xl bg-white/5 shadow-inner`}>
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-70">{label}</span>
        </div>
        <div className="text-4xl font-title font-bold text-[var(--text-primary)]">{value}</div>
    </div>
);

const ActionButton: React.FC<{ onClick: () => void, icon: React.ReactNode, label: string, variant?: 'default' | 'danger' | 'success', loading?: boolean }> = ({ onClick, icon, label, variant = 'default', loading }) => {
    const colorClass = variant === 'danger' ? 'hover:bg-red-500/20 hover:text-red-400' : variant === 'success' ? 'hover:bg-green-500/20 hover:text-green-400' : 'hover:bg-violet/20 hover:text-violet';

    return (
        <button
            onClick={onClick}
            title={label}
            disabled={loading}
            className={`p-2.5 rounded-xl bg-white/5 text-[var(--text-muted)] transition-all flex items-center justify-center ${colorClass} disabled:opacity-30`}
        >
            {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
        </button>
    );
};
