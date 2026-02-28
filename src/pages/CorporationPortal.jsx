import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    ShieldAlert,
    CheckCircle2,
    Clock,
    BrainCircuit,
    Map,
    AlertTriangle,
    UserX,
    Eye,
    CheckCircle,
    Search,
    Menu,
    X,
    Bell,
    Database,
    Layers,
    Cpu,
    Target
} from 'lucide-react';
import { API_BASE_URL } from '../config';

import CorpSidebar from '../components/corp/CorpSidebar';
import CorpHeader from '../components/corp/CorpHeader';
import DepartmentGrid from '../components/corp/DepartmentGrid';
import GrievanceTable from '../components/corp/GrievanceTable';
import UrbanNervousSystem from '../components/UrbanNervousSystem';
import ImpactDashboard from '../components/corp/ImpactDashboard';
import DecisionForm from '../components/corp/DecisionForm';

const CorporationPortal = () => {
    const [activeTab, setActiveTab] = useState('DASHBOARD');
    const [userRole, setUserRole] = useState('Admin'); // 'Admin', 'Officer', 'Engineer'
    const [grievances, setGrievances] = useState([]);
    const [stats, setStats] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [offline, setOffline] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [gRes, sRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/grievances`),
                fetch(`${API_BASE_URL}/api/grievances/stats/departments`)
            ]);
            const gData = await gRes.json();
            const sData = await sRes.json();
            setGrievances(Array.isArray(gData) ? gData : []);
            setStats(Array.isArray(sData) ? sData : []);
            setLoading(false);
        } catch (error) {
            console.error("handshake_failed:", error);
            setOffline(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSolveGrievance = async (grievanceId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/grievances/${grievanceId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Resolved' })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Resolution failed:", error);
        }
    };

    // Department filtering
    const filteredGrievances = grievances.filter(g => {
        const roleMatch = userRole === 'Officer' ? g.department === 'Roads' : true;
        const deptMatch = selectedDepartment ? (g.department === selectedDepartment || g.category === selectedDepartment) : true;
        return roleMatch && deptMatch;
    });

    return (
        <div className="min-h-screen bg-pmc-bg flex font-sans text-slate-900 selection:bg-pmc-accent/10 overflow-hidden relative">
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* System Sidebar - Drawer on mobile, Static on desktop */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out w-72 bg-white border-r border-slate-200 flex flex-col h-screen ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'} lg:translate-x-0`}>
                <CorpSidebar
                    activeTab={activeTab}
                    setActiveTab={(tab) => {
                        setActiveTab(tab);
                        setIsSidebarOpen(false);
                    }}
                    role={userRole}
                />
            </aside>

            <div className="flex-1 h-screen overflow-y-auto custom-scrollbar bg-pmc-bg">
                <div className="p-4 md:p-10">
                    <div className="lg:hidden mb-6 flex items-center justify-between">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-pmc-blue shadow-sm"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-pmc-blue rounded-lg flex items-center justify-center text-white">
                                <Zap size={16} fill="white" />
                            </div>
                            <span className="font-black text-sm text-pmc-blue">PMC CORP</span>
                        </div>
                    </div>

                    <CorpHeader
                        activeTab={activeTab}
                        userRole={userRole}
                        setUserRole={setUserRole}
                        isOffline={offline}
                    />

                    <AnimatePresence mode="wait">
                        {activeTab === 'DASHBOARD' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="space-y-8 pb-12"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Neural Alerts', value: filteredGrievances.length > 0 ? filteredGrievances.filter(g => g.priorityScore > 80).length : 0, icon: <ShieldAlert className="text-red-500" />, trend: 'CRITICAL', color: 'red' },
                                        { label: 'Synced Nodes', value: filteredGrievances.length || 0, icon: <CheckCircle2 className="text-green-600" />, trend: 'HEALTHY', color: 'green' },
                                        { label: 'AI Priority Avg', value: filteredGrievances.length > 0 ? Math.round(filteredGrievances.reduce((acc, g) => acc + (g.priorityScore || 0), 0) / (filteredGrievances.length || 1)) : 0, icon: <BrainCircuit className="text-pmc-accent" />, trend: 'STABLE', color: 'pmc-accent' },
                                        { label: 'Latency', value: '1.2s', icon: <Clock className="text-blue-500" />, trend: 'NOMINAL', color: 'blue' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white border border-slate-200 p-6 rounded-[2.2rem] group hover:border-pmc-accent/30 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-200/50">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                                                <span className={`text-[9px] font-black px-2 py-1 rounded-lg border border-${stat.color}-500/20 bg-${stat.color}-500/5 text-${stat.color}-400 uppercase tracking-widest`}>
                                                    {stat.trend}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] mb-1">{stat.label}</p>
                                            <h3 className="text-3xl font-black tracking-tighter group-hover:text-pmc-blue transition-colors text-slate-800">{stat.value}</h3>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-12 gap-8">
                                    <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 p-6 md:p-8 rounded-4xl relative overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                                        <div className="absolute inset-0 bg-linear-to-tr from-pmc-accent/5 via-transparent to-transparent pointer-events-none" />
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-pmc-accent animate-pulse" />
                                                <h4 className="font-black text-xl tracking-tight uppercase">Urban Dynamics Flux</h4>
                                            </div>
                                            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                                {['LIVESTREAM', 'HISTORICAL'].map(mode => (
                                                    <button key={mode} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'LIVESTREAM' ? 'bg-pmc-blue text-white shadow-lg' : 'text-slate-400'}`}>
                                                        {mode}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-48 md:h-72 flex items-end justify-between px-2 md:px-4 pb-4 relative z-10 gap-1">
                                            {[6, 8, 4, 10, 7, 9, 5, 8, 12, 6, 8, 5].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h * 8}%` }}
                                                    transition={{ delay: i * 0.05, duration: 1, ease: "circOut" }}
                                                    className="w-full max-w-[40px] bg-linear-to-t from-pmc-blue/20 to-pmc-accent/60 rounded-t-2xl relative group/bar hover:to-white transition-all duration-300"
                                                >
                                                    <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-pmc-blue text-white text-[9px] font-black px-2 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                                                        NDX {h * 10}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 p-8 rounded-4xl group relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                                        <h4 className="font-black text-xl mb-8 tracking-tight uppercase text-slate-800">City Pulse Map</h4>
                                        <div className="h-64 bg-slate-50 rounded-4xl border border-slate-100 relative overflow-hidden flex items-center justify-center group-hover:border-pmc-accent/30 transition-all">
                                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                                <div className="absolute top-1/4 left-1/4 w-12 h-12 border border-slate-200 rounded-full" />
                                                <div className="absolute bottom-1/3 right-1/4 w-32 h-32 border border-slate-200 rounded-full" />
                                                <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-1 border border-slate-100" />
                                            </div>
                                            <Map size={48} className="text-slate-200 group-hover:text-pmc-accent/20 transition-all group-hover:scale-110 duration-500" />
                                            <div className="absolute top-20 left-10 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
                                            <div className="absolute bottom-12 right-24 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] shadow-green-500" />
                                            <div className="absolute top-1/2 right-10 w-2 h-2 bg-pmc-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] shadow-pmc-accent" />
                                        </div>
                                        <div className="mt-8 space-y-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Sector Clusters</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['Sector 4/A', 'Central Hub', 'Industrial North'].map(s => (
                                                    <span key={s} className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 border border-slate-100">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black uppercase tracking-tighter text-pmc-blue">
                                            {selectedDepartment ? `${selectedDepartment} Node Stream` : 'Departmental Nodes'}
                                        </h3>
                                        {selectedDepartment && (
                                            <button
                                                onClick={() => setSelectedDepartment(null)}
                                                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-pmc-blue hover:bg-white transition-all shadow-sm"
                                            >
                                                Back to Overview
                                            </button>
                                        )}
                                        <div className="h-px flex-1 bg-slate-200 ml-4" />
                                    </div>
                                    <DepartmentGrid
                                        grievances={grievances}
                                        stats={stats}
                                        onSelectDepartment={setSelectedDepartment}
                                        selectedDepartment={selectedDepartment}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'GRIEVANCES' && (
                            <motion.div
                                key="grievances"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="h-full min-h-[500px]"
                            >
                                <GrievanceTable
                                    grievances={filteredGrievances}
                                    isOffline={offline}
                                    role={userRole}
                                    onSolve={handleSolveGrievance}
                                />
                            </motion.div>
                        )}

                        {activeTab === 'NERVOUS_SYSTEM' && (
                            <motion.div
                                key="cns"
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                            >
                                <UrbanNervousSystem grievances={filteredGrievances} />
                            </motion.div>
                        )}

                        {activeTab === 'DECISIONS' && (
                            <motion.div
                                key="decisions"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                <DecisionForm />
                            </motion.div>
                        )}

                        {activeTab === 'DEPARTMENTS' && (
                            <motion.div
                                key="departments"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="space-y-8 pb-32"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">Municipal Nodes</h2>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Departmental Performance & Resource Distribution</p>
                                    </div>
                                    <div className="max-w-md p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                                        <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                                            The Corporation Portal synchronizes all 12 major municipal departments into a single neural bridge. Each node represents a dedicated response team.
                                            Real-time monitoring ensures that high-priority nodes receive immediate resource allocation.
                                        </p>
                                    </div>
                                </div>
                                <DepartmentGrid
                                    grievances={grievances}
                                    stats={stats}
                                    onSelectDepartment={setSelectedDepartment}
                                    selectedDepartment={selectedDepartment}
                                />
                                {selectedDepartment && (
                                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10">
                                        <h3 className="text-xl font-black mb-6 text-pmc-blue tracking-tight uppercase">{selectedDepartment} Queue</h3>
                                        <GrievanceTable
                                            grievances={filteredGrievances}
                                            isOffline={offline}
                                            role={userRole}
                                            onSolve={handleSolveGrievance}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'IMPACT' && (
                            <motion.div
                                key="impact"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="pb-32"
                            >
                                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">Citizen Impact Analytics</h2>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Community Trust Metrics & Engagement Velocity</p>
                                    </div>
                                    <div className="max-w-xs p-5 bg-pmc-accent/5 rounded-2xl border border-pmc-accent/10">
                                        <p className="text-[11px] font-bold text-pmc-blue/70 leading-tight">
                                            Citizen impact tracks the "Civic Trust Coefficient" based on successful report verifications and community voting patterns on resolving grievances.
                                        </p>
                                    </div>
                                </div>
                                <ImpactDashboard />
                            </motion.div>
                        )}

                        {activeTab === 'EMERGENCY' && <EmergencyManager />}

                        {activeTab === 'SETTINGS' && <ControlCenter />}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// Control Center / Settings Component
const ControlCenter = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">Neural Control Center</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">System Protocols & Distributed Node Configuration</p>
                    <div className="mt-4 max-w-lg p-5 bg-slate-100 rounded-2xl border border-slate-200">
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                            System Control enables administrative overrides for critical node routing. Configure the neural bridge thresholds for automated escalation and AI decision weighting.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-pmc-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pmc-accent transition-all shadow-lg">Save Config</button>
                    <button className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Reboot Core</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white border border-slate-200 rounded-4xl p-8 shadow-sm">
                        <h3 className="text-lg font-black text-slate-800 mb-8 uppercase tracking-tight">Active API Nodes</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Main Backend Cluster', status: 'Online', latency: '24ms', load: '12%' },
                                { name: 'AI Analytics Gateway', status: 'Online', latency: '142ms', load: '45%' },
                                { name: 'Grievance Socket Relay', status: 'Online', latency: '8ms', load: '8%' },
                                { name: 'Database Replication Hub', status: 'Online', latency: '2ms', load: '4%' },
                            ].map((node, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-pmc-accent/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="font-bold text-sm text-slate-700">{node.name}</span>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Latency</p>
                                            <p className="text-xs font-black text-slate-800">{node.latency}</p>
                                        </div>
                                        <div className="text-right w-16">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Load</p>
                                            <p className="text-xs font-black text-slate-800">{node.load}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-white/5 rounded-4xl p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><BrainCircuit size={120} /></div>
                        <h3 className="text-xl font-black mb-6 uppercase tracking-tight relative z-10">System Audit Logs</h3>
                        <div className="space-y-4 font-mono text-[10px] text-white/40 relative z-10">
                            <p><span className="text-green-500">[OK]</span> 20:45:12 - Handshake established with Groq AI Neural Bridge.</p>
                            <p><span className="text-pmc-accent">[INFO]</span> 20:46:01 - Sector 4 Priority Flux detected. Re-routing engineer nodes.</p>
                            <p><span className="text-green-500">[OK]</span> 20:47:15 - Monthly credit ledger reconciled for 1,240 active nodes.</p>
                            <p><span className="text-yellow-500">[WARN]</span> 20:48:33 - High latency on external maps API. Switching to fallback.</p>
                            <p><span className="text-pmc-accent">[INFO]</span> 20:49:17 - Corporation Admin "shreyas@123" session initialized.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white border border-slate-200 rounded-4xl p-8 shadow-sm">
                        <h3 className="text-md font-black text-slate-800 mb-6 uppercase tracking-tight">Security Protocol</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">2FA Enforcement</span>
                                <div className="w-12 h-6 bg-pmc-blue rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Neural Encryption</span>
                                <div className="w-12 h-6 bg-pmc-blue rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                            </div>
                            <div className="flex items-center justify-between opacity-50">
                                <span className="text-xs font-bold text-slate-500">Public API Access</span>
                                <div className="w-12 h-6 bg-slate-200 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-pmc-blue rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
                        <Zap size={32} className="text-pmc-accent mb-6" />
                        <h4 className="text-lg font-black mb-2 uppercase">Neural Health</h4>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">The city brain is functioning within nominal parameters (Efficiency: 96.4%).</p>
                        <div className="mt-8 flex gap-2">
                            <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"><div className="h-full w-4/5 bg-pmc-accent" /></div>
                            <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"><div className="h-full w-full bg-pmc-accent" /></div>
                            <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"><div className="h-full w-2/5 bg-pmc-accent" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const EmergencyManager = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [outcome, setOutcome] = useState('');

    const fetchEmergencies = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`${API_BASE_URL}/api/emergency`, {
                headers: {
                    'Authorization': userInfo ? `Bearer ${userInfo.token}` : ''
                }
            });
            const data = await res.json();
            setEmergencies(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            setEmergencies([]);
        }
    };

    useEffect(() => {
        fetchEmergencies();
    }, []);

    const handleAction = async (id, status) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await fetch(`${API_BASE_URL}/api/emergency/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userInfo ? `Bearer ${userInfo.token}` : ''
                },
                body: JSON.stringify({ status, outcome })
            });
            setSelected(null);
            setOutcome('');
            fetchEmergencies();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-32">
            <div className="flex flex-col md:flex-row items-center justify-between bg-red-50 border border-red-100 p-6 md:p-8 rounded-[2.5rem] gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-600/20">
                        <ShieldAlert size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-red-600 tracking-tighter uppercase">Emergency Command</h2>
                        <p className="text-[10px] text-red-400 font-black uppercase tracking-[0.2em]">Restricted Protocols</p>
                    </div>
                </div>
                <div className="px-6 py-3 bg-white border border-red-200 rounded-xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    <span className="text-[11px] font-black text-red-600 uppercase tracking-widest">{emergencies.length} Alerts</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {emergencies.map((emg) => (
                    <div key={emg._id} className="bg-white border border-slate-200 rounded-4xl p-6 md:p-8 hover:shadow-xl transition-all group">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                            <div className="flex items-center gap-4">
                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${emg.type === 'Women Emergency' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}>
                                    {emg.type}
                                </span>
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-mono">ID: {emg.referenceId}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${emg.status === 'Reported' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {emg.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Description</p>
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{emg.description}</p>
                                </div>
                                {emg.officerDetails && (
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                        <UserX size={18} className="text-red-400" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Target Details</p>
                                            <p className="text-sm font-black text-slate-800">{emg.officerDetails}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-slate-400 text-[11px] font-black uppercase">
                                    <Clock size={14} />
                                    {new Date(emg.createdAt).toLocaleString()}
                                </div>

                                {selected === emg._id ? (
                                    <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                                        <textarea
                                            value={outcome}
                                            onChange={(e) => setOutcome(e.target.value)}
                                            placeholder="Enter intervention details..."
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-[12px] font-bold focus:outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={() => handleAction(emg._id, 'Under Investigation')} className="flex-1 py-3 bg-pmc-blue text-white rounded-xl text-[10px] font-black uppercase transition-all">Investigate</button>
                                            <button onClick={() => handleAction(emg._id, 'Action Taken')} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase transition-all">Resolve</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => setSelected(emg._id)} className="w-full md:w-auto flex items-center justify-center gap-3 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase transition-all">
                                        <Eye size={16} />
                                        Take Command
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default CorporationPortal;
