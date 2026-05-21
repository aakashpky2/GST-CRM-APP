import React, { useState } from 'react';
import {
  Plus, Search, Filter, Eye, Edit2, Trash2, X, Info,
  User, Mail, Lock, ChevronDown, Check, ToggleLeft, ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = ['Channel', 'Institute', 'Manager', 'Students'];
const FILTER_OPTIONS = ['All Users', 'Channel', 'Institute', 'Manager', 'Students'];

const STATUS_BADGE = {
  Active:   'bg-emerald-50 text-emerald-700 border-emerald-100',
  Inactive: 'bg-slate-50 text-slate-500 border-slate-100',
};

const ROLE_BADGE = {
  Channel:   'bg-blue-50 text-blue-700',
  Institute: 'bg-purple-50 text-purple-700',
  Manager:   'bg-orange-50 text-orange-700',
  Students:  'bg-cyan-50 text-cyan-700',
};

const initialUsers = [
  { id: 1, name: 'Aarav Sharma',   email: 'aarav@dbiz.in',   username: 'aarav_s',   role: 'Manager',   channel: 'North',    institute: 'IIM Ahmedabad', manager: '',            status: 'Active',   created: '2026-04-10' },
  { id: 2, name: 'Priya Nair',     email: 'priya@dbiz.in',   username: 'priya_n',   role: 'Students',  channel: 'South',    institute: 'IIT Madras',    manager: 'Aarav Sharma', status: 'Active',  created: '2026-04-15' },
  { id: 3, name: 'Rohit Verma',    email: 'rohit@dbiz.in',   username: 'rohit_v',   role: 'Institute', channel: 'East',     institute: '',              manager: '',            status: 'Inactive', created: '2026-03-22' },
  { id: 4, name: 'Sunita Gupta',   email: 'sunita@dbiz.in',  username: 'sunita_g',  role: 'Channel',   channel: '',         institute: '',              manager: '',            status: 'Active',   created: '2026-05-01' },
];

const DUMMY_CHANNELS   = ['North', 'South', 'East', 'West'];
const DUMMY_INSTITUTES = ['IIM Ahmedabad', 'IIT Madras', 'Delhi University', 'BITS Pilani'];
const DUMMY_MANAGERS   = ['Aarav Sharma', 'Sunita Gupta'];

/* ─── Reusable select ─── */
const Select = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 font-medium focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

/* ─── Main Page ─── */
const UserManagement = () => {
  const [users, setUsers]           = useState(initialUsers);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('All Users');
  const [isModalOpen, setModalOpen] = useState(false);
  const [error, setError]           = useState('');

  /* form state */
  const [fullName,   setFullName]   = useState('');
  const [email,      setEmail]      = useState('');
  const [username,   setUsername]   = useState('');
  const [password,   setPassword]   = useState('');
  const [role,       setRole]       = useState('');
  const [channel,    setChannel]    = useState('');
  const [institute,  setInstitute]  = useState('');
  const [manager,    setManager]    = useState('');
  const [isActive,   setIsActive]   = useState(true);

  const resetForm = () => {
    setFullName(''); setEmail(''); setUsername(''); setPassword('');
    setRole(''); setChannel(''); setInstitute(''); setManager('');
    setIsActive(true); setError('');
  };

  const openModal  = () => { resetForm(); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleCreate = (e) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) { setError('Full Name is required.'); return; }
    if (!email.trim())    { setError('Email is required.'); return; }
    if (!role)            { setError('Role is required.'); return; }

    setUsers((prev) => [...prev, {
      id:        prev.length + 1,
      name:      fullName.trim(),
      email:     email.trim(),
      username:  username.trim(),
      role,
      channel:   channel  || '—',
      institute: institute || '—',
      manager:   manager   || '—',
      status:    isActive ? 'Active' : 'Inactive',
      created:   new Date().toISOString().split('T')[0],
    }]);
    closeModal();
  };

  const handleDelete = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));

  /* filtered list */
  const visible = users.filter((u) => {
    const matchSearch = [u.name, u.email, u.role].some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    );
    const matchFilter = filter === 'All Users' || u.role === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Manage all system users</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 active:scale-95 transition-all"
        >
          <Plus size={18} />
          Create User
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-medium outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 shadow-sm transition-all"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none pl-10 pr-8 py-3 bg-white border border-slate-100 rounded-xl text-sm text-slate-700 font-semibold outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 shadow-sm cursor-pointer transition-all"
          >
            {FILTER_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {['Name', 'Email', 'Role', 'Channel', 'Institute', 'Manager', 'Status', 'Created Date', 'Actions'].map((col) => (
                  <th key={col} className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-slate-400 text-sm font-medium">
                    No users found.
                  </td>
                </tr>
              ) : visible.map((u, idx) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.name[0]}
                      </div>
                      <span className="font-semibold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{u.email}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${ROLE_BADGE[u.role] || 'bg-slate-50 text-slate-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{u.channel || '—'}</td>
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{u.institute || '—'}</td>
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{u.manager || '—'}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${STATUS_BADGE[u.status]}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">{u.created}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all">
                        <Eye size={15} />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create User Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Modal box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100/50 z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* X */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all active:scale-95 z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                {/* Modal header */}
                <div className="flex gap-4 items-start mb-6 pr-8">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Create New User</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Fill in the user details and assign a role to grant system access.
                    </p>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-red-600 text-xs font-semibold"
                  >
                    <Info size={16} /><span>{error}</span>
                  </motion.div>
                )}

                <form id="create-user-form" onSubmit={handleCreate} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                    <input
                      type="text" placeholder="e.g. Aarav Sharma" value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email *</label>
                    <input
                      type="email" placeholder="user@example.com" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
                    <input
                      type="text" placeholder="e.g. aarav_s" value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                    <input
                      type="password" placeholder="••••••••" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                    />
                  </div>

                  {/* Role */}
                  <Select label="Role *" value={role} onChange={(v) => { setRole(v); setChannel(''); setInstitute(''); setManager(''); }}
                    options={ROLES} placeholder="Select role..." />

                  {/* Conditional: Channel (Institute, Manager, Students) */}
                  {(role === 'Institute' || role === 'Manager' || role === 'Students') && (
                    <Select label="Channel" value={channel} onChange={setChannel}
                      options={DUMMY_CHANNELS} placeholder="Select channel..." />
                  )}

                  {/* Conditional: Institute (Manager, Students) */}
                  {(role === 'Manager' || role === 'Students') && (
                    <Select label="Institute" value={institute} onChange={setInstitute}
                      options={DUMMY_INSTITUTES} placeholder="Select institute..." />
                  )}

                  {/* Conditional: Manager (Students only) */}
                  {role === 'Students' && (
                    <Select label="Manager" value={manager} onChange={setManager}
                      options={DUMMY_MANAGERS} placeholder="Select manager..." />
                  )}

                  {/* Status toggle */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Status</label>
                    <button
                      type="button"
                      onClick={() => setIsActive((p) => !p)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all w-full ${
                        isActive
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : 'bg-slate-50 border-slate-100 text-slate-500'
                      }`}
                    >
                      {isActive
                        ? <ToggleRight size={24} className="text-emerald-500" />
                        : <ToggleLeft  size={24} className="text-slate-400" />
                      }
                      <span className="text-sm font-bold">{isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-white shrink-0">
                <button
                  type="button" onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit" form="create-user-form"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-md shadow-cyan-500/10 hover:opacity-95 active:scale-95 transition-all"
                >
                  Create User
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
