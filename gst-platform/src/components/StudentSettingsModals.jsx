import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../supabase';

export const SettingsModals = ({ activeModal, setActiveModal, user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.user_metadata?.full_name || '',
    mobile: user?.user_metadata?.phone || '',
    institute: user?.user_metadata?.institute || '',
    studentId: user?.user_metadata?.student_id || ''
  });

  const [notifications, setNotifications] = useState({
    email: true, learning: true, credits: true, courses: true
  });

  const [appearance, setAppearance] = useState('System Default');
  const [language, setLanguage] = useState('English');

  if (!activeModal) return null;

  const handleClose = () => setActiveModal(null);

  const checkPasswordStrength = (pass) => {
    return {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    };
  };

  const passStrength = checkPasswordStrength(passwordForm.new);
  const isPassValid = Object.values(passStrength).every(Boolean) && passwordForm.new === passwordForm.confirm && passwordForm.current;

  const handlePasswordUpdate = async () => {
    if (!isPassValid) return;
    setIsUpdating(true);

    try {
      // 1. Get the real email from Supabase using the stored token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Session token not found.');
        setIsUpdating(false);
        return;
      }

      const { data: { user: supabaseUser }, error: getUserError } = await supabase.auth.getUser(token);
      
      if (getUserError || !supabaseUser?.email) {
        toast.error('Could not verify user identity.');
        setIsUpdating(false);
        return;
      }

      // 2. Verify current password by attempting to sign in with the real email
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: supabaseUser.email,
        password: passwordForm.current,
      });

      if (signInError) {
        toast.error('Current password is incorrect.');
        setIsUpdating(false);
        return;
      }

      // 3. Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.new,
      });

      if (updateError) {
        toast.error(updateError.message || 'Failed to update password.');
      } else {
        toast.success('Password updated successfully!');
        setPasswordForm({ current: '', new: '', confirm: '' });
        handleClose();
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderContent = () => {
    switch (activeModal) {
      case 'profile':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email (Read Only)</label>
              <input type="email" value={user?.email || ''} disabled className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
              <input type="tel" value={profileForm.mobile} onChange={(e) => setProfileForm({...profileForm, mobile: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Institute</label>
              <input type="text" value={profileForm.institute} onChange={(e) => setProfileForm({...profileForm, institute: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={() => { toast.success('Profile updated successfully!'); handleClose(); }} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700">Save Changes</button>
            </div>
          </div>
        );
      
      case 'password':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
              <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={passwordForm.new} onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10 text-slate-900" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="text-xs space-y-1">
              <p className={passStrength.length ? "text-emerald-500 flex gap-1 items-center" : "text-slate-400 flex gap-1 items-center"}>{passStrength.length ? <Check size={12}/> : <span className="w-3"/>} Minimum 8 characters</p>
              <p className={passStrength.upper ? "text-emerald-500 flex gap-1 items-center" : "text-slate-400 flex gap-1 items-center"}>{passStrength.upper ? <Check size={12}/> : <span className="w-3"/>} One uppercase letter</p>
              <p className={passStrength.lower ? "text-emerald-500 flex gap-1 items-center" : "text-slate-400 flex gap-1 items-center"}>{passStrength.lower ? <Check size={12}/> : <span className="w-3"/>} One lowercase letter</p>
              <p className={passStrength.number ? "text-emerald-500 flex gap-1 items-center" : "text-slate-400 flex gap-1 items-center"}>{passStrength.number ? <Check size={12}/> : <span className="w-3"/>} One number</p>
              <p className={passStrength.special ? "text-emerald-500 flex gap-1 items-center" : "text-slate-400 flex gap-1 items-center"}>{passStrength.special ? <Check size={12}/> : <span className="w-3"/>} One special character</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900" />
              {passwordForm.confirm && passwordForm.new !== passwordForm.confirm && <p className="text-red-500 text-xs mt-1">Passwords do not match</p>}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleClose} disabled={isUpdating} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50">Cancel</button>
              <button disabled={!isPassValid || isUpdating} onClick={handlePasswordUpdate} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {isUpdating ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        );

      case 'notifications':
        const Toggle = ({ label, field }) => (
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <button onClick={() => setNotifications({...notifications, [field]: !notifications[field]})} className={`w-11 h-6 rounded-full transition-colors relative ${notifications[field] ? 'bg-cyan-500' : 'bg-slate-200'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications[field] ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        );
        return (
          <div className="space-y-2">
            <Toggle label="Email Notifications" field="email" />
            <Toggle label="Learning Reminders" field="learning" />
            <Toggle label="Credit Alerts" field="credits" />
            <Toggle label="Course Updates" field="courses" />
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={() => { toast.success('Preferences saved!'); handleClose(); }} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700">Save</button>
            </div>
          </div>
        );

      case 'appearance':
        const options = ['Light Mode', 'Dark Mode', 'System Default'];
        return (
          <div className="space-y-3">
            {options.map(opt => (
              <label key={opt} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="radio" name="theme" checked={appearance === opt} onChange={() => setAppearance(opt)} className="w-4 h-4 text-cyan-600" />
                <span className="text-sm font-medium text-slate-700">{opt}</span>
              </label>
            ))}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={() => { toast.success('Theme updated!'); handleClose(); }} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700">Save</button>
            </div>
          </div>
        );

      case 'language':
        const langs = ['English', 'Hindi', 'Malayalam', 'Tamil', 'Kannada'];
        return (
          <div className="space-y-3">
            {langs.map(l => (
              <label key={l} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="radio" name="lang" checked={language === l} onChange={() => setLanguage(l)} className="w-4 h-4 text-cyan-600" />
                <span className="text-sm font-medium text-slate-700">{l}</span>
              </label>
            ))}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={() => { toast.success('Language changed!'); handleClose(); }} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700">Save</button>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Credits Remaining</p>
              <p className="text-2xl font-black text-cyan-600">42</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Credits Used</p>
              <p className="text-2xl font-black text-emerald-600">8</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Watch Time</p>
              <p className="text-2xl font-black text-slate-800">12h 45m</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Videos</p>
              <p className="text-2xl font-black text-slate-800">14</p>
            </div>
            <div className="col-span-2 mt-4">
              <button onClick={handleClose} className="w-full px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200">Close</button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-800 mb-1">Current Session</p>
              <p className="text-xs text-slate-500 mb-3">Last login: Today, 10:45 AM<br/>Device: Windows • Chrome</p>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Now
              </div>
            </div>
            <button onClick={() => { toast.success('Logged out of all other devices.'); handleClose(); }} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">
              <AlertCircle size={16} /> Logout Other Devices
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center py-6">
            <p className="text-slate-500 text-sm mb-6">Information for {activeModal.replace('-', ' ')} goes here.</p>
            <button onClick={handleClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Close</button>
          </div>
        );
    }
  };

  const getTitle = () => {
    const titles = {
      profile: 'My Profile',
      password: 'Change Password',
      notifications: 'Notification Settings',
      appearance: 'Appearance',
      language: 'Language',
      stats: 'Learning Statistics',
      security: 'Privacy & Security',
      help: 'Help & Support',
      terms: 'Terms & Privacy'
    };
    return titles[activeModal] || activeModal;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">{getTitle()}</h3>
          <button onClick={handleClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
      </motion.div>
    </div>
  );
};
