import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://gst-crm-app.onrender.com';
const API_URL = BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL.replace(/\/$/, '')}/api`;

const SettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/users/settings`);
      if (res.data.success) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (field) => {
    setSettings({ ...settings, [field]: !settings[field] });
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`${API_URL}/users/settings`, settings);
      onClose();
    } catch (err) {
      console.error(err);
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
          <h2 className="text-xl font-bold text-slate-800">Settings</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="flex justify-center"><Loader2 className="animate-spin text-cyan-600" size={32} /></div>
          ) : (
            <>
              <div>
                <h3 className="text-md font-bold text-slate-800 mb-3">Notifications</h3>
                <div className="space-y-3">
                  {['email_notifications', 'learning_reminders', 'credit_alerts', 'course_updates'].map((field) => (
                    <div key={field} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 capitalize">{field.replace('_', ' ')}</span>
                      <button 
                        onClick={() => handleToggle(field)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${settings?.[field] ? 'bg-cyan-500' : 'bg-slate-200'}`}
                      >
                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings?.[field] ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-md font-bold text-slate-800 mb-3">Appearance</h3>
                <select name="theme" value={settings?.theme || 'System Default'} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500">
                  <option value="Light Mode">Light Mode</option>
                  <option value="Dark Mode">Dark Mode</option>
                  <option value="System Default">System Default</option>
                </select>
              </div>

              <div>
                <h3 className="text-md font-bold text-slate-800 mb-3">Language</h3>
                <select name="language" value={settings?.language || 'English'} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500">
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Kannada">Kannada</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl font-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || loading} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsModal;
