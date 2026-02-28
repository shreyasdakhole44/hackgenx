import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Sparkles, Building, Send, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const DecisionForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Decision',
        important: false,
        scale: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/news`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    content: `${formData.content} (Project Scale: ${formData.scale})`,
                    category: 'Decision',
                    important: formData.important,
                    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                })
            });

            if (res.ok) {
                setSuccess(true);
                setFormData({ title: '', content: '', category: 'Decision', important: false, scale: '' });
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Failed to submit decision:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-pmc-blue rounded-2xl flex items-center justify-center text-white ring-8 ring-pmc-blue/5">
                        <Gavel size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-pmc-blue tracking-tight uppercase">Administrative Decision Log</h2>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Publish municipal directives to the Transparency Portal</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Project Title */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Title</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. 500 Truck Smart Garbage Initiative"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-pmc-blue/30 focus:bg-white transition-all font-bold text-slate-800"
                            />
                        </div>

                        {/* Project Scale/Budget */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Scale / Budget</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. 12 Crore Project / City-Wide"
                                value={formData.scale}
                                onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-pmc-blue/30 focus:bg-white transition-all font-bold text-slate-800"
                            />
                        </div>
                    </div>

                    {/* Content / Narrative */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Decision Summary & Official Narrative</label>
                        <textarea
                            required
                            rows="4"
                            placeholder="Describe the decision, its impact, and the execution plan..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-pmc-blue/30 focus:bg-white transition-all font-bold text-slate-800 resize-none"
                        />
                    </div>

                    {/* Features & Options */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, important: !formData.important })}
                            className={`flex-1 p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${formData.important ? 'border-pmc-accent bg-pmc-accent/5' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                        >
                            <div className="flex gap-4 items-center">
                                <div className={`p-3 rounded-xl ${formData.important ? 'bg-pmc-accent text-white shadow-lg' : 'bg-white text-slate-300'}`}>
                                    <Sparkles size={20} />
                                </div>
                                <div className="text-left">
                                    <p className={`text-sm font-black uppercase tracking-tight ${formData.important ? 'text-pmc-accent' : 'text-slate-400'}`}>Weekly Highlight</p>
                                    <p className="text-[10px] text-slate-400 font-bold italic">Feature as "Decision of the Week"</p>
                                </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.important ? 'border-pmc-accent bg-pmc-accent' : 'border-slate-200'}`}>
                                {formData.important && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                        </button>

                        <div className="flex-1 p-6 rounded-3xl bg-blue-50/50 border-2 border-blue-100/30 flex items-center gap-4">
                            <div className="p-3 bg-white text-blue-500 rounded-xl">
                                <Building size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-tight text-blue-800">Neutral Sync</p>
                                <p className="text-[10px] text-blue-400 font-bold italic">Immutable to Transparency Layer</p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 border-l-2 border-slate-100">
                            <AlertTriangle size={12} />
                            Submission is Final & Traceable
                        </div>

                        <button
                            disabled={loading}
                            className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl ${success ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-pmc-blue text-white hover:bg-pmc-accent shadow-pmc-blue/20 hover:shadow-pmc-accent/20'}`}
                        >
                            {loading ? (
                                <RefreshCw size={20} className="animate-spin" />
                            ) : success ? (
                                <>
                                    <CheckCircle2 size={20} />
                                    Synchronized
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Publish Decision
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default DecisionForm;
