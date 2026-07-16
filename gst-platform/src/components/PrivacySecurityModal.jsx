import React from 'react';
import { X, ShieldAlert, Laptop, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacySecurityModal = ({ isOpen, onClose }) => {
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
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert size={24} className="text-cyan-600" /> Privacy & Security
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Active Sessions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                    <Laptop size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Windows PC - Chrome</p>
                    <p className="text-xs text-emerald-600 font-medium">Active Now</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">iPhone - Safari</p>
                    <p className="text-xs text-slate-500">Last seen: 2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
            Logout from all other devices
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacySecurityModal;
