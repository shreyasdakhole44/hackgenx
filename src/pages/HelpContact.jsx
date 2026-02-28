import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Mail, ChevronRight, AlertCircle, FileText, Send, CheckCircle2, ShieldCheck, Upload, Info } from 'lucide-react';
import TripleHeader from '../components/TripleHeader';
import Footer from '../components/Footer';

const HelpContact = () => {
    const [activeTab, setActiveTab] = useState('help');
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId] = useState("65d8f1e2b3c4d5e6f7a8b9c0"); // Mock user ID for demo, in real world from context/auth

    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        relatedGrievanceId: '',
        reason: '',
        consent: false
    });

    const [status, setStatus] = useState({ state: 'idle', ref: '' });

    useEffect(() => {
        const fetchGrievances = async () => {
            try {
                const res = await fetch(`/api/support/user-grievances/${userId}`);
                const data = await res.json();
                setGrievances(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchGrievances();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5001/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    type: activeTab === 'help' ? 'Help' : 'Contact',
                    ...formData
                })
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ state: 'success', ref: data.referenceId });
                setFormData({ subject: '', message: '', relatedGrievanceId: '', reason: '', consent: false });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <TripleHeader isFixed={true} />

            <main className="pt-40 pb-32">
                <div className="gov-container px-6">
                    <div className="max-w-5xl mx-auto">
                        {/* Header */}
                        <div className="mb-16">
                            <h1 className="text-5xl font-black text-pmc-blue tracking-tighter mb-4 uppercase">Support & Assistance</h1>
                            <p className="text-slate-500 font-bold text-lg">Direct administrative channels for grievance escalation and inquiries.</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-white p-2 rounded-3xl border border-slate-200 w-fit mb-12 shadow-sm">
                            {[
                                { id: 'help', label: 'Escalation Help', icon: <HelpCircle size={18} /> },
                                { id: 'contact', label: 'Administrative Contact', icon: <Mail size={18} /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${activeTab === tab.id ? 'bg-pmc-blue text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {status.state === 'success' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border-2 border-green-100 p-16 rounded-[3rem] text-center space-y-8 shadow-2xl">
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white ring-8 ring-green-50">
                                    <CheckCircle2 size={48} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-pmc-blue uppercase tracking-tight mb-2">Submission Received</h2>
                                    <p className="text-slate-500 font-bold">Your request has been logged and sent to the administrator.</p>
                                </div>
                                <div className="inline-block px-12 py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reference ID</p>
                                    <p className="text-3xl font-black text-pmc-blue font-mono tracking-tighter">{status.ref}</p>
                                </div>
                                <button onClick={() => setStatus({ state: 'idle', ref: '' })} className="block mx-auto text-[11px] font-black uppercase text-pmc-blue tracking-widest border-b-2 border-pmc-blue/10">Submit Another Request</button>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* Form Section */}
                                <div className="lg:col-span-8">
                                    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Subject */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    placeholder="Brief title of your request"
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-pmc-blue/30 focus:bg-white transition-all font-bold text-slate-800"
                                                />
                                            </div>

                                            {/* Escalation Reason (Only for Help) */}
                                            {activeTab === 'help' && (
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Escalation Reason</label>
                                                    <select
                                                        required
                                                        value={formData.reason}
                                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-pmc-blue/30 focus:bg-white transition-all font-bold text-slate-800 appearance-none"
                                                    >
                                                        <option value="">Select Reason</option>
                                                        <option value="SLA Overdue">SLA response time overdue</option>
                                                        <option value="Unsatisfactory Resolution">Unsatisfactory resolution outcome</option>
                                                        <option value="Incorrect Status">Incorrect status update</option>
                                                        <option value="Other">Other / General Help</option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>

                                        {/* Grievance Selection */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                Related Grievance {activeTab === 'contact' && '(Optional)'}
                                            </label>
                                            <select
                                                required={activeTab === 'help'}
                                                value={formData.relatedGrievanceId}
                                                onChange={(e) => setFormData({ ...formData, relatedGrievanceId: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-pmc-blue/30 focus:bg-white transition-all font-bold text-slate-800 appearance-none"
                                            >
                                                <option value="">Select a Complaint</option>
                                                {grievances.map(g => (
                                                    <option key={g._id} value={g._id}>{g.title} (ID: {g._id.substring(g._id.length - 6)}) - {g.status}</option>
                                                ))}
                                                {grievances.length === 0 && <option disabled>No grievances found in your history</option>}
                                            </select>
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Message / Explanation</label>
                                            <textarea
                                                required
                                                rows="5"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Provide as much detail as possible..."
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-pmc-blue/30 focus:bg-white transition-all font-bold text-slate-800 resize-none"
                                            />
                                        </div>

                                        {/* Proof Upload Placeholder */}
                                        <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-pmc-blue/20 transition-all cursor-pointer">
                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-pmc-blue/5 group-hover:text-pmc-blue transition-all mb-4">
                                                <Upload size={20} />
                                            </div>
                                            <p className="text-sm font-black text-slate-500 uppercase tracking-tight mb-1">Upload Proof of Issue</p>
                                            <p className="text-[10px] text-slate-400 font-bold italic">Image files only (PNG, JPG) - Max 5MB</p>
                                        </div>

                                        {/* Consent */}
                                        <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/30">
                                            <input
                                                required
                                                type="checkbox"
                                                checked={formData.consent}
                                                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                                                className="mt-1 w-5 h-5 rounded border-slate-300 text-pmc-blue focus:ring-pmc-blue"
                                            />
                                            <p className="text-[11px] font-bold text-blue-800 leading-relaxed">
                                                I declare that the information provided is accurate and relevant to my municipal interaction. I understand this action will be logged in the public audit trail.
                                            </p>
                                        </div>

                                        <button
                                            disabled={loading}
                                            className="w-full py-6 bg-pmc-blue text-white rounded-4xl font-black uppercase tracking-[0.2em] text-sm hover:bg-pmc-accent shadow-2xl shadow-pmc-blue/20 transition-all flex items-center justify-center gap-3"
                                        >
                                            <Send size={18} />
                                            {loading ? 'Processing...' : 'Submit Request'}
                                        </button>
                                    </form>
                                </div>

                                {/* Sidebar Info */}
                                <div className="lg:col-span-4 space-y-8">
                                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                                        <h4 className="text-sm font-black text-pmc-blue uppercase tracking-widest mb-6 flex items-center gap-3">
                                            <Info size={18} />
                                            Administrative Guidelines
                                        </h4>
                                        <ul className="space-y-6">
                                            {[
                                                { title: 'Response Time', desc: 'Administrative review takes 24-48 working hours.' },
                                                { title: 'Reference ID', desc: 'Safe-keep the ID generated after submission.' },
                                                { title: 'Traceability', desc: 'All requests are permanently linked to your profile.' }
                                            ].map((item, i) => (
                                                <li key={i} className="space-y-1">
                                                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{item.title}</p>
                                                    <p className="text-[12px] font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-pmc-blue text-white rounded-[2.5rem] p-10 shadow-xl shadow-pmc-blue/20 relative overflow-hidden">
                                        <ShieldCheck size={120} className="absolute -right-8 -bottom-8 opacity-10" />
                                        <h4 className="text-xl font-black uppercase tracking-tight mb-4 relative z-10">Safe Submission</h4>
                                        <p className="text-sm font-bold text-white/70 leading-relaxed relative z-10">
                                            Your data is protected by the Pune Municipal Data Sovereignty protocols. Only authorized administrative officers can access this inquiry.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HelpContact;
