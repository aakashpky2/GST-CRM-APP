import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Play, 
  Award, 
  BookOpen, 
  Clock, 
  ChevronRight,
  Zap,
  CheckCircle2,
  Calendar,
  Calculator,
  Download,
  ListChecks
} from 'lucide-react';
import { gstModules, weeklyActivity, complianceUpdates } from '../data/mockData';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-200"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-cyan-500/20 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 md:flex items-center justify-between gap-10">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 rounded-full border border-cyan-500/30">
              <Zap size={14} className="text-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Keep it up!</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Ready to master GST?</h1>
            <p className="text-slate-400 text-lg">You've completed 25% of your certification path. Continue where you left off in GST Registration.</p>
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm transition-all hover:bg-cyan-50 active:scale-95">
              <Play size={18} fill="currentColor" />
              Continue Learning
            </button>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="188.4" className="text-cyan-400" />
              </svg>
              <Award className="absolute text-cyan-400" size={32} />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">25%</p>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Progress</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Completed Lessons', val: '14', sub: 'Out of 56 total', icon: <CheckCircle2 className="text-emerald-500" /> },
          { label: 'Learning Time', val: '12.4h', sub: 'Last 7 days', icon: <Clock className="text-cyan-500" /> },
          { label: 'Active Modules', val: '02', sub: 'In progress', icon: <BookOpen className="text-blue-500" /> },
          { label: 'Upcoming Due Dates', val: '03', sub: 'GST Compliance', icon: <Calendar className="text-orange-500" /> },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                {stat.icon}
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.val}</p>
            <p className="text-sm font-semibold text-slate-900 mt-1">{stat.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Learning Activity</h2>
              <p className="text-sm text-slate-500">Your study hours per day</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none cursor-pointer">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={40}>
                  {weeklyActivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hours > 3 ? '#0EA5E9' : '#E2E8F0'} className="transition-all hover:fill-cyan-500" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions & Compliance */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Calculator size={18} />, label: 'GST Calc', color: 'bg-blue-50 text-blue-600' },
                { icon: <Download size={18} />, label: 'Templates', color: 'bg-emerald-50 text-emerald-600' },
                { icon: <Calendar size={18} />, label: 'Due Dates', color: 'bg-orange-50 text-orange-600' },
                { icon: <ListChecks size={18} />, label: 'Checklist', color: 'bg-purple-50 text-purple-600' },
              ].map((action, i) => (
                <button key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-50 transition-all hover:bg-slate-50 hover:shadow-sm active:scale-95 group">
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-2 transition-all group-hover:scale-110`}>
                    {action.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Compliance Watch</h2>
            <div className="space-y-4">
              {complianceUpdates.map((update) => (
                <div key={update.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className={`w-2 h-10 rounded-full ${update.status === 'Passed' ? 'bg-emerald-500' : 'bg-orange-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{update.title}</p>
                    <p className="text-xs text-slate-500 font-semibold">{update.date}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${
                    update.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {update.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
