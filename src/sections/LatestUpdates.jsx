import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bell, Calendar, ChevronRight } from 'lucide-react';

const LatestUpdates = () => {
    const alerts = [
        { category: "Recruitment", title: "Officer Shreyas appointed as Nodal Intelligence Head in UrbanPulse.", date: "Feb 23, 2026", color: "pmc-accent" },
        { category: "Property Tax", title: "GIS-based Property Tax mapping for year 2026-27 is now LIVE.", date: "Feb 22, 2026", color: "pmc-saffron" },
        { category: "Tenders", title: "Invitation of Tenders for UrbanPulse E-Governance platform maintenance.", date: "Feb 20, 2026", color: "pmc-blue" },
        { category: "Health", title: "Water supply update for Kothrud and Bavdhan areas for coming Thursday.", date: "Feb 18, 2026", color: "pmc-orange" }
    ];

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-pmc-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="gov-container relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-20">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-effect border-slate-200 mb-6">
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-pmc-blue">Real-time Feed</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-pmc-blue tracking-tighter leading-tight">
                            Digital <span className="text-gradient">Bulletin Board</span>
                        </h2>
                    </div>
                    <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-50 text-pmc-blue font-black uppercase text-xs tracking-widest hover:bg-pmc-blue hover:text-white transition-all duration-500 group">
                        Explore All Notices
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {alerts.map((alert, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="premium-card p-8 group relative flex flex-col h-full bg-slate-50/50"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-3 rounded-2xl bg-white shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                    <Bell size={18} className="text-pmc-accent" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{alert.category}</span>
                            </div>

                            <h4 className="text-xl font-bold text-slate-900 leading-tight mb-8 group-hover:text-pmc-accent transition-colors">
                                {alert.title}
                            </h4>

                            <div className="mt-auto pt-8 border-t border-slate-200/60 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Calendar size={12} />
                                    {alert.date}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-pmc-accent group-hover:text-white transition-all duration-500">
                                    <ArrowRight size={14} />
                                </div>
                            </div>

                            {/* Hover Decorative Element */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-pmc-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestUpdates;

