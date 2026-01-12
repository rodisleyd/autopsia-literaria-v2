
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { User, Shield, Zap, Target } from 'lucide-react';

interface Character {
    name: string;
    role: string;
    arc: string;
    strengths: string[];
    weaknesses: string[];
    impact: string;
}

interface CharacterCardProps {
    character: Character;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
    // Mocking radar data based on AI analysis (strengths/weaknesses length or impact keywords)
    const radarData = [
        { subject: 'Impacto', A: (character?.impact?.length || 0) > 50 ? 90 : 70 },
        { subject: 'Arqueotipo', A: 80 },
        { subject: 'Complexidade', A: ((character?.strengths?.length || 0) + (character?.weaknesses?.length || 0)) * 10 },
        { subject: 'Agência', A: (character?.role || '').toLowerCase().includes('protagonista') ? 95 : 60 },
        { subject: 'Evolução', A: (character?.arc?.length || 0) > 100 ? 90 : 50 },
    ];

    return (
        <div className="glass-card flex flex-col h-full border-t-4 border-violet">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <User size={20} className="text-violet" />
                        {character?.name || 'Desconhecido'}
                    </h3>
                    <span className="text-xs font-bold text-violet uppercase tracking-widest">{character?.role || 'Figurante'}</span>
                </div>
            </div>

            <div className="flex-1 space-y-6">
                <div>
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2 block font-sans">Trajetória do Arco</label>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic border-l-2 border-[var(--border-card)] pl-3">
                        "{character?.arc || 'Arco não identificado'}"
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-teal uppercase tracking-widest mb-1 block">Virtudes</label>
                        <ul className="text-xs space-y-1 text-slate-400">
                            {(character?.strengths || []).slice(0, 3).map((s, i) => (
                                <li key={i} className="flex items-center gap-1">
                                    <Shield size={10} className="text-teal" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1 block">Falhas</label>
                        <ul className="text-xs space-y-1 text-slate-400">
                            {(character?.weaknesses || []).slice(0, 3).map((w, i) => (
                                <li key={i} className="flex items-center gap-1">
                                    <Zap size={10} className="text-rose-400" />
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="h-48 -mx-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="var(--border-card)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                            <Radar
                                name={character?.name || 'Personagem'}
                                dataKey="A"
                                stroke="#8b5cf6"
                                fill="#8b5cf6"
                                fillOpacity={0.3}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border-main)]">
                <p className="text-[10px] opacity-50 uppercase tracking-widest font-bold mb-1">Impacto na Trama</p>
                <p className="text-xs opacity-70">{character?.impact || 'Não descrito'}</p>
            </div>
        </div>
    );
};
