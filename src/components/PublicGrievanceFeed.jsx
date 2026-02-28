import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListFilter, MapPin, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';

const PublicGrievanceFeed = () => {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeed = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/impact/public-feed`);
            const data = await res.json();
            setFeed(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch public feed:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const statusColors = {
        'Resolved': 'bg-green-500/10 text-green-600 border-green-200',
        'Archived': 'bg-slate-500/10 text-slate-600 border-slate-200',
        'Reported': 'bg-red-500/10 text-red-600 border-red-200',
        'AI Classified': 'bg-pmc-blue/10 text-pmc-blue border-pmc-blue/20',
        'Pending Verification': 'bg-orange-500/10 text-orange-600 border-orange-200'
    };

    return (
        <div className="bg-white border border-slate-200 rounded-4xl p-8 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-pmc-blue tracking-tight uppercase">Live Accountability Feed</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time complaint status from MongoDB</p>
                </div>
                <button
                    onClick={fetchFeed}
                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-pmc-blue transition-all"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 max-h-[500px]">
                {loading && feed.length === 0 ? (
                    [1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl" />
                    ))
                ) : (
                    feed.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl hover:border-pmc-blue/20 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-pmc-blue bg-pmc-blue/5 px-2 py-0.5 rounded border border-pmc-blue/10">
                                        {item.category}
                                    </span>
                                    <span className="text-[9px] font-mono text-slate-400 font-bold">#{item.grievanceId}</span>
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded border ${statusColors[item.status] || 'bg-slate-100 text-slate-500'}`}>
                                    {item.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-slate-500 font-bold text-[11px]">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={12} className="text-slate-300" />
                                        {item.location}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} className="text-slate-300" />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.status === 'Resolved' ? <CheckCircle size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-slate-200" />}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
                <button className="w-full py-3 bg-slate-50 text-slate-400 hover:text-pmc-blue hover:bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all">
                    View Full Public Archive
                </button>
            </div>
        </div>
    );
};

export default PublicGrievanceFeed;
