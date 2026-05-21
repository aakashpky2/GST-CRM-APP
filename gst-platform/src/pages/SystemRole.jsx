import React, { useState } from 'react';
import { Plus, Shield, Users, Key, Edit2, Trash2, X, Info, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PERMISSION_OPTIONS = ['Channel', 'Institute', 'Manager', 'Students'];

const SystemRole = () => {
  const initialRoles = [
    {
      name: 'System Administrator',
      usersCount: 3,
      description: 'Full access to all system modules, configurations, and settings. Can manage user roles and permissions.',
      permissions: ['Manage Users', 'Edit Billing', 'System Config', 'Export Reports', 'Access Modules'],
      color: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Tax Compliance Manager',
      usersCount: 8,
      description: 'Intermediate access to manage GST filing, client accounts, work assignment, and compliance reviews.',
      permissions: ['Access Modules', 'Export Reports', 'Manage Tasks', 'Edit Records'],
      color: 'from-emerald-500 to-cyan-500',
    },
    {
      name: 'General Staff',
      usersCount: 15,
      description: 'Basic access to view assigned learning paths, complete tasks, and update personal profiles.',
      permissions: ['Access Modules', 'View Tasks'],
      color: 'from-blue-500 to-indigo-600',
    },
  ];

  const [roles, setRoles] = useState(initialRoles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Form state
  const [roleName, setRoleName] = useState('');
  const [priorityOrder, setPriorityOrder] = useState('99');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [error, setError] = useState('');

  const handleOpenModal = () => {
    setRoleName('');
    setPriorityOrder('99');
    setDescription('');
    setSelectedPermissions([]);
    setError('');
    setActiveTab('details');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const togglePermission = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleCreateRole = (e) => {
    e.preventDefault();
    setError('');
    if (!roleName.trim()) {
      setError('Role Name is required.');
      setActiveTab('details');
      return;
    }
    setRoles((prev) => [
      ...prev,
      {
        name: roleName.trim(),
        usersCount: 0,
        description: description.trim() || 'No description provided.',
        permissions: selectedPermissions.length > 0 ? selectedPermissions : ['Access Modules'],
        color: 'from-purple-500 to-indigo-600',
      },
    ]);
    setIsModalOpen(false);
  };

  const handleDeleteRole = (name) =>
    setRoles((prev) => prev.filter((r) => r.name !== name));

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Role</h1>
          <p className="text-slate-500 font-medium">Manage user roles and permissions</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:opacity-95 active:scale-95"
        >
          <Plus size={18} />
          Create Role
        </button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {roles.map((role, idx) => (
          <motion.div
            key={role.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center text-white shadow-md`}>
                  <Shield size={22} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
                  <Users size={14} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">{role.usersCount} users</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">{role.name}</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">{role.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm) => (
                    <span key={perm} className="text-xs bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1 rounded-lg font-semibold flex items-center gap-1">
                      <Key size={10} className="text-slate-400" />
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 mt-8 pt-6">
              <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-cyan-600 transition-colors">
                <Edit2 size={14} />
                Edit Role
              </button>
              <button
                onClick={() => handleDeleteRole(role.name)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Role Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100/50 z-10 overflow-hidden"
            >
              {/* X Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all active:scale-95"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                {/* Modal Header */}
                <div className="flex gap-4 items-start mb-6 pr-8">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Create New System Role</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Configure the role details and assign granular permissions to control user access.
                    </p>
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6 text-red-600 text-xs font-semibold"
                  >
                    <Info size={16} />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-slate-100 mb-6">
                  {['details', 'permissions'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-bold border-b-2 px-1 transition-all capitalize ${
                        tab !== 'details' ? 'ml-6' : ''
                      } ${
                        activeTab === tab
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab === 'details' ? 'Role Details' : 'Permissions'}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={handleCreateRole}>
                  {/* Role Details Tab */}
                  {activeTab === 'details' && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Role Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. HR Manager"
                          value={roleName}
                          onChange={(e) => setRoleName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 transition-all focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none placeholder:text-slate-400 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Priority Order
                        </label>
                        <input
                          type="number"
                          placeholder="99"
                          value={priorityOrder}
                          onChange={(e) => setPriorityOrder(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 transition-all focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none placeholder:text-slate-400 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Description
                        </label>
                        <textarea
                          rows="3"
                          placeholder="Briefly describe the role..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 transition-all focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none resize-none placeholder:text-slate-400 font-medium leading-relaxed"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Permissions Tab */}
                  {activeTab === 'permissions' && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                        Select Permissions
                      </p>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
                        {PERMISSION_OPTIONS.map((perm, idx) => {
                          const isChecked = selectedPermissions.includes(perm);
                          return (
                            <div
                              key={perm}
                              onClick={() => togglePermission(perm)}
                              className={`flex items-center gap-4 px-5 py-4 cursor-pointer select-none transition-colors ${
                                idx !== PERMISSION_OPTIONS.length - 1
                                  ? 'border-b border-slate-100'
                                  : ''
                              } ${isChecked ? 'bg-cyan-500/5' : 'hover:bg-white'}`}
                            >
                              {/* Custom checkbox */}
                              <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                                  isChecked
                                    ? 'border-cyan-500 bg-cyan-500'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isChecked && <Check size={12} className="text-white" strokeWidth={3} />}
                              </div>
                              <span className={`text-sm font-semibold ${isChecked ? 'text-cyan-700' : 'text-slate-700'}`}>
                                {perm}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Footer Buttons */}
                  <div className="flex items-center justify-end gap-3 mt-8 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 active:scale-95 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-md shadow-cyan-500/10 hover:opacity-95 active:scale-95 transition-all"
                    >
                      Create Role
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SystemRole;
