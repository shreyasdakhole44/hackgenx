import React from 'react';
import { motion } from 'framer-motion';
import { Route, Droplets, Zap, Trash2, HeartPulse, ChevronRight, TrendingUp, Building2, ShieldCheck, TreePine, Bus, GraduationCap, Flame, Globe } from 'lucide-react';

const DepartmentGrid = ({ grievances = [], stats = [], onSelectDepartment, selectedDepartment }) => {
    const depts = [
        {
            name: 'Roads & Infrastructure',
            id: 'Roads',
            icon: <Route size={20} />,
            color: 'blue',
            count: stats.find(s => s._id === 'Roads')?.count || grievances.filter(g => g.department === 'Roads').length,
            resolved: stats.find(s => s._id === 'Roads')?.resolved || grievances.filter(g => g.department === 'Roads' && g.status === 'Resolved').length
        },
        {
            name: 'Water & Sanitation',
            id: 'Water',
            icon: <Droplets size={20} />,
            color: 'cyan',
            count: stats.find(s => s._id === 'Water')?.count || grievances.filter(g => g.department === 'Water').length,
            resolved: stats.find(s => s._id === 'Water')?.resolved || grievances.filter(g => g.department === 'Water' && g.status === 'Resolved').length
        },
        {
            name: 'Energy & Power',
            id: 'Electricity',
            icon: <Zap size={20} />,
            color: 'yellow',
            count: stats.find(s => s._id === 'Electricity')?.count || grievances.filter(g => g.department === 'Electricity').length,
            resolved: stats.find(s => s._id === 'Electricity')?.resolved || grievances.filter(g => g.department === 'Electricity' && g.status === 'Resolved').length
        },
        {
            name: 'Waste Management',
            id: 'Waste Management',
            icon: <Trash2 size={20} />,
            color: 'emerald',
            count: stats.find(s => s._id === 'Waste Management')?.count || grievances.filter(g => g.department === 'Waste Management').length,
            resolved: stats.find(s => s._id === 'Waste Management')?.resolved || grievances.filter(g => g.department === 'Waste Management' && g.status === 'Resolved').length
        },
        {
            name: 'Public Health',
            id: 'Public Health',
            icon: <HeartPulse size={20} />,
            color: 'red',
            count: stats.find(s => s._id === 'Public Health')?.count || grievances.filter(g => g.department === 'Public Health').length,
            resolved: stats.find(s => s._id === 'Public Health')?.resolved || grievances.filter(g => g.department === 'Public Health' && g.status === 'Resolved').length
        },
        {
            name: 'Urban Planning',
            id: 'Planning',
            icon: <Building2 size={20} />,
            color: 'indigo',
            count: stats.find(s => s._id === 'Planning')?.count || 0,
            resolved: stats.find(s => s._id === 'Planning')?.resolved || 0
        },
        {
            name: 'Fire Safety',
            id: 'Fire',
            icon: <Flame size={20} />,
            color: 'orange',
            count: stats.find(s => s._id === 'Fire')?.count || 0,
            resolved: stats.find(s => s._id === 'Fire')?.resolved || 0
        },
        {
            name: 'Education',
            id: 'Education',
            icon: <GraduationCap size={20} />,
            color: 'purple',
            count: stats.find(s => s._id === 'Education')?.count || 0,
            resolved: stats.find(s => s._id === 'Education')?.resolved || 0
        },
        {
            name: 'Environment',
            id: 'Environment',
            icon: <TreePine size={20} />,
            color: 'green',
            count: stats.find(s => s._id === 'Environment')?.count || 0,
            resolved: stats.find(s => s._id === 'Environment')?.resolved || 0
        },
        {
            name: 'Smart City Labs',
            id: 'SmartCity',
            icon: <Globe size={20} />,
            color: 'pmc-accent',
            count: stats.find(s => s._id === 'SmartCity')?.count || 0,
            resolved: stats.find(s => s._id === 'SmartCity')?.resolved || 0
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {depts.map((dept, i) => (
                <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => onSelectDepartment && onSelectDepartment(dept.id)}
                    className={`bg-white border p-6 rounded-4xl group hover:border-pmc-accent/30 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 ${selectedDepartment === dept.id ? 'border-pmc-accent ring-2 ring-pmc-accent/20' : 'border-slate-200'
                        }`}
                >
                    <div className={`absolute -right-4 -top-4 w-20 h-20 bg-${dept.color}-500/5 rounded-full blur-2xl group-hover:bg-pmc-accent/5 transition-colors`} />

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className={`p-3 bg-${dept.color}-500/10 text-${dept.color}-400 rounded-2xl group-hover:scale-110 transition-transform`}>
                            {dept.icon}
                        </div>
                        <div className="flex flex-col items-end text-right">
                            <span className="text-2xl font-black text-slate-800">{dept.count}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h4 className="font-black text-sm text-slate-600 group-hover:text-pmc-blue transition-colors uppercase tracking-tight mb-4">{dept.name}</h4>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400 text-[9px]">Resolution</span>
                                <span className="text-slate-600">{dept.count ? Math.round((dept.resolved / dept.count) * 100) : 0}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dept.count ? (dept.resolved / dept.count) * 100 : 0}%` }}
                                    className={`h-full bg-${dept.color}-500/80 group-hover:bg-pmc-accent transition-colors`}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-pmc-accent opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-[10px] font-black uppercase tracking-widest">
                            Inspect Node <ChevronRight size={12} />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default DepartmentGrid;
