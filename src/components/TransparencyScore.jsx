import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Users, Info, Calculator } from 'lucide-react';
import { API_BASE_URL } from '../config';

const TransparencyScore = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/impact/transparency-metrics`);
                const result = await res.json();
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch transparency metrics:", error);
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return <div className="h-64 bg-slate-50 animate-pulse rounded-4xl" />;
    if (!data) return null;

    return (
        <div className="bg-white border border-slate-200 rounded-4xl p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
            {/* Decorative Math Symbols */}
            <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none select-none">
                <Calculator size={160} />
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                {/* Main Score Circle */}
                <div className="relative w-40 h-40 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-slate-100"
                        />
                        <motion.circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={440}
                            initial={{ strokeDashoffset: 440 }}
                            animate={{ strokeDashoffset: 440 - (440 * data.overallScore) / 100 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="text-pmc-blue"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-pmc-blue tracking-tighter">{data.overallScore}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Index</span>
                    </div>
                </div>

                {/* Score Breakdown */}
                <div className="flex-1 space-y-6">
                    <div>
                        <h4 className="text-xl font-black text-pmc-blue tracking-tight uppercase mb-1">Accountable Math</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-6">Real-time data from MongoDB Audit Logs</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.breakdown.map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                                    <span className="text-xs font-black text-pmc-blue">{item.value}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ delay: i * 0.2, duration: 1 }}
                                        className="h-full bg-pmc-accent"
                                    />
                                </div>
                                <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
                                    <Info size={10} />
                                    {item.calculation} (W: {item.weight})
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="flex gap-6">
                    <span className="text-slate-400">Total Encounters: <span className="text-pmc-blue">{data.totalReports}</span></span>
                    <span className="text-slate-400">Resolved Nodes: <span className="text-pmc-blue">{data.totalResolved}</span></span>
                </div>
                <div className="flex items-center gap-2 text-pmc-accent">
                    <div className="w-2 h-2 rounded-full bg-pmc-accent animate-pulse" />
                    Live Audit Sync
                </div>
            </div>
        </div>
    );
};

export default TransparencyScore;
