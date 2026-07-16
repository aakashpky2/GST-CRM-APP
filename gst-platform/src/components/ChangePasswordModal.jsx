import React, { useState } from 'react';
import { X, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://gst-crm-app.onrender.com';
const API_URL = BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL.replace(/\/$/, '')}/api`;

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    // Add regex validation if needed
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwords.newPassword)) {
      return setError('Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.');
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const res = await axios.post(`${API_URL}/auth/change-password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      if (res.data.success) {
        setSuccess(res.data.message);
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
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
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Change Password</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          {success && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm">{success}</div>}
          
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <input type={showCurrent ? "text" : "password"} name="currentPassword" value={passwords.currentPassword} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500" />
            <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-8 text-slate-400 hover:text-slate-600">
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input type={showNew ? "text" : "password"} name="newPassword" value={passwords.newPassword} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500" />
            <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-8 text-slate-400 hover:text-slate-600">
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input type={showNew ? "text" : "password"} name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500" />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl font-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Update Password
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePasswordModal;
