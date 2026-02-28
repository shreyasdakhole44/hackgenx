import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, MessageSquare, Share2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config';

const CorporateDecisions = () => {
    const [decisions, setDecisions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDecisions = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/news`);
                const data = await res.json();
                // Filter for "Corporate" or "Important" news items to represent decisions
                const filtered = data.filter(item =>
                    item.important === true ||
                    item.category.toLowerCase().includes('decision') ||
                    item.category.toLowerCase().includes('corp')
                );
                setDecisions(filtered);
                setLoading(false);
            } catch (error) {
                console.error("Decision fetch failed:", error);
                setLoading(false);
            }
        };
        fetchDecisions();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-3xl" />
                ))}
            </div>
        );
    }

    if (decisions.length === 0) {
        return (
            <div className="bg-white border border-slate-200 p-12 rounded-4xl text-center">
                <AlertTriangle className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-slate-400">No recent corporate decisions found.</h3>
                <p className="text-sm text-slate-300 mt-2">Checking the municipal nervous system for updates...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {decisions.map((item, i) => (
                <motion.div
                    key={item._id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-slate-200 p-8 rounded-[2.5rem] group hover:border-pmc-blue/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-pmc-blue/5 text-pmc-blue text-[9px] font-black uppercase tracking-widest rounded-lg border border-pmc-blue/10">
                                    {item.category}
                                </span>
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                                    <Calendar size={12} />
                                    {item.date}
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-pmc-blue transition-colors mb-4">
                                {item.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                {item.content}
                            </p>

                            <div className="flex items-center gap-6">
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pmc-blue hover:gap-3 transition-all">
                                    Read Full Disclosure <ChevronRight size={14} />
                                </button>
                                <div className="h-4 w-px bg-slate-200" />
                                <div className="flex gap-4">
                                    <Share2 size={16} className="text-slate-300 hover:text-pmc-accent transition-colors" />
                                    <MessageSquare size={16} className="text-slate-300 hover:text-pmc-blue transition-colors" />
                                </div>
                            </div>
                        </div>

                        {item.important && (
                            <div className="w-12 h-12 bg-pmc-accent/10 rounded-2xl flex items-center justify-center text-pmc-accent shrink-0">
                                <ShieldCheck size={24} />
                            </div>
                        )}
                    </div>

                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                        <ShieldCheck size={100} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default CorporateDecisions;
