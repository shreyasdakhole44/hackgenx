import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, ChevronRight, CheckCircle2, Info, Lock } from 'lucide-react';

const WeeklyPoll = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const { data } = await axios.get('/api/impact/polls');
            setPolls(data);

            // Check if user has already voted on the primary poll
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo && data.length > 0) {
                const voted = data[0].voters.some(v => v.userId === userInfo._id);
                if (voted) setHasVoted(true);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error fetching polls:", err);
            setLoading(false);
        }
    };

    const handleVote = async (pollId) => {
        if (!selectedOption) return;

        setIsVoting(true);
        setError(null);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) {
                setError("Please login to cast your vote.");
                setIsVoting(false);
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };

            await axios.post(`/api/impact/polls/${pollId}/vote`, {
                optionLabel: selectedOption
            }, config);

            setHasVoted(true);
            fetchPolls(); // Refresh to show results
            setIsVoting(false);
        } catch (err) {
            setError(err.response?.data?.message || "Voting failed. Do you have enough credits?");
            setIsVoting(false);
        }
    };

    if (loading) return null;
    if (polls.length === 0) return null;

    const activePoll = polls[0];
    const totalVotes = (activePoll && activePoll.options) ? activePoll.options.reduce((acc, curr) => acc + (curr.votes || 0), 0) : 0;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="gov-container relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pmc-accent/10 border border-pmc-accent/20">
                                <span className="w-2 h-2 rounded-full bg-pmc-accent animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-pmc-accent">Weekly Civic Decision</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-pmc-blue tracking-tighter leading-none">
                                {activePoll.title}
                            </h2>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                {activePoll.description || "Your vote influences city-wide infrastructure and policy decisions. Spend 1 Civic Credit to participate in this week's democratic cycle."}
                            </p>

                            {!hasVoted && (
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 italic text-slate-400 text-sm">
                                    <Info size={16} />
                                    Participating requires 1 Development Voting credit.
                                </div>
                            )}
                        </div>

                        <div className="md:w-1/2 w-full">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="premium-card p-8 md:p-10 bg-white border-pmc-blue/5 shadow-2xl shadow-slate-200"
                            >
                                <div className="space-y-4">
                                    {activePoll.options.map((option) => {
                                        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                                        const isSelected = selectedOption === option.label;

                                        return (
                                            <div key={option.label} className="relative">
                                                <button
                                                    disabled={hasVoted || isVoting}
                                                    onClick={() => setSelectedOption(option.label)}
                                                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all relative z-10 overflow-hidden ${hasVoted
                                                        ? 'border-slate-100 cursor-default'
                                                        : isSelected
                                                            ? 'border-pmc-accent bg-pmc-accent/5'
                                                            : 'border-slate-50 hover:border-pmc-blue/10 bg-slate-50/50 hover:bg-white'
                                                        }`}
                                                >
                                                    {hasVoted && (
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percentage}%` }}
                                                            className="absolute inset-0 bg-pmc-blue/5 z-0"
                                                        />
                                                    )}

                                                    <div className="relative z-10 flex justify-between items-center">
                                                        <span className={`font-black tracking-tight ${hasVoted ? 'text-pmc-blue' : isSelected ? 'text-pmc-accent' : 'text-slate-600'}`}>
                                                            {option.label}
                                                        </span>
                                                        {hasVoted ? (
                                                            <span className="font-black text-pmc-blue">{percentage}%</span>
                                                        ) : (
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-pmc-accent' : 'border-slate-200'}`}>
                                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-pmc-accent" />}
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-8">
                                    <AnimatePresence mode="wait">
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs font-bold text-center"
                                            >
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {hasVoted ? (
                                        <div className="flex flex-col items-center gap-4 py-4">
                                            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <p className="font-black text-pmc-blue uppercase tracking-widest text-xs">Vote Recorded</p>
                                            <p className="text-slate-400 text-xs text-center px-6">Thank you for participating in the weekly decision cycle.</p>
                                        </div>
                                    ) : (
                                        <button
                                            disabled={!selectedOption || isVoting}
                                            onClick={() => handleVote(activePoll._id)}
                                            className="btn-primary w-full py-5 flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {isVoting ? "Processing..." : (
                                                <>
                                                    Commit Vote <Vote size={18} />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WeeklyPoll;
