import React, { useState, useEffect } from 'react';
import { X, Loader2, Award, Clock, PlayCircle, Wallet } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://gst-crm-app.onrender.com';
const API_URL = BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL.replace(/\/$/, '')}/api`;

const LearningStatisticsModal = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/users/learning-statistics`);
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Learning Statistics</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-cyan-600" size={32} /></div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                <div className="flex items-center gap-2 text-cyan-600 mb-2"><Wallet size={18} /> <span className="font-medium text-sm">Credits Remaining</span></div>
                <div className="text-2xl font-bold text-slate-800">{stats?.creditsRemaining}</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 text-amber-600 mb-2"><Award size={18} /> <span className="font-medium text-sm">Credits Used</span></div>
                <div className="text-2xl font-bold text-slate-800">{stats?.creditsUsed}</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-600 mb-2"><PlayCircle size={18} /> <span className="font-medium text-sm">Videos Completed</span></div>
                <div className="text-2xl font-bold text-slate-800">{stats?.videosCompleted}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2 text-purple-600 mb-2"><Clock size={18} /> <span className="font-medium text-sm">Watch Time (s)</span></div>
                <div className="text-2xl font-bold text-slate-800">{stats?.totalWatchTime}</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LearningStatisticsModal;
