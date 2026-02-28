import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, ShieldCheck, Info, ChevronRight, Hash, CheckCircle2, MapPin, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';

const DecisionOfTheWeek = () => {
    const [decision, setDecision] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDecision = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/impact/decision-of-the-week`);
                const data = await res.json();
                if (res.ok) {
                    setDecision(data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch decision of the week:", error);
                setLoading(false);
            }
        };
        fetchDecision();
    }, []);

    if (loading) {
        return <div className="h-[600px] bg-slate-50 animate-pulse rounded-4xl" />;
    }

    if (!decision) return null;

    const isOfficialProject = decision.type === 'OFFICIAL_PROJECT';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-pmc-blue/10 rounded-4xl p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden group"
        >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-pmc-blue text-white mb-10 shadow-xl shadow-pmc-blue/20">
                <Award size={18} fill="white" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Decision of the Week</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
                {/* Left Side: Summary & Why it Wins (7 cols) */}
                <div className="lg:col-span-7 space-y-12">
                    <div>
                        <h2 className="text-5xl font-black text-pmc-blue tracking-tighter leading-[0.9] mb-6">
                            {isOfficialProject ? decision.title : `${decision.category} Resolution`}
                        </h2>
                        <div className="flex items-center gap-6 text-slate-400 text-[13px] font-bold">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-pmc-accent" />
                                {isOfficialProject ? 'Corporation Office' : decision.department}
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                {isOfficialProject ? 'City-Wide Initiative' : decision.location}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Info size={20} className="text-pmc-accent" />
                            <h4 className="font-black text-xl tracking-tight uppercase">Why this decision wins</h4>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed text-lg mb-8 italic">
                            "{decision.content || decision.description}"
                        </p>
                        <div className="space-y-4">
                            {[
                                { label: 'Selection Logic', val: decision.selectionReason },
                                { label: 'Trust Impact', val: isOfficialProject ? 'Public Infrastructure Milestone' : 'Community-Verified Accuracy' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl">
                                    <div className="text-[10px] font-black text-pmc-blue uppercase tracking-widest min-w-[120px]">{item.label}</div>
                                    <div className="text-[12px] font-bold text-slate-500">{item.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Explainable Decision Timeline (5 cols) */}
                <div className="lg:col-span-5 flex flex-col">
                    <div className="bg-pmc-blue/5 border-2 border-pmc-blue/10 rounded-[2.5rem] p-10 flex-1 relative">
                        <div className="absolute top-10 right-10 text-pmc-blue/10">
                            <Clock size={80} />
                        </div>

                        <h3 className="text-xl font-black text-pmc-blue uppercase tracking-tight mb-10 flex items-center gap-3">
                            <RefreshCw size={20} />
                            Explainable Timeline
                        </h3>

                        <div className="space-y-10 relative ml-4">
                            <div className="absolute top-0 bottom-0 left-[-21px] w-0.5 bg-pmc-blue/20" />

                            {decision.timeline.map((log, i) => (
                                <div key={i} className="relative">
                                    <div className={`absolute left-[-26px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${i === decision.timeline.length - 1 ? 'bg-pmc-accent' : 'bg-pmc-blue'}`} />
                                    <div>
                                        <p className="text-[12px] font-black text-pmc-blue uppercase tracking-tight mb-1">{log.action}</p>
                                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                                            <span className="font-mono text-slate-300">ID: {log.id.toString().substring(log.id.toString().length - 8)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-pmc-blue/10">
                            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-slate-100">
                                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</p>
                                    <p className="text-sm font-black text-slate-800">SECURE_IMMUTABLE_LOG</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DecisionOfTheWeek;
