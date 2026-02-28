import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Award,
    Lock,
    Vote,
    History,
    ChevronRight,
    Zap,
    Activity,
    ShieldCheck,
    TrendingUp
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

const CitizenImpactPanel = () => {
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('SUMMARY'); // SUMMARY, VOTING, HISTORY

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) return;

                const res = await fetch(`${API_BASE_URL}/api/impact/credits`, {
                    headers: {
                        'Authorization': `Bearer ${userInfo.token}`
                    }
                });
                const data = await res.json();
                setCredits(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch credits", error);
            }
        };
        fetchCredits();
    }, []);

    const votingOptions = [
        { id: 'TREES', label: 'Tree Plantation 🌱', icon: '🌳', desc: 'Add green cover to sector 4.' },
        { id: 'BENCHES', label: 'Park Benches 🪑', icon: '🪑', desc: 'Seating for Saras Baug park.' },
        { id: 'LIGHTS', label: 'Solar Street Lights 💡', icon: '☀️', desc: 'Eco-friendly night safety.' },
        { id: 'ROAD', label: 'Road Patching 🛣️', icon: '🏗️', desc: 'Repair critical baner potholes.' }
    ];

    const handleVote = async (option) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`${API_BASE_URL}/api/impact/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ wardId: 'WARD_P04', option })
            });
            if (res.ok) {
                // Refresh credit data
                const cRes = await fetch(`${API_BASE_URL}/api/impact/credits`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                const cData = await cRes.json();
                setCredits(cData);
                alert('Vote cast successfully!');
            } else {
                const err = await res.json();
                alert(err.message);
            }
        } catch (error) {
            console.error("Voting failed", error);
        }
    };

    const handleInvest = async (category, serviceName, amount = 1) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`${API_BASE_URL}/api/impact/spend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ category, serviceName, amount })
            });

            if (res.ok) {
                // Refresh
                const cRes = await fetch(`${API_BASE_URL}/api/impact/credits`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                const cData = await cRes.json();
                setCredits(cData);
                alert(`Successfully invested ${amount} credit in ${serviceName}!`);
            } else {
                const err = await res.json();
                alert(err.message);
            }
        } catch (error) {
            console.error("Investment failed", error);
        }
    };

    if (loading) return <div className="p-10 text-slate-400 font-black uppercase tracking-widest text-center animate-pulse">Establishing Secure Neural Uplink...</div>;

    return (
        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50">
            {/* Header */}
            <div className="p-8 bg-linear-to-r from-pmc-blue to-pmc-accent text-white flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
                        <Award className="text-pmc-accent" />
                        Civic Impact Hub
                    </h3>
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-1">Verified Community Contribution System</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                    <span className="text-[9px] font-black uppercase tracking-widest text-pmc-accent block">Total Balance</span>
                    <span className="text-xl font-black tracking-tight">{credits?.totalCredits || 0} CIVIC</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex border-b border-slate-100 p-2">
                {['SUMMARY', 'VOTING', 'HISTORY'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-2xl ${activeTab === tab ? 'bg-slate-50 text-pmc-blue shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="p-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'SUMMARY' && (
                        <motion.div
                            key="summary"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Purpose Locked Credits */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { key: 'taxUtility', label: 'Tax Utility', sub: 'Property & Water', val: credits?.lockedCredits?.taxUtility, icon: <Activity className="text-blue-500" /> },
                                    { key: 'healthcare', label: 'Healthcare', sub: 'Clinic Subsidies', val: credits?.lockedCredits?.healthcare, icon: <ShieldCheck className="text-green-500" />, action: () => handleInvest('healthcare', 'Local Clinic Subsidy') },
                                    { key: 'developmentVoting', label: 'Ward Voting', sub: 'Dev Priority', val: credits?.lockedCredits?.developmentVoting, icon: <Vote className="text-pmc-accent" />, action: () => setActiveTab('VOTING') }
                                ].map((box, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-3xl group hover:border-pmc-accent/30 transition-all flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-white rounded-2xl shadow-sm">{box.icon}</div>
                                                <Lock size={12} className="text-slate-300" />
                                            </div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{box.label}</h4>
                                            <p className="text-2xl font-black text-slate-800 tracking-tight">{box.val || 0} <span className="text-xs text-slate-400 font-bold">PTS</span></p>
                                            <p className="text-[8px] text-slate-400 font-bold uppercase mt-2">{box.sub}</p>
                                        </div>
                                        {box.action && (
                                            <button
                                                onClick={box.action}
                                                className="mt-6 w-full py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-pmc-blue hover:bg-pmc-blue hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 group/btn"
                                            >
                                                {box.key === 'healthcare' ? 'Invest Credits' : 'Vote Now'}
                                                <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-orange-50 border border-orange-100 rounded-4xl flex items-center gap-5">
                                <Zap className="text-orange-500" size={24} />
                                <div>
                                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Digital Constraint Notice</p>
                                    <p className="text-xs font-bold text-orange-900 leading-tight uppercase italic">
                                        "Credits cannot be cashed. Purpose-locked for exclusive civic use and tax remediation."
                                    </p>
                                </div>
                            </div>

                            {/* Trust Signals */}
                            <div className="flex flex-wrap gap-2">
                                <span className="px-4 py-2 bg-green-50 text-green-600 border border-green-100 rounded-xl text-[9px] font-black uppercase tracking-widest">Verified Contributor</span>
                                <span className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-[9px] font-black uppercase tracking-widest">Community Impactor</span>
                                <span className="px-4 py-2 bg-pmc-accent/5 text-pmc-accent border border-pmc-accent/20 rounded-xl text-[9px] font-black uppercase tracking-widest">Accuracy Level: 98%</span>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'VOTING' && (
                        <motion.div
                            key="voting"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-black uppercase tracking-tight text-slate-400">Ward Development Priorities</h4>
                                <span className="text-[10px] font-black text-pmc-accent uppercase tracking-widest">Voting Cost: 1.0 Credit</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {votingOptions.map((opt) => (
                                    <div key={opt.id} className="bg-slate-50 border border-slate-100 p-6 rounded-3xl hover:border-pmc-accent transition-all group flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-4xl">{opt.icon}</span>
                                            <button
                                                onClick={() => handleVote(opt.label)}
                                                className="px-4 py-2 bg-pmc-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pmc-accent transition-all shadow-lg shadow-pmc-blue/20"
                                            >
                                                Vote
                                            </button>
                                        </div>
                                        <div>
                                            <h5 className="font-black text-slate-800 tracking-tight">{opt.label}</h5>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">{opt.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'HISTORY' && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {credits?.history?.length > 0 ? (
                                credits.history.slice().reverse().map((item, i) => (
                                    <div key={i} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${item.credits > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {item.credits > 0 ? <TrendingUp size={16} /> : <Lock size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.reason}</p>
                                                <p className="text-[9px] text-slate-400 uppercase font-black mt-1">
                                                    {new Date(item.date).toLocaleDateString()} {item.complaintId && `• ${item.complaintId}`}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-black ${item.credits > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.credits > 0 ? `+${item.credits}` : item.credits}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 text-slate-300 font-black uppercase tracking-[0.3em]">No history detected in neural link.</div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CitizenImpactPanel;
