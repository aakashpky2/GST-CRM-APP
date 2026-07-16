import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://gst-crm-app.onrender.com';
const API_URL = BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL.replace(/\/$/, '')}/api`;

const StudentProfileModal = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/users/profile`);
      if (res.data.success) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const res = await axios.put(`${API_URL}/users/profile`, profile);
      if (res.data.success) {
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">My Profile</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-cyan-600" size={32} /></div>
          ) : (
            <div className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
              {success && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm">{success}</div>}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" name="full_name" value={profile?.full_name || ''} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email (Read Only)</label>
                <input type="text" value={profile?.username || ''} disabled className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                <input type="text" name="mobile_number" value={profile?.mobile_number || ''} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Institute</label>
                <input type="text" name="institute" value={profile?.institute || ''} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
                <input type="text" name="student_id" value={profile?.student_id || ''} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl font-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || loading} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentProfileModal;
