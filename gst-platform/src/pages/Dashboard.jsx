import React, { useState, useEffect } from 'react';
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
  ListChecks,
  Coins,
  History,
  PlusCircle,
  X,
  Wallet
} from 'lucide-react';
import { gstModules, weeklyActivity, complianceUpdates } from '../data/mockData';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  
  // Student Credit System States
  const [credits, setCredits] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showReqModal, setShowReqModal] = useState(false);
  const [reqAmount, setReqAmount] = useState('');
  const [reqReason, setReqReason] = useState('');
  const [reqLoading, setReqLoading] = useState(false);

  const fetchCreditsData = async () => {
    try {
      const credRes = await axios.get('http://localhost:5000/api/student/credits');
      if (credRes.data.success) {
        setCredits(credRes.data.credits);
      }
      const txRes = await axios.get('http://localhost:5000/api/student/credits/transactions');
      if (txRes.data.success) {
        setTransactions(txRes.data.transactions);
      }
    } catch (err) {
      console.error('Error fetching credits data:', err);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (user?.role === 'student') {
      fetchCreditsData();
    }
  }, [user]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!reqAmount || parseInt(reqAmount) <= 0) {
      toast.error('Please enter a valid credit amount.');
      return;
    }
    if (!reqReason.trim()) {
      toast.error('Please enter a reason for the credit request.');
      return;
    }

    setReqLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/student/credits/request', {
        requested_credits: parseInt(reqAmount),
        reason: reqReason.trim()
      });

      if (res.data.success) {
        toast.success('Credit request submitted successfully.');
        setShowReqModal(false);
        fetchCreditsData(); // Refresh history
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit credit request.');
    } finally {
      setReqLoading(false);
    }
  };
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
            {mounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
            )}
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

      {/* Student Credit Wallet System */}
      {user?.role === 'student' && (
        <div className="space-y-6 mt-8">
          <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Coins className="text-cyan-500 animate-bounce" size={26} />
                Credit Wallet System
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">Manage your learning service tokens and active credits</p>
            </div>
            <button
              onClick={() => { setReqAmount(''); setReqReason(''); setShowReqModal(true); }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-600 text-white rounded-xl font-bold text-sm transition-all hover:bg-cyan-700 active:scale-95 shadow-sm shadow-cyan-600/10 self-start sm:self-auto"
            >
              <PlusCircle size={16} />
              Request Credits
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Credits */}
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-500/10 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-2 translate-y-2 pointer-events-none">
                <Coins size={140} />
              </div>
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Total Credits Assigned</p>
              <p className="text-4xl font-extrabold mt-2">{credits?.total_credits ?? 0}</p>
              <div className="mt-4 flex items-center gap-2 text-indigo-100/80 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Accumulated learning credits</span>
              </div>
            </div>

            {/* Used Credits */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-500/10 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-2 translate-y-2 pointer-events-none">
                <Coins size={140} />
              </div>
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Used Credits</p>
              <p className="text-4xl font-extrabold mt-2">{credits?.used_credits ?? 0}</p>
              <div className="mt-4 flex items-center gap-2 text-emerald-100/80 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>Burned on credit-based modules</span>
              </div>
            </div>

            {/* Remaining Credits */}
            <div className="bg-gradient-to-br from-cyan-500 to-sky-600 p-6 rounded-3xl text-white shadow-lg shadow-cyan-500/10 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-2 translate-y-2 pointer-events-none">
                <Coins size={140} />
              </div>
              <p className="text-cyan-100 text-xs font-bold uppercase tracking-wider">Remaining Credits</p>
              <p className="text-4xl font-extrabold mt-2">{credits?.remaining_credits ?? 0}</p>
              <div className="mt-4 flex items-center gap-2 text-cyan-100/80 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${credits?.remaining_credits > 10 ? 'bg-white' : 'bg-red-400 animate-ping'}`} />
                <span>{credits?.remaining_credits === 0 ? 'Insufficient credits - request more' : 'Active and available to burn'}</span>
              </div>
            </div>
          </div>

          {/* Credit Usage History Table */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 overflow-hidden">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <History size={18} className="text-slate-500" />
              Credit Transaction History
            </h3>
            {transactions.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No credit transactions recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="py-3 px-4">Transaction Type</th>
                      <th className="py-3 px-4">Credits</th>
                      <th className="py-3 px-4">Balance After</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => {
                      const typeColors = {
                        credit_added: 'bg-indigo-50 text-indigo-700 border-indigo-100',
                        credit_used: 'bg-rose-50 text-rose-700 border-rose-100',
                        credit_request_approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                        credit_request_rejected: 'bg-red-50 text-red-700 border-red-100',
                      };
                      const typeLabels = {
                        credit_added: 'Credit Added',
                        credit_used: 'Credit Used',
                        credit_request_approved: 'Request Approved',
                        credit_request_rejected: 'Request Rejected',
                      };
                      return (
                        <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all font-medium text-slate-700">
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${typeColors[tx.transaction_type] || 'bg-slate-50 text-slate-600'}`}>
                              {typeLabels[tx.transaction_type] || tx.transaction_type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {tx.transaction_type === 'credit_used' || tx.transaction_type === 'credit_request_rejected' ? '-' : '+'}{tx.credits}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{tx.balance_after}</td>
                          <td className="py-3.5 px-4 text-slate-500">{tx.description}</td>
                          <td className="py-3.5 px-4 text-slate-400 text-xs">
                            {new Date(tx.created_at).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Request Credits Modal */}
      {showReqModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Coins className="text-cyan-500" size={24} />
                <h3 className="text-xl font-black text-slate-850">Request Credits</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReqModal(false)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 active:scale-95 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form id="request-credits-form" onSubmit={handleRequestSubmit} className="p-8 space-y-6">
              {/* Requested credits */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Requested Credits *</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 50"
                  value={reqAmount}
                  onChange={e => setReqAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reason / Message *</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Tell the Super Admin why you need more credits..."
                  value={reqReason}
                  onChange={e => setReqReason(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all resize-none"
                />
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-white">
              <button
                type="button"
                onClick={() => setShowReqModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="request-credits-form"
                disabled={reqLoading}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-cyan-600/15 transition-all"
              >
                {reqLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
