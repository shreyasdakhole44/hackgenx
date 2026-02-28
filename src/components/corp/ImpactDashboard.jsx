import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Heart,
    Zap,
    BarChart3,
    Globe,
    ShieldCheck,
    TrendingUp,
    Map as MapIcon
} from 'lucide-react';
import CityPulseHeatmap from '../CityPulseHeatmap';
import { API_BASE_URL } from '../../config';

const ImpactDashboard = () => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [stats, setStats] = useState({
        activeCitizens: 0,
        totalActions: 0,
        trustindex: 92,
        participationRate: 14.2
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/impact/heatmap`);
                const data = await res.json();
                setHeatmapData(data);

                // Mocking other stats for demo
                setStats({
                    activeCitizens: 1240,
                    totalActions: 8421,
                    trustindex: 94,
                    participationRate: 18.5
                });
            } catch (error) {
                console.error("Heatmap fetch failed", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Stat Bar */}
            <div className="grid grid-cols-4 gap-6">
                {[
                    { label: 'Active Contributors', value: stats.activeCitizens, icon: <Users />, color: 'blue' },
                    { label: 'Verified Engagements', value: stats.totalActions, icon: <ShieldCheck />, color: 'green' },
                    { label: 'Community Trust', value: `${stats.trustindex}%`, icon: <Heart />, color: 'red' },
                    { label: 'Engagement Growth', value: `+${stats.participationRate}%`, icon: <TrendingUp />, color: 'pmc-accent' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-6 rounded-[2.2rem] group hover:border-pmc-accent/30 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform text-slate-400 group-hover:text-pmc-blue">{stat.icon}</div>
                            <Zap size={10} className="text-slate-200" />
                        </div>
                        <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black tracking-tighter text-slate-800">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Heatmap Visualization */}
                <div className="col-span-8 bg-white border border-slate-200 p-8 rounded-4xl shadow-sm overflow-hidden relative">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h4 className="font-black text-xl tracking-tight uppercase flex items-center gap-3">
                                <Globe className="text-pmc-accent" />
                                City Pulse Heatmap
                            </h4>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Grievance Density & Priority Stress Correlation</p>
                        </div>
                        <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                            {['LIVESTREAM', 'HISTORICAL'].map(mode => (
                                <button key={mode} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'LIVESTREAM' ? 'bg-pmc-blue text-white shadow-lg' : 'text-slate-400'}`}>
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    <CityPulseHeatmap data={heatmapData} height="500px" />
                </div>

                {/* Ward Comparison / Engagement Leaderboard */}
                <div className="col-span-4 space-y-8">
                    <div className="bg-white border border-slate-200 p-8 rounded-4xl shadow-sm group">
                        <h4 className="font-black text-xl mb-8 tracking-tight uppercase text-slate-800 flex items-center gap-3">
                            <BarChart3 className="text-pmc-accent" size={20} />
                            Ward Participation
                        </h4>
                        <div className="space-y-6">
                            {[
                                { name: 'Ward P04 (Baner)', val: 82, color: 'pmc-blue' },
                                { name: 'Ward K08 (Kothrud)', val: 65, color: 'pmc-accent' },
                                { name: 'Ward V12 (Viman Nagar)', val: 42, color: 'slate-300' },
                                { name: 'Ward M03 (Magarpatta)', val: 38, color: 'slate-300' }
                            ].map((ward, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-600">{ward.name}</span>
                                        <span className="text-slate-400">{ward.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${ward.val}%` }}
                                            className={`h-full bg-${ward.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-white hover:text-pmc-blue transition-all">
                            Download Detailed Engagement Report
                        </button>
                    </div>

                    <div className="bg-linear-to-br from-pmc-blue to-pmc-accent rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
                            <MapIcon size={100} />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-tight mb-4">Strategic Insight</h4>
                        <p className="text-xs font-bold leading-relaxed italic text-white/80">
                            "Reward-based participation in Ward P04 has led to a 24% reduction in recurring potholes through proactive citizen reporting."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImpactDashboard;
