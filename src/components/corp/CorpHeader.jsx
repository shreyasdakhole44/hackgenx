import React from 'react';
import { Search, Bell, User, Cpu, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const CorpHeader = ({ activeTab, userRole, setUserRole, isOffline }) => {
    return (
        <div className="flex justify-between items-center mb-12 relative">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-black tracking-tighter capitalize text-pmc-blue">
                        {activeTab.replace('_', ' ').toLowerCase()}
                    </h2>
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-pmc-accent uppercase tracking-widest shadow-sm">
                        Node v4.2
                    </span>
                </div>
                <p className="text-slate-400 text-sm font-medium">Neural Bridge Protocol & AI Analytics</p>
            </div>

            {/* AI Connection Status */}
            {isOffline && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute left-1/2 -translate-x-1/2 top-[-20px] bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-2xl flex items-center gap-3 backdrop-blur-md"
                >
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
                        Neural Bridge Offline: Run `npm run server`
                    </span>
                </motion.div>
            )}

            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search Pulse Ledger..."
                        className="bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:outline-none focus:border-pmc-accent/50 w-64 transition-all focus:w-80 shadow-sm placeholder:text-slate-300 text-slate-800"
                    />
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pmc-accent transition-colors" />
                </div>

                {/* Role Switcher (Simulator) */}
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                    {['Admin', 'Officer', 'Engineer'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setUserRole(role)}
                            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${userRole === role
                                ? 'bg-pmc-blue text-white shadow-lg'
                                : 'text-slate-300 hover:text-slate-600'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                    <div className="text-right">
                        <p className="text-sm font-black text-pmc-blue">Officer Shreyas</p>
                        <div className="flex items-center gap-1.5 justify-end">
                            <div className="w-1.5 h-1.5 rounded-full bg-pmc-accent"></div>
                            <p className="text-[9px] uppercase font-black text-pmc-accent tracking-widest">{userRole}</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm p-0.5 relative group cursor-pointer hover:scale-105 transition-transform">
                        <div className="w-full h-full rounded-[0.9rem] flex items-center justify-center bg-slate-50 overflow-hidden">
                            <User size={24} className="text-slate-300" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-pmc-accent rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                            <ShieldCheck size={8} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CorpHeader;
