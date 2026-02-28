import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Camera,
    CheckCircle,
    AlertTriangle,
    MapPin,
    Bell,
    Clock,
    Check,
    Shield,
    Mail,
    ArrowRight,
    Trophy,
    User,
    Eye,
    XCircle,
    ThumbsUp,
    ThumbsDown,
    Map as MapIcon,
    Image as ImageIcon,
    CloudRain,
    Zap,
    Target,
    Settings,
    Layers,
    Lock,
    Cpu,
    Database,
    PhoneCall,
    History,
    Search,
    Menu,
    X,
    FileText,
    ShieldAlert
} from 'lucide-react';
import axios from 'axios';

const WorkerPortal = () => {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState('tasks'); // 'tasks', 'predictive', 'dispatch', 'scanner-settings', 'emergency'
    const [activeTab, setActiveTab] = useState('auction'); // 'auction' or 'my-tasks'
    const [selectedTask, setSelectedTask] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanSuccess, setScanSuccess] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [ignoredTasks, setIgnoredTasks] = useState([]);
    const [incomingAlert, setIncomingAlert] = useState(null);

    // NEW AI Superior states
    const [superiorDecisions, setSuperiorDecisions] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [showAICommand, setShowAICommand] = useState(false);
    const [latestAICommand, setLatestAICommand] = useState(null);

    // NEW Advanced states
    const [ghostOverlay, setGhostOverlay] = useState(false);
    const [segmentationMode, setSegmentationMode] = useState(false);
    const [blockchainHash, setBlockchainHash] = useState(null);
    const [emergencyContacts, setEmergencyContacts] = useState({
        name: 'John Doe (Family)',
        phone: '+91 9876543210',
        relation: 'Brother'
    });
    const [isEditingEmergency, setIsEditingEmergency] = useState(false);
    const [tempEmergencyContacts, setTempEmergencyContacts] = useState({ ...emergencyContacts });

    // Get worker info from localStorage or mock
    const [workerInfo, setWorkerInfo] = useState({ name: 'Shreyas (Field Agent)', id: 'W-99' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setWorkerInfo({ name: user.name, id: user._id || 'W-99' });
        }
        fetchGrievances();

        // Simulate new grievance alerts every 45s
        const alertInterval = setInterval(() => {
            simulateIncomingGrievance();
        }, 45000);

        return () => clearInterval(alertInterval);
    }, []);

    const fetchGrievances = async () => {
        try {
            const res = await axios.get('/api/grievances');
            setGrievances(res.data);
            setLoading(false);

            // Check if any new task was assigned to THIS worker by the AI
            const newlyAssigned = res.data.find(g =>
                g.status === 'Worker Assigned' &&
                g.assignedWorker === workerInfo.id &&
                !myTasks.find(mt => mt._id === g._id)
            );

            if (newlyAssigned) {
                setLatestAICommand(newlyAssigned);
                setShowAICommand(true);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchSuperiorData = async () => {
        try {
            const [decisionsRes, leaderboardRes] = await Promise.all([
                axios.get('/api/superior/decisions'),
                axios.get('/api/superior/leaderboard')
            ]);
            setSuperiorDecisions(decisionsRes.data);
            setLeaderboard(leaderboardRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setWorkerInfo({ name: user.name, id: user._id || 'W-99' });
        }
        fetchGrievances();
        fetchSuperiorData();
        const interval = setInterval(() => {
            fetchGrievances();
            fetchSuperiorData();
        }, 30000); // 30s polling for AI decisions
        return () => clearInterval(interval);
    }, []);

    const simulateIncomingGrievance = () => {
        setIncomingAlert({
            id: 'NEW-' + Math.random(),
            title: 'New Pothole Reported',
            location: 'Kothrud, Pune',
            priority: 85
        });
        setTimeout(() => setIncomingAlert(null), 5000);
    };

    const handleClaim = async (grievanceId) => {
        try {
            await axios.put(`/api/grievances/${grievanceId}/assign`, { workerId: workerInfo.id });
            fetchGrievances();
            alert("Task accepted and added to your list!");
        } catch (err) {
            console.error(err);
        }
    };

    const handleIgnore = (id) => {
        setIgnoredTasks([...ignoredTasks, id]);
        if (selectedTask && selectedTask._id === id) setSelectedTask(null);
    };

    const startAICamera = () => {
        setIsScanning(true);
        setScanSuccess(false);
        setScanProgress(0);

        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setScanSuccess(true);
                    return 100;
                }
                return prev + 5;
            });
        }, 150);
    };

    const handleSubmitResolution = async (lat, lon) => {
        try {
            const res = await axios.put(`/api/grievances/${selectedTask.grievanceId}/resolve`, {
                resolutionProofUrl: "https://images.unsplash.com/photo-1599427303058-f06cbdf0bb9d?auto=format&fit=crop&q=80&w=400",
                latitude: lat,
                longitude: lon
            });
            alert(`AI VERIFIED: ${res.data.message} (Confidence: ${res.data.confidence}%)`);
            setSelectedTask(null);
            fetchGrievances();
        } catch (err) {
            alert("VERIFICATION FAILED: " + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    const sendEmergencyAlert = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const body = `EMERGENCY SOS ALERT: \n\nWorker: ${workerInfo.name} (${workerInfo.id})\nFamily Contact: ${emergencyContacts.name} (${emergencyContacts.relation})\nLocation: https://www.google.com/maps?q=${latitude},${longitude}\n\nURGENT ASSISTANCE REQUIRED.`;

                // 1. Log to Database for Admin/Corporation Portal
                try {
                    await axios.post('/api/emergency', {
                        type: 'Women Emergency', // Sending as high-priority women safety type for immediate response
                        description: `Worker ${workerInfo.name} triggered SOS. Location: ${latitude}, ${longitude}`,
                        location: `LAT: ${latitude}, LNG: ${longitude}`,
                        officerDetails: `Worker ID: ${workerInfo.id}`,
                        declaration: true
                    });
                } catch (err) {
                    console.error("SOS Database Logging Failed:", err);
                }

                // 2. Fallback Email/SMS
                window.location.href = `mailto:emergency-contacts@city.gov,${emergencyContacts.phone.replace(/ /g, '')}@sms.gateway?subject=SOS: ${workerInfo.name} IN DANGER&body=${encodeURIComponent(body)}`;
                alert("DISTRESS SIGNAL DEPLOYED to Government Response Team and " + emergencyContacts.name);
            });
        }
    };

    const sidebarItems = [
        { id: 'tasks', label: 'Field Ops', icon: Target, subtitle: 'Live Grievance Hub' },
        { id: 'superior', label: 'AI Superior', icon: History, subtitle: 'Boss Analytics' },
        { id: 'leaderboard', label: 'City Heroes', icon: Trophy, subtitle: 'Worker Ranking' },
        { id: 'predictive', label: 'Pre-emptive', icon: CloudRain, subtitle: 'Weather-Infra Data' },
        { id: 'dispatch', label: 'Uber Gov', icon: Zap, subtitle: 'Autonomous Route' },
        { id: 'emergency', label: 'Life Guard', icon: Shield, subtitle: 'SOS & Family' },
        { id: 'scanner-settings', label: 'Sensor Lab', icon: Cpu, subtitle: 'AR Audit Config' }
    ];

    const auctionTasks = grievances.filter(g => (g.status === 'AI Classified' || g.status === 'Reported') && !ignoredTasks.includes(g._id));
    const myTasks = grievances.filter(g => g.status === 'Worker Assigned' && g.assignedWorker === workerInfo.id);

    const spawnTestTask = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    await axios.post('/api/grievances', {
                        citizenName: "Debug System",
                        email: "debug@urbanpulse.ai",
                        phone: "0000000000",
                        category: "Pothole",
                        location: "SYNCED DEBUG POINT",
                        description: "Dynamic test task spawned at worker location for geofencing verification.",
                        latitude,
                        longitude,
                        userId: workerInfo.id
                    });
                    alert("DEBUG: Test task spawned at your exact GPS coordinates. Check 'Task Auction'.");
                    fetchGrievances();
                } catch (err) {
                    console.error(err);
                    alert("Failed to spawn debug task.");
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex font-plus-jakarta relative overflow-hidden">

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-100 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Tactical Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-101 transform transition-transform duration-300 lg:translate-x-0 lg:static w-80 bg-slate-900 border-r border-white/5 flex flex-col p-6 h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="absolute inset-0 bg-linear-to-b from-pmc-blue/5 to-transparent pointer-events-none" />

                <div className="flex items-center gap-4 mb-16 relative z-10 px-2">
                    <div className="w-12 h-12 bg-pmc-blue rounded-2xl shadow-xl flex items-center justify-center p-1 relative overflow-hidden rotate-3">
                        <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent" />
                        <span className="text-white text-2xl font-black italic relative z-10">UP</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-widest leading-none">
                            TACTICAL <span className="text-pmc-orange">HUB</span>
                        </h2>
                        <p className="text-[8px] font-black text-white/30 tracking-[0.3em] mt-1">FIELD OPS v4.2</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-4 relative z-10">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 px-2">Mission Control</p>
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveModule(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all group ${activeModule === item.id
                                ? 'bg-pmc-blue text-white shadow-2xl shadow-pmc-blue/20'
                                : 'text-white/40 hover:bg-white/5'
                                }`}
                        >
                            <div className={`p-3 rounded-2xl transition-all ${activeModule === item.id ? 'bg-white/20 rotate-0' : 'bg-slate-800 -rotate-3 group-hover:rotate-0'
                                }`}>
                                <item.icon size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black tracking-tight">{item.label}</p>
                                <p className={`text-[9px] font-bold uppercase tracking-tighter ${activeModule === item.id ? 'text-white/60' : 'text-white/20'
                                    }`}>{item.subtitle}</p>
                            </div>
                        </button>
                    ))}
                </nav>

                {/* Worker Profile Bottom Card */}
                <div className="mt-auto relative z-10 p-4 bg-white/5 rounded-4xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-pmc-accent rounded-2xl flex items-center justify-center text-pmc-blue font-black shadow-lg">
                            {workerInfo.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs font-black text-white">{workerInfo.name}</p>
                            <p className="text-[10px] font-bold text-pmc-accent tracking-widest">{workerInfo.id}</p>
                        </div>
                    </div>
                </div>

                {/* Aesthetic HUD elements */}
                <div className="absolute top-0 right-0 py-20 px-2 flex flex-col items-center gap-1 opacity-10">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-1 h-0.5 bg-white" />
                    ))}
                </div>
            </aside>

            {/* AI COMMAND ALERT - Un-dismissible until task viewed */}
            <AnimatePresence>
                {showAICommand && (
                    <div className="fixed inset-0 z-200 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="max-w-md w-full bg-slate-900 border-2 border-pmc-blue rounded-[3rem] p-10 text-white shadow-[0_0_100px_rgba(59,130,246,0.3)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <Zap size={80} className="text-pmc-blue opacity-10 animate-pulse" />
                            </div>

                            <div className="relative z-10 text-center">
                                <div className="w-20 h-20 bg-pmc-blue/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-pmc-blue/30">
                                    <Bell size={40} className="text-pmc-blue animate-bounce" />
                                </div>
                                <h3 className="text-3xl font-black mb-2 tracking-tighter">AI COMMAND</h3>
                                <p className="text-pmc-accent text-[10px] font-black uppercase tracking-[0.4em] mb-8">Priority Assignment Detected</p>

                                <div className="bg-white/5 rounded-3xl p-6 mb-10 text-left border border-white/5">
                                    <p className="text-xs font-bold text-white/60 mb-2">A high-priority {latestAICommand?.category} has been detected near your sector. The Superior has auto-assigned this to you.</p>
                                    <div className="flex items-center gap-3 text-white text-sm font-black">
                                        <MapPin size={16} className="text-pmc-orange" /> {latestAICommand?.location}
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowAICommand(false);
                                        setActiveModule('tasks');
                                        setActiveTab('my-tasks');
                                        setSelectedTask(latestAICommand);
                                    }}
                                    className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-pmc-blue hover:text-white transition-all shadow-2xl"
                                >
                                    Initialize Intervention
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Operational Area */}
            <main className="flex-1 overflow-y-auto relative h-screen custom-scrollbar pb-32">
                <div className="lg:hidden p-6 absolute top-0 left-0 z-50">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="w-12 h-12 bg-pmc-blue text-white rounded-2xl flex items-center justify-center shadow-lg"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <div className="p-6 md:p-12 mt-16 lg:mt-0">
                    {/* Incoming Alert Toast */}
                    <AnimatePresence>
                        {incomingAlert && (
                            <motion.div
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                className="fixed top-8 right-8 z-100 bg-pmc-blue text-white p-6 rounded-4xl shadow-2xl border border-white/10 flex items-center gap-6 w-80"
                            >
                                <div className="w-12 h-12 bg-pmc-accent rounded-2xl flex items-center justify-center animate-bounce">
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-pmc-accent mb-1">Incoming Grievance</p>
                                    <h4 className="font-black text-sm tracking-tight">{incomingAlert.title}</h4>
                                    <p className="text-[10px] opacity-60 font-bold">{incomingAlert.location}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="max-w-[1600px] mx-auto">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                            <div>
                                <p className="text-[10px] font-black text-pmc-accent uppercase tracking-[0.5em] mb-3">Urban Central Intelligence</p>
                                <h2 className="text-6xl font-black text-white tracking-tighter leading-none">
                                    {activeModule.replace('-', ' ').toUpperCase()}
                                </h2>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={sendEmergencyAlert}
                                    className="group flex items-center gap-3 px-8 py-5 bg-red-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-700 transition-all shadow-2xl shadow-red-600/20 active:scale-95 border-b-4 border-red-900"
                                >
                                    <Shield size={18} className="group-hover:animate-ping" /> Emergency Panic Alert
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            const res = await axios.post('/api/superior/dispatch', { simulateWeather: true });
                                            alert("AI SUPERIOR: Simulating Heavy Rain Event in Sector 7... 4 Drainage Clogs Predicted... Dispatching 2 nearest workers automatically.");
                                            fetchGrievances();
                                        } catch (err) {
                                            console.error(err);
                                            alert("Stress Test Failed");
                                        }
                                    }}
                                    className="group flex items-center gap-3 px-8 py-5 bg-orange-500/20 text-orange-500 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-500 hover:text-white transition-all border border-orange-500/30"
                                >
                                    <ShieldAlert size={18} className="group-hover:animate-bounce" /> STRESS TEST: HEAVY RAIN
                                </button>
                            </div>
                        </div>

                        {/* Content Router */}
                        {activeModule === 'tasks' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
                                <div className="lg:col-span-8 space-y-10">
                                    <div className="flex gap-4 p-2 bg-white/5 w-fit rounded-3xl border border-white/5 mb-8">
                                        <button onClick={() => setActiveTab('auction')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'auction' ? 'bg-pmc-blue text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>Task Auction ({auctionTasks.length})</button>
                                        <button onClick={() => setActiveTab('my-tasks')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'my-tasks' ? 'bg-pmc-blue text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>Active Deployment ({myTasks.length})</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {(activeTab === 'auction' ? auctionTasks : myTasks).map(task => (
                                            <motion.div key={task._id} layoutId={task._id} onClick={() => setSelectedTask(task)} className={`group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-pmc-blue/50 transition-all ${selectedTask?._id === task._id ? 'ring-2 ring-pmc-blue bg-white/10' : ''}`}>
                                                <div className="h-48 relative overflow-hidden">
                                                    <img src={task.proofUrl || "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Grievance" />
                                                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 to-transparent" />
                                                    <div className="absolute top-4 right-4 px-3 py-1 bg-pmc-orange text-white text-[8px] font-black rounded-full uppercase tracking-widest">P{task.priorityScore || 0}</div>
                                                </div>
                                                <div className="p-8">
                                                    <h4 className="text-white font-black text-xl mb-2 tracking-tight group-hover:text-pmc-blue transition-all">{task.category}</h4>
                                                    <p className="text-white/40 text-xs font-bold flex items-center gap-2 mb-6"><MapPin size={12} className="text-pmc-blue" /> {task.location}</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">#{task.grievanceId}</span>
                                                        <div className="flex items-center gap-2 text-pmc-accent font-black text-[10px] uppercase tracking-widest"><Clock size={12} /> {new Date(task.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {(activeTab === 'auction' ? auctionTasks : myTasks).length === 0 && (
                                            <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem] border border-white/5 border-dashed">
                                                <Activity size={48} className="mx-auto text-white/10 mb-6" />
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Initialize Task Protocol</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-4">
                                    {selectedTask ? (
                                        <div className="sticky top-10 space-y-8">
                                            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl relative overflow-hidden">
                                                <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3"><ArrowRight className="text-pmc-blue" /> Task Protocol</h3>
                                                <div className="space-y-6">
                                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</p>
                                                        <p className="text-sm font-bold text-slate-600 leading-relaxed">{selectedTask.description}</p>
                                                    </div>
                                                    {activeTab === 'auction' ? (
                                                        <div className="flex gap-4">
                                                            <button onClick={() => handleClaim(selectedTask.grievanceId)} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-pmc-blue transition-all shadow-xl">Claim Mission</button>
                                                            <button onClick={() => handleIgnore(selectedTask._id)} className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all"><XCircle size={20} /></button>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-6">
                                                            <div className="relative h-64 bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner group">
                                                                {isScanning ? (
                                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                        <div className="w-full h-1 bg-pmc-blue absolute animate-scan shadow-[0_0_15px_rgba(59,130,246,1)]" />
                                                                        <p className="text-pmc-blue text-[10px] font-black uppercase tracking-[0.4em] mb-4 animate-pulse">Neural Scan Active</p>
                                                                        <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${scanProgress}%` }} className="h-full bg-pmc-blue" />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center opacity-20">
                                                                        <Camera size={48} className="text-white mb-4" />
                                                                        <p className="text-white text-[10px] font-black uppercase tracking-widest">Awaiting AI Verification Feed</p>
                                                                    </div>
                                                                )}
                                                                {scanSuccess && <div className="absolute inset-0 bg-pmc-blue/10 flex items-center justify-center backdrop-blur-sm"><div className="bg-white p-6 rounded-full text-pmc-blue shadow-2xl scale-125"><Check size={40} strokeWidth={4} /></div></div>}
                                                            </div>
                                                            {!scanSuccess ? (
                                                                <button onClick={startAICamera} className="w-full py-5 bg-pmc-blue text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-all">
                                                                    <Eye size={18} /> Initialize AI Validator
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        if (navigator.geolocation) {
                                                                            navigator.geolocation.getCurrentPosition(
                                                                                (position) => {
                                                                                    handleSubmitResolution(20.9320, 77.7523);
                                                                                },
                                                                                (err) => {
                                                                                    // Fallback for demo if GPS blocked
                                                                                    handleSubmitResolution(20.9320, 77.7523);
                                                                                }
                                                                            );
                                                                        } else {
                                                                            handleSubmitResolution(20.9320, 77.7523);
                                                                        }
                                                                    }}
                                                                    className="w-full py-5 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-all"
                                                                >
                                                                    Deploy Resolution Proof
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/5 border-dashed">
                                            <Activity size={48} className="mx-auto text-white/10 mb-6" />
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Initialize Task Protocol</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {
                            activeModule === 'superior' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20 space-y-10">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                        {/* AI Status Card */}
                                        <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 text-white shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8">
                                                <History size={100} className="text-pmc-blue opacity-5" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="p-4 bg-pmc-blue text-white w-fit rounded-2xl mb-8"><Cpu size={32} /></div>
                                                <h3 className="text-2xl font-black mb-2 tracking-tight">Superior Core</h3>
                                                <p className="text-[10px] font-black text-pmc-accent uppercase tracking-[0.4em] mb-10">Autonomous Dispatch Engine</p>

                                                <div className="space-y-6">
                                                    <div className="flex justify-between items-center p-5 bg-white/5 rounded-3xl border border-white/5">
                                                        <span className="text-[10px] uppercase font-black text-white/40 tracking-widest">Efficiency</span>
                                                        <span className="text-lg font-black text-pmc-blue">98.2%</span>
                                                    </div>
                                                    <div className="flex justify-between items-center p-5 bg-white/5 rounded-3xl border border-white/5">
                                                        <span className="text-[10px] uppercase font-black text-white/40 tracking-widest">Decisions/hr</span>
                                                        <span className="text-lg font-black text-white">42</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Decision Log */}
                                        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl">
                                            <div className="flex justify-between items-center mb-8">
                                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Live Decision Log</h3>
                                                <span className="px-4 py-2 bg-blue-50 text-pmc-blue text-[10px] font-black rounded-full uppercase tracking-widest animate-pulse">Processing...</span>
                                            </div>
                                            <div className="space-y-4">
                                                {superiorDecisions.map((decision, i) => (
                                                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-pmc-blue transition-all">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-pmc-blue group-hover:text-white transition-all shadow-sm">
                                                                <Zap size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-slate-800">Assigned Task #{decision.taskId} to {decision.workerName}</p>
                                                                <p className="text-[10px] font-bold text-slate-400">{decision.reason}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-300">JUST NOW</span>
                                                    </div>
                                                ))}
                                                {superiorDecisions.length === 0 && (
                                                    <div className="text-center py-20 opacity-20">
                                                        <Activity size={48} className="mx-auto mb-4" />
                                                        <p className="font-black text-xs uppercase tracking-widest">Awaiting Neural Spikes...</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        }

                        {
                            activeModule === 'leaderboard' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20 space-y-10">
                                    <div className="max-w-4xl mx-auto">
                                        <div className="text-center mb-16">
                                            <div className="w-24 h-24 bg-pmc-orange/10 text-pmc-orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-pmc-orange/20">
                                                <Trophy size={48} />
                                            </div>
                                            <h3 className="text-6xl font-black text-white tracking-tighter mb-4">CITY HEROES</h3>
                                            <p className="text-white/40 font-black uppercase tracking-[0.5em] text-xs">The Efficiency Power Ranking</p>
                                        </div>

                                        <div className="bg-slate-900 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl shadow-black/50">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-white/5">
                                                        <th className="p-8 text-[10px] font-black text-white/40 uppercase tracking-widest">Agent Rank</th>
                                                        <th className="p-8 text-[10px] font-black text-white/40 uppercase tracking-widest">Worker</th>
                                                        <th className="p-8 text-[10px] font-black text-white/40 uppercase tracking-widest text-center">Efficiency</th>
                                                        <th className="p-8 text-[10px] font-black text-white/40 uppercase tracking-widest text-right">Loyalty Points</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {leaderboard.map((worker, i) => (
                                                        <tr key={worker._id} className="group hover:bg-white/5 transition-all">
                                                            <td className="p-8">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${i === 0 ? 'bg-pmc-orange text-white shadow-lg' : 'bg-slate-800 text-white/40'}`}>
                                                                    {i + 1}
                                                                </div>
                                                            </td>
                                                            <td className="p-8">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center font-black text-white border border-white/5">
                                                                        {worker.name?.charAt(0)}
                                                                    </div>
                                                                    <div className="font-black text-white">{worker.name}</div>
                                                                </div>
                                                            </td>
                                                            <td className="p-8 text-center">
                                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-xs font-black">
                                                                    <CheckCircle size={12} /> {worker.qualityScore || 95}%
                                                                </div>
                                                            </td>
                                                            <td className="p-8 text-right">
                                                                <div className="text-2xl font-black text-pmc-blue tracking-tighter">
                                                                    {worker.workerPoints} <span className="text-[10px] uppercase font-black tracking-widest text-white/20 ml-2">XP</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {leaderboard.length === 0 && (
                                                        <tr><td colSpan="4" className="p-20 text-center opacity-20"><Activity size={48} className="mx-auto mb-4" /><p className="font-black text-xs uppercase tracking-widest">Scanning Municipal Grid...</p></td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        }

                        {
                            activeModule === 'dispatch' && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    <div className="lg:col-span-8 bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden h-[600px]">
                                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="0.1" />
                                                <circle cx="30" cy="40" r="0.5" fill="cyan" />
                                                <circle cx="70" cy="60" r="0.5" fill="cyan" />
                                                <circle cx="50" cy="20" r="0.5" fill="cyan" />
                                                <path d="M30,40 L50,20 M50,20 L70,60 M70,60 L30,40" stroke="cyan" strokeWidth="0.05" strokeDasharray="1,1" />
                                            </svg>
                                        </div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <h3 className="text-2xl font-black text-white tracking-tight">Voronoi Mesh Dispatch</h3>
                                                    <p className="text-[10px] font-black text-pmc-accent uppercase tracking-[0.3em]">Skill-Proximity Matching: ACTIVE</p>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                    <span className="text-[10px] font-black text-white/60">6 AGENTS SYNCED</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 relative flex items-center justify-center">
                                                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="w-16 h-16 bg-pmc-blue/20 rounded-full border border-pmc-blue flex items-center justify-center relative">
                                                    <div className="w-3 h-3 bg-pmc-blue rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                                                    <p className="absolute -bottom-6 text-[8px] font-black text-white whitespace-nowrap">YOU (ID-99)</p>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-4 space-y-8">
                                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Uber Gov Queue</h4>
                                            <div className="space-y-4">
                                                {[{ type: 'P0', time: 'LIVE', distance: '0.4km', action: 'ASSIGNED' }, { type: 'P1', time: '2m ago', distance: '1.2km', action: 'CLAIMED' }, { type: 'P2', time: '15m ago', distance: '2.5km', action: 'RESOLVED' }].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${item.type === 'P0' ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{item.type}</div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-800">{item.action}</p>
                                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.distance}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[8px] font-black text-slate-400">{item.time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-pmc-blue rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
                                            <Zap size={40} className="text-pmc-accent mb-6" />
                                            <h4 className="text-xl font-black mb-2 leading-tight">Instant Task Auction</h4>
                                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">System assigned a P0 leak detection in your current sector.</p>
                                            <button className="mt-8 w-full py-4 bg-white text-pmc-blue rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Accept Dispatch</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        }

                        {activeModule === 'predictive' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-20 space-y-10">
                                <div className="mb-12">
                                    <h2 className="text-6xl font-black text-white tracking-tighter mb-4">PREEMPTIVE INFRA</h2>
                                    <p className="text-white/40 text-xs font-black uppercase tracking-[0.4em] leading-relaxed max-w-2xl">
                                        Neural correlation of weather matrices and GIS failure nodes.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    {/* Flood Engine */}
                                    <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/10 relative overflow-hidden group">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="p-4 bg-pmc-blue/20 rounded-2xl text-pmc-blue font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                                                <CloudRain size={20} /> Flood Prediction
                                            </div>
                                            <span className="text-pmc-blue font-black text-2xl tracking-tighter">85% Risk</span>
                                        </div>
                                        <h3 className="text-white font-black text-xl mb-4 tracking-tight">Drainage Saturation Model</h3>
                                        <p className="text-white/40 text-xs leading-relaxed mb-8">Correlating 24mm rain forecast with Sector 4 lowlands. 4 Predictive nodes deployed.</p>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-pmc-blue" />
                                        </div>
                                    </div>

                                    {/* Pothole Engine */}
                                    <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/10 relative overflow-hidden group">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="p-4 bg-orange-500/20 rounded-2xl text-orange-500 font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                                                <Activity size={20} /> Erosion Forecast
                                            </div>
                                            <span className="text-orange-500 font-black text-2xl tracking-tighter">High</span>
                                        </div>
                                        <h3 className="text-white font-black text-xl mb-4 tracking-tight">Pothole Expansion Modeler</h3>
                                        <p className="text-white/40 text-xs leading-relaxed mb-8">Asphalt fatigue detected in Sector 7G due to thermal cracking + high traffic volume.</p>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} className="h-full bg-orange-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-[3rem] p-12 border border-white/10 backdrop-blur-3xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-5"><Zap size={200} /></div>
                                    <h4 className="text-2xl font-black text-white mb-6">Master Key Integration</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 text-white/60">
                                                <div className="w-2 h-2 bg-pmc-blue rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                                <p className="font-bold">Automated Proactive Spawning</p>
                                            </div>
                                            <p className="text-white/30 text-xs leading-relaxed">System automatically generates preventive maintenance tasks when weather risk thresholds exceed 15mm/hr.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 text-white/60">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                                                <p className="font-bold">GIS Node Synchronization</p>
                                            </div>
                                            <p className="text-white/30 text-xs leading-relaxed">Risk data is synced with real-time worker GPS coordinates for optimized pre-deployment.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {
                            activeModule === 'emergency' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20 max-w-2xl mx-auto text-center space-y-10">
                                    <div className="w-32 h-32 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/20"><Shield size={64} /></div>
                                    <div>
                                        <h3 className="text-4xl font-black text-white tracking-tighter mb-4">LIFE GUARD</h3>
                                        <p className="text-white/40 font-bold uppercase tracking-[0.3em]">Worker Status & Family Network</p>
                                    </div>
                                    <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 text-left">
                                        <div className="flex justify-between items-center mb-8">
                                            <h4 className="text-pmc-accent font-black uppercase tracking-widest text-xs flex items-center gap-3">
                                                <User size={16} /> Registered Family Contact
                                            </h4>
                                            {!isEditingEmergency ? (
                                                <button
                                                    onClick={() => {
                                                        setTempEmergencyContacts({ ...emergencyContacts });
                                                        setIsEditingEmergency(true);
                                                    }}
                                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    Edit Details
                                                </button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEmergencyContacts({ ...tempEmergencyContacts });
                                                            setIsEditingEmergency(false);
                                                        }}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditingEmergency(false)}
                                                        className="px-4 py-2 bg-white/5 text-white/40 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            {!isEditingEmergency ? (
                                                <>
                                                    <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5">
                                                        <div><p className="text-[10px] text-white/40 uppercase font-black mb-1">Name</p><p className="text-lg font-black text-white">{emergencyContacts.name}</p></div>
                                                        <div className="text-right"><p className="text-[10px] text-white/40 uppercase font-black mb-1">Relation</p><p className="text-lg font-black text-pmc-accent">{emergencyContacts.relation}</p></div>
                                                    </div>
                                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                                        <p className="text-[10px] text-white/40 uppercase font-black mb-1">Secure Contact Method</p>
                                                        <p className="text-lg font-black text-white flex items-center gap-3"><PhoneCall size={20} className="text-green-400" /> {emergencyContacts.phone}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] text-white/40 uppercase font-black px-2">Contact Name</label>
                                                            <input
                                                                type="text"
                                                                value={tempEmergencyContacts.name}
                                                                onChange={(e) => setTempEmergencyContacts({ ...tempEmergencyContacts, name: e.target.value })}
                                                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-pmc-blue transition-all"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] text-white/40 uppercase font-black px-2">Relation</label>
                                                            <input
                                                                type="text"
                                                                value={tempEmergencyContacts.relation}
                                                                onChange={(e) => setTempEmergencyContacts({ ...tempEmergencyContacts, relation: e.target.value })}
                                                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-pmc-blue transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] text-white/40 uppercase font-black px-2">Phone Number</label>
                                                        <input
                                                            type="text"
                                                            value={tempEmergencyContacts.phone}
                                                            onChange={(e) => setTempEmergencyContacts({ ...tempEmergencyContacts, phone: e.target.value })}
                                                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-pmc-blue transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        }

                        {
                            activeModule === 'scanner-settings' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20 space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                                            <div className="w-16 h-16 bg-pmc-blue/20 text-pmc-blue rounded-2xl flex items-center justify-center mb-8"><Cpu size={32} /></div>
                                            <h3 className="text-2xl font-black text-white mb-4">Neural Scanner Configuration</h3>
                                            <p className="text-white/40 text-sm font-bold mb-10 leading-relaxed text-balance">The on-device Edge AI model (YOLO v8) verifies resolution proof in real-time.</p>
                                            <div className="space-y-4">
                                                <button onClick={() => setGhostOverlay(!ghostOverlay)} className={`w-full p-6 rounded-3xl flex items-center justify-between border transition-all ${ghostOverlay ? 'bg-pmc-blue border-pmc-blue text-white shadow-xl shadow-pmc-blue/20' : 'bg-white/5 border-white/5 text-white/40'}`}>
                                                    <span className="font-black uppercase tracking-widest text-xs">Ghost Image Overlay</span>
                                                    {ghostOverlay ? <CheckCircle size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-white/10" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10"><Database size={200} /></div>
                                            <div className="relative z-10">
                                                <div className="w-16 h-16 bg-pmc-blue text-white rounded-2xl flex items-center justify-center mb-8"><Layers size={32} /></div>
                                                <h3 className="text-2xl font-black text-slate-800 mb-4">Blockchain Ledger</h3>
                                                <p className="text-slate-400 text-sm font-bold mb-10 leading-relaxed text-balance">Every verified resolution generates a unique cryptographic hash.</p>
                                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 font-mono text-[10px] break-all text-slate-400">HASH: {blockchainHash || '0xDE45...F290'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        }
                    </div >
            </main >

            {/* Premium Background Decor */}
            < div className="fixed top-0 right-0 w-[500px] h-[500px] bg-pmc-blue/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-pmc-orange/5 rounded-full blur-[150px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
                .animate-scan { animation: scan 2s linear infinite; }
            `}} />
        </div >
    );
};

export default WorkerPortal;
