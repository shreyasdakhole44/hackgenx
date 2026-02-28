import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const FloatingAnnouncement = () => {
    const [latestDecision, setLatestDecision] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLatestDecision = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/news`);
                const data = await res.json();
                // Get the most recent "important" decision
                const importantOnes = data.filter(item => item.important === true);
                if (importantOnes.length > 0) {
                    setLatestDecision(importantOnes[0]);
                    // Show after a small delay
                    setTimeout(() => setIsVisible(true), 2000);
                }
            } catch (error) {
                console.error("Announcement fetch failed:", error);
            }
        };
        fetchLatestDecision();
    }, []);

    if (!latestDecision) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 50 }}
                    className="fixed bottom-10 right-10 z-100 max-w-sm"
                >
                    <div className="bg-white border border-slate-200 rounded-4xl p-6 shadow-2xl shadow-pmc-blue/20 relative overflow-hidden group">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pmc-accent/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                        >
                            <X size={14} />
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-pmc-blue rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-pmc-blue/30">
                                <Megaphone size={20} />
                            </div>

                            <div className="pr-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-pmc-accent flex items-center gap-1">
                                        <Zap size={10} fill="currentColor" />
                                        Corporate Decision
                                    </span>
                                </div>
                                <h4 className="text-sm font-black text-slate-800 tracking-tight leading-tight mb-2">
                                    {latestDecision.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 font-bold line-clamp-2 mb-4 leading-relaxed">
                                    {latestDecision.content}
                                </p>

                                <button
                                    onClick={() => navigate('/transparency-portal')}
                                    className="px-4 py-2 bg-slate-50 hover:bg-pmc-blue hover:text-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                >
                                    Review Disclosure <ChevronRight size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingAnnouncement;
