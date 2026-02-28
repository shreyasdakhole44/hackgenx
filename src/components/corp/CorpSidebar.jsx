import React from 'react';
import {
    LayoutDashboard,
    ClipboardList,
    BrainCircuit,
    Users,
    Settings,
    LogOut,
    Zap,
    ChevronRight,
    Shield,
    Heart,
    Gavel,
    AlertCircle
} from 'lucide-react';

const CorpSidebar = ({ activeTab, setActiveTab, role }) => {
    const sidebarItems = [
        { id: 'DASHBOARD', icon: <LayoutDashboard size={20} />, label: 'Analytics', roles: ['Admin', 'Officer', 'Engineer'] },
        { id: 'GRIEVANCES', icon: <ClipboardList size={20} />, label: 'Grievances', roles: ['Admin', 'Officer'] },
        { id: 'DEPARTMENTS', icon: <Users size={20} />, label: 'Departments', roles: ['Admin'] },
        { id: 'NERVOUS_SYSTEM', icon: <BrainCircuit size={20} />, label: 'Urban AI (CNS)', roles: ['Admin', 'Engineer'] },
        { id: 'IMPACT', icon: <Heart size={20} />, label: 'Citizen Impact', roles: ['Admin', 'Officer'] },
        { id: 'DECISIONS', icon: <Gavel size={20} />, label: 'Admin Decisions', roles: ['Admin', 'Officer'] },
        { id: 'EMERGENCY', icon: <AlertCircle size={20} />, label: 'Emergency Log', roles: ['Admin', 'Officer'] },
        { id: 'SETTINGS', icon: <Settings size={20} />, label: 'Control Center', roles: ['Admin'] },
    ];

    const filteredItems = sidebarItems.filter(item => item.roles.includes(role));

    return (
        <div className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col p-6 shadow-xl shadow-slate-200/50">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="w-10 h-10 bg-pmc-blue rounded-xl flex items-center justify-center text-white ring-4 ring-pmc-blue/5">
                    <Zap size={22} fill="white" className="text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tighter text-pmc-blue">PMC CORP</h1>
                    <p className="text-[9px] uppercase font-black text-pmc-accent tracking-[0.2em]">Neural Governance</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 px-4 mb-4">Command Center</p>
                {filteredItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${activeTab === item.id
                            ? 'bg-linear-to-r from-pmc-blue to-pmc-accent text-white shadow-xl shadow-pmc-blue/20'
                            : 'hover:bg-slate-50 text-slate-400 hover:text-pmc-blue'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <span className={`${activeTab === item.id ? 'text-white' : 'group-hover:text-pmc-accent transition-colors'}`}>
                                {item.icon}
                            </span>
                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        </div>
                        {activeTab === item.id && <ChevronRight size={14} className="text-white/50" />}
                    </button>
                ))}
            </nav>

            {/* System Status Mock */}
            <div className="mt-auto mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                    <Shield size={14} className="text-pmc-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Status</span>
                </div>
                <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-pmc-accent animate-pulse"></div>
                </div>
                <p className="text-[9px] text-slate-400 mt-2 font-mono">FIVE-NINE ACTIVE</p>
            </div>

            {/* Logout */}
            <button className="flex items-center gap-4 px-4 py-4 text-slate-400 hover:text-red-500 transition-colors rounded-2xl hover:bg-red-50 group">
                <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="font-bold text-sm">Terminate Session</span>
            </button>
        </div>
    );
};

export default CorpSidebar;
