import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertCircle, UserX, Send, CheckCircle2, Upload, MapPin, Lock, Scale } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import TripleHeader from '../components/TripleHeader';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';

const EmergencyPortal = () => {
    const query = new URLSearchParams(useLocation().search);
    const initialType = query.get('type') || 'Other Emergency';

    const [formData, setFormData] = useState({
        type: initialType,
        description: '',
        officerDetails: '',
        location: '',
        declaration: false
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ state: 'idle', ref: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/emergency`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ state: 'success', ref: data.referenceId });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-red-50/30">
            <TripleHeader isFixed={true} />

            <main className="pt-40 pb-32">
                <div className="gov-container px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-12 flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-black text-red-600 tracking-tighter uppercase flex items-center gap-4">
                                    <ShieldAlert size={40} />
                                    Emergency Complaint Portal
                                </h1>
                                <p className="text-red-400 font-bold mt-2">Restricted flow for critical safety and misconduct reporting.</p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-red-100 rounded-full text-[10px] font-black uppercase text-red-600 tracking-widest">
                                <Lock size={12} />
                                Secure Encryption Active
                            </div>
                        </div>

                        {status.state === 'success' ? (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border-2 border-red-100 p-16 rounded-[3rem] text-center space-y-8 shadow-2xl">
                                <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-red-600/20">
                                    <CheckCircle2 size={48} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-pmc-blue uppercase tracking-tight mb-2">Emergency Logged</h2>
                                    <p className="text-slate-500 font-bold max-w-md mx-auto">Your report has been securely saved in the restricted emergency database. Administrative officers have been alerted.</p>
                                </div>
                                <div className="inline-block px-12 py-6 bg-red-50 rounded-2xl border border-dashed border-red-200">
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Emergency ID</p>
                                    <p className="text-4xl font-black text-red-600 font-mono tracking-tighter">{status.ref}</p>
                                </div>
                                <p className="text-[11px] text-red-400 font-black uppercase tracking-widest">DO NOT SHARE THIS ID PUBLICLY</p>
                                <button onClick={() => window.location.href = '/'} className="px-10 py-5 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl">Return to Safety</button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white border border-red-100 rounded-[3rem] p-12 shadow-2xl shadow-red-900/5 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Entry Type */}
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-red-400 uppercase tracking-widest ml-1">Emergency Nature</label>
                                        <div className="relative">
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full px-6 py-5 bg-red-50/50 border border-red-100 rounded-2xl focus:outline-none focus:border-red-600/30 focus:bg-white transition-all font-black text-red-600 appearance-none text-sm"
                                            >
                                                <option value="Women Emergency">Women Emergency / Safety</option>
                                                <option value="Employee Misconduct">Employee Misconduct / Corruption</option>
                                                <option value="Officer Inaction">Officer Inaction / Negligence</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-red-300 pointer-events-none">
                                                <AlertCircle size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Location */}
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Incident Location (Optional)</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Specific office, ward, or site..."
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-red-600/30 focus:bg-white transition-all font-bold text-slate-800 text-sm"
                                            />
                                            <MapPin size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Description */}
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Incident Narrative</label>
                                    <textarea
                                        required
                                        rows="6"
                                        placeholder="Describe exactly what happened. Include specific dates, times, and context..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-red-600/30 focus:bg-white transition-all font-bold text-slate-800 resize-none text-sm leading-relaxed"
                                    />
                                </div>

                                {/* Officer Details */}
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Officer / Employee Details (If applicable)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Name, Designation, ID number..."
                                            value={formData.officerDetails}
                                            onChange={(e) => setFormData({ ...formData, officerDetails: e.target.value })}
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-red-600/30 focus:bg-white transition-all font-bold text-slate-800 text-sm"
                                        />
                                        <UserX size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                    </div>
                                </div>

                                {/* File Attachment Placeholder */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-10 border-2 border-dashed border-red-100 rounded-4xl flex flex-col items-center justify-center text-center group hover:border-red-600/20 transition-all cursor-pointer bg-red-50/10">
                                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-red-300 group-hover:bg-red-600 group-hover:text-white transition-all mb-4 shadow-sm">
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-sm font-black text-red-600 uppercase tracking-tight mb-1">Upload Critical Evidence</p>
                                        <p className="text-[10px] text-red-400 font-bold italic">Protected Image Upload (Encrypted)</p>
                                    </div>

                                    <div className="p-10 bg-slate-50 rounded-4xl border border-slate-100 flex flex-col justify-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-pmc-blue rounded-lg flex items-center justify-center text-white shadow-lg">
                                                <Scale size={16} />
                                            </div>
                                            <p className="text-[11px] font-black text-pmc-blue uppercase tracking-widest">Legal Integrity</p>
                                        </div>
                                        <label className="flex items-start gap-4 cursor-pointer group">
                                            <input
                                                required
                                                type="checkbox"
                                                checked={formData.declaration}
                                                onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                                                className="mt-1 w-5 h-5 rounded border-red-200 text-red-600 focus:ring-red-600"
                                            />
                                            <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 leading-relaxed transition-colors">
                                                I declare that I am reporting a genuine emergency/grievance and understand that providing false information is a punishable offense.
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-slate-800 shadow-2xl shadow-red-900/20 transition-all flex items-center justify-center gap-4"
                                >
                                    {loading ? 'Transmitting Over Neural Bridge...' : (
                                        <>
                                            <Send size={20} />
                                            Transmit Emergency Report
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        <p className="mt-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                            End-to-End Encrypted Handshake • Punecorp Identity Protection
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EmergencyPortal;
