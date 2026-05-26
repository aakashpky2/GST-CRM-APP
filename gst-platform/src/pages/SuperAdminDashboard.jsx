import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Radio, 
  Building2, 
  UserCheck, 
  GraduationCap, 
  Users, 
  ShieldAlert, 
  Settings as SettingsIcon, 
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Activity,
  Plus,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  MapPin,
  Mail,
  Shield,
  FileText,
  Coins,
  History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import UserManagement from './UserManagement';
import SystemRole from './SystemRole';

const SuperAdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Super Admin Credits System States
  const [creditRequests, setCreditRequests] = useState([]);
  const [creditTransactions, setCreditTransactions] = useState([]);
  const [creditsStats, setCreditsStats] = useState({
    totalAssigned: 0,
    totalUsed: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0
  });
  const [loadingRequests, setLoadingRequests] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'https://gst-crm-app.onrender.com/api';

  const fetchCreditsAdminData = async () => {
    setLoadingRequests(true);
    try {
      const reqRes = await axios.get(`${API_BASE}/superadmin/credit-requests`);
      if (reqRes.data.success) {
        setCreditRequests(reqRes.data.requests);
        
        // Calculate statistics dynamically
        const reqs = reqRes.data.requests;
        const pending = reqs.filter(r => r.status === 'pending').length;
        const approved = reqs.filter(r => r.status === 'approved').length;
        const rejected = reqs.filter(r => r.status === 'rejected').length;
        
        setCreditsStats(prev => ({
          ...prev,
          pendingCount: pending,
          approvedCount: approved,
          rejectedCount: rejected
        }));
      }
      
      const txRes = await axios.get(`${API_BASE}/superadmin/credit-transactions`);
      if (txRes.data.success) {
        setCreditTransactions(txRes.data.transactions);
        
        // Calculate credits stats
        const txs = txRes.data.transactions;
        const totalAssigned = txs
          .filter(t => t.transaction_type === 'credit_added' || t.transaction_type === 'credit_request_approved')
          .reduce((sum, t) => sum + t.credits, 0);
          
        const totalUsed = txs
          .filter(t => t.transaction_type === 'credit_used')
          .reduce((sum, t) => sum + t.credits, 0);

        setCreditsStats(prev => ({
          ...prev,
          totalAssigned,
          totalUsed
        }));
      }
    } catch (err) {
      console.error('Error fetching admin credits data:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchCreditsAdminData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await axios.post(`${API_BASE}/superadmin/credit-requests/${id}/approve`);
      if (res.data.success) {
        toast.success('Credits added successfully.');
        fetchCreditsAdminData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axios.post(`${API_BASE}/superadmin/credit-requests/${id}/reject`);
      if (res.data.success) {
        toast.success('Credit request rejected.');
        fetchCreditsAdminData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject request');
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Mock statistics data
  const stats = [
    { label: 'Total Channels', value: '38', change: '+12%', color: 'from-blue-600 to-cyan-500', icon: <Radio className="text-white" size={24} /> },
    { label: 'Total Institutes', value: '142', change: '+8%', color: 'from-indigo-600 to-purple-500', icon: <Building2 className="text-white" size={24} /> },
    { label: 'Total Managers', value: '89', change: '+15%', color: 'from-violet-600 to-fuchsia-500', icon: <UserCheck className="text-white" size={24} /> },
    { label: 'Total Students', value: '14,820', change: '+24%', color: 'from-pink-600 to-rose-500', icon: <GraduationCap className="text-white" size={24} /> },
    { label: 'Total Users', value: '19,240', change: '+18%', color: 'from-amber-600 to-orange-500', icon: <Users className="text-white" size={24} /> },
    { label: 'Active Users', value: '5,310', change: '+32%', color: 'from-emerald-600 to-teal-500', icon: <Activity className="text-white" size={24} /> },
  ];

  // Mock table & list contents for secondary views to make the app feel alive and detailed
  const channels = [
    { id: '1', name: 'Alpha Corporate', code: 'CH-ALP', institute: 'Delhi Tech', students: 1250, status: 'active' },
    { id: '2', name: 'Beta Learning', code: 'CH-BET', institute: 'Mumbai Academy', students: 840, status: 'active' },
    { id: '3', name: 'Gamma Skills', code: 'CH-GAM', institute: 'Bangalore Institute', students: 2310, status: 'active' },
    { id: '4', name: 'Delta Executive', code: 'CH-DEL', institute: 'Kolkata Center', students: 430, status: 'inactive' },
  ];

  const institutes = [
    { id: '1', name: 'National Institute of GST Studies', city: 'New Delhi', courses: 8, head: 'Dr. Ramesh Kumar', status: 'active' },
    { id: '2', name: 'Apex Business Academy', city: 'Mumbai', courses: 5, head: 'Sarah D\'souza', status: 'active' },
    { id: '3', name: 'Vanguard Tax School', city: 'Chennai', courses: 4, head: 'M. K. Stalin', status: 'active' },
    { id: '4', name: 'Eastern Commerce Center', city: 'Kolkata', courses: 2, head: 'A. Chatterjee', status: 'inactive' },
  ];

  const managers = [
    { id: '1', name: 'Anil Mehta', email: 'anil@dbiz.com', channel: 'Alpha Corporate', region: 'North', status: 'active' },
    { id: '2', name: 'Priyah Sharma', email: 'priya@dbiz.com', channel: 'Beta Learning', region: 'West', status: 'active' },
    { id: '3', name: 'Karthik Raja', email: 'karthik@dbiz.com', channel: 'Gamma Skills', region: 'South', status: 'active' },
    { id: '4', name: 'Debashis Roy', email: 'debashis@dbiz.com', channel: 'Delta Executive', region: 'East', status: 'inactive' },
  ];

  // Menu items list
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Channels', icon: <Radio size={20} /> },
    { name: 'Institutes', icon: <Building2 size={20} /> },
    { name: 'Managers', icon: <UserCheck size={20} /> },
    { name: 'Students', icon: <GraduationCap size={20} /> },
    { name: 'Credit Requests', icon: <Coins size={20} /> },
    { name: 'Credit Transactions', icon: <History size={20} /> },
    { name: 'User Management', icon: <Users size={20} /> },
    { name: 'System Roles', icon: <ShieldAlert size={20} /> },
    { name: 'Settings', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 flex overflow-hidden">
      
      {/* Sidebar Panel */}
      <aside className="w-72 bg-[#0B0F1E] border-r border-slate-800/60 flex flex-col justify-between shrink-0 z-20">
        <div>
          {/* Sidebar Header / Logo */}
          <div className="h-20 flex items-center gap-3 px-8 border-b border-slate-800/40">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <span className="font-extrabold text-white tracking-wide text-lg block">DBIZ CRM</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block -mt-1">Super Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-200 group relative
                    ${isActive 
                      ? 'text-white bg-indigo-600 shadow-[0_4px_20px_rgba(99,102,241,0.25)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                >
                  <span className={`transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="activeSideIndicator"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-white rounded-l-full" 
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="p-4 border-t border-slate-800/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold text-rose-400 hover:text-white hover:bg-rose-500/10 transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Ambient background glow inside content area */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

        {/* Top Navbar */}
        <header className="h-20 border-b border-slate-800/60 bg-[#070C1B]/50 backdrop-blur-md px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
            <span>Enterprise</span>
            <span className="text-slate-600">/</span>
            <span className="text-white">{activeTab}</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Input */}
            <div className="relative w-64 hidden sm:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl text-xs text-white placeholder:text-slate-600 bg-white/[0.02] border border-slate-800 outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative w-10 h-10 rounded-xl bg-white/[0.02] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-500/10">
                SA
              </div>
              <div className="hidden md:block">
                <span className="block text-xs font-bold text-white leading-none">Super Admin</span>
                <span className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase block mt-1">Active</span>
              </div>
              <ChevronDown size={14} className="text-slate-500 hidden md:block" />
            </div>
          </div>
        </header>

        {/* Dashboard Dashboard Views */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              
              {/* RENDER VIEW: DASHBOARD */}
              {activeTab === 'Dashboard' && (
                <>
                  {/* Welcome Message Card */}
                  <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-gradient-to-br from-[#101730] to-[#0A0D1B] p-8 md:p-10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
                    <div className="relative z-10 space-y-4 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                        <Activity size={14} className="text-indigo-400 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Live Dashboard</span>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        Welcome Super Admin
                      </h1>
                      <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                        Manage corporate channels, educational institutes, regional managers, and track live student enrolments across your custom ecosystem database.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-colors shadow-lg shadow-indigo-600/25">
                          <Plus size={16} />
                          Register Channel
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white rounded-xl font-bold text-xs transition-colors">
                          <FileText size={16} className="text-slate-400" />
                          View Operations Log
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                      <div 
                        key={idx}
                        className="bg-[#0A0F20] border border-slate-800/80 rounded-[1.5rem] p-6 shadow-xl hover:border-slate-700 transition-all duration-300 group"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                            {stat.icon}
                          </div>
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp size={12} />
                            {stat.change}
                          </span>
                        </div>
                        <p className="text-4xl font-extrabold text-white tracking-tight">{stat.value}</p>
                        <p className="text-sm font-semibold text-slate-300 mt-2">{stat.label}</p>
                        <p className="text-xs text-slate-500 mt-1">Refreshed live just now</p>
                      </div>
                    ))}
                  </div>

                  {/* Credit Management System Overview */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Coins className="text-indigo-400" size={20} />
                      Student Credits Management Overview
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                      <div className="bg-[#0A0F20] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Total Assigned</p>
                        <p className="text-3xl font-extrabold text-white mt-2">{creditsStats.totalAssigned}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Assigned to students</p>
                      </div>
                      <div className="bg-[#0A0F20] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Total Used</p>
                        <p className="text-3xl font-extrabold text-white mt-2">{creditsStats.totalUsed}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Burned by students</p>
                      </div>
                      <div className="bg-[#0A0F20] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Pending Requests</p>
                        <p className="text-3xl font-extrabold text-white mt-2">{creditsStats.pendingCount}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Awaiting approval</p>
                      </div>
                      <div className="bg-[#0A0F20] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Approved Requests</p>
                        <p className="text-3xl font-extrabold text-white mt-2">{creditsStats.approvedCount}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Granted assignments</p>
                      </div>
                      <div className="bg-[#0A0F20] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden col-span-2 lg:col-span-1">
                        <p className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Rejected Requests</p>
                        <p className="text-3xl font-extrabold text-white mt-2">{creditsStats.rejectedCount}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Denied requests</p>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Information Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Systems logs */}
                    <div className="bg-[#0A0F20] border border-slate-800/80 rounded-[2rem] p-8 shadow-xl">
                      <h2 className="text-xl font-bold text-white mb-6">System Health & Services</h2>
                      <div className="space-y-4">
                        {[
                          { service: 'Authentication API', time: '1.2ms', status: 'Optimal', indicator: 'bg-emerald-500' },
                          { service: 'Supabase DB Subscription', time: '8.4ms', status: 'Optimal', indicator: 'bg-emerald-500' },
                          { service: 'JWT Signer Service', time: '0.4ms', status: 'Optimal', indicator: 'bg-emerald-500' },
                          { service: 'External Mailing Gateway', time: '142ms', status: 'Warning', indicator: 'bg-amber-500' },
                        ].map((srv, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
                            <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full ${srv.indicator}`} />
                              <span className="text-sm font-bold text-white">{srv.service}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-500">Latency: {srv.time}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 font-semibold">{srv.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Access Card */}
                    <div className="bg-[#0A0F20] border border-slate-800/80 rounded-[2rem] p-8 shadow-xl">
                      <h2 className="text-xl font-bold text-white mb-6">Regional Metrics</h2>
                      <div className="space-y-5">
                        {[
                          { region: 'North Zone', count: '4,820 Students', percent: '32.5%', fill: 'w-[32.5%]', color: 'bg-blue-500' },
                          { region: 'South Zone', count: '3,890 Students', percent: '26.2%', fill: 'w-[26.2%]', color: 'bg-indigo-500' },
                          { region: 'West Zone', count: '3,540 Students', percent: '23.9%', fill: 'w-[23.9%]', color: 'bg-purple-500' },
                          { region: 'East Zone', count: '2,570 Students', percent: '17.4%', fill: 'w-[17.4%]', color: 'bg-rose-500' },
                        ].map((reg, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-slate-300">{reg.region}</span>
                              <span className="text-slate-400">{reg.count} ({reg.percent})</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                              <div className={`h-full ${reg.color} ${reg.fill} rounded-full`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* RENDER VIEW: CHANNELS */}
              {activeTab === 'Channels' && (
                <div className="bg-[#0A0F20] border border-slate-800/80 rounded-[2rem] p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Channels Ecosystem</h2>
                      <p className="text-sm text-slate-500 mt-1">Enterprise client channels associated with learning academies</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-colors">
                      <Plus size={16} />
                      Register New Channel
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <th className="py-4 px-4">Channel Name</th>
                          <th className="py-4 px-4">Code</th>
                          <th className="py-4 px-4">Affiliated Institute</th>
                          <th className="py-4 px-4">Students Enrolled</th>
                          <th className="py-4 px-4">Status</th>
                          <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-sm">
                        {channels.map((chan) => (
                          <tr key={chan.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="py-4 px-4 font-bold text-white">{chan.name}</td>
                            <td className="py-4 px-4 text-indigo-400 font-mono text-xs">{chan.code}</td>
                            <td className="py-4 px-4 text-slate-300">{chan.institute}</td>
                            <td className="py-4 px-4 font-semibold text-slate-200">{chan.students.toLocaleString()}</td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                ${chan.status === 'active' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                }`}>
                                {chan.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="inline-flex gap-2">
                                <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                                  <Edit2 size={14} />
                                </button>
                                <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* RENDER VIEW: INSTITUTES */}
              {activeTab === 'Institutes' && (
                <div className="bg-[#0A0F20] border border-slate-800/80 rounded-[2rem] p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Affiliated Institutes</h2>
                      <p className="text-sm text-slate-500 mt-1">Colleges and educational networks participating in learning programs</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-colors">
                      <Plus size={16} />
                      Add Institute
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {institutes.map((inst) => (
                      <div key={inst.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md flex justify-between items-start">
                        <div className="space-y-3">
                          <h3 className="text-lg font-bold text-white leading-tight">{inst.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <MapPin size={14} />
                            <span>{inst.city}</span>
                            <span>&bull;</span>
                            <span>{inst.courses} Core Modules</span>
                          </div>
                          <p className="text-xs text-slate-500">Director: {inst.head}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${inst.status === 'active' 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                          }`}>
                          {inst.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RENDER VIEW: MANAGERS */}
              {activeTab === 'Managers' && (
                <div className="bg-[#0A0F20] border border-slate-800/80 rounded-[2rem] p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white">System Managers</h2>
                      <p className="text-sm text-slate-500 mt-1">Assigned representatives managing corporate channels</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-colors">
                      <Plus size={16} />
                      Assign Manager
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <th className="py-4 px-4">Manager Info</th>
                          <th className="py-4 px-4">Assigned Channel</th>
                          <th className="py-4 px-4">Jurisdiction Region</th>
                          <th className="py-4 px-4">Status</th>
                          <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-sm">
                        {managers.map((mgr) => (
                          <tr key={mgr.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-bold text-white">{mgr.name}</div>
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Mail size={12} />
                                {mgr.email}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-300 font-semibold">{mgr.channel}</td>
                            <td className="py-4 px-4 text-indigo-300 font-medium">{mgr.region} Zone</td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                ${mgr.status === 'active' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                }`}>
                                {mgr.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="inline-flex gap-2">
                                <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                                  <Edit2 size={14} />
                                </button>
                                <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* RENDER VIEW: CREDIT REQUESTS */}
              {activeTab === 'Credit Requests' && (
                <div className="bg-[#0A0F20] border border-slate-800/80 rounded-[2rem] p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Coins className="text-indigo-400" size={24} />
                        Credit Request Pipeline
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">Review and approve or reject student learning credit requests</p>
                    </div>
                  </div>

                  {creditRequests.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 text-sm">
                      No credit requests submitted by students yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <th className="py-4 px-4">Student Info</th>
                            <th className="py-4 px-4">Current Credits</th>
                            <th className="py-4 px-4">Requested Credits</th>
                            <th className="py-4 px-4">Reason / Message</th>
                            <th className="py-4 px-4">Requested Date</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-sm">
                          {creditRequests.map((reqItem) => (
                            <tr key={reqItem.id} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-4 px-4">
                                <div className="font-bold text-white">{reqItem.student_name}</div>
                                <div className="text-xs text-slate-500">{reqItem.student_email}</div>
                              </td>
                              <td className="py-4 px-4 font-mono font-bold text-slate-300">{reqItem.current_remaining}</td>
                              <td className="py-4 px-4 font-mono font-bold text-indigo-400 text-base">+{reqItem.requested_credits}</td>
                              <td className="py-4 px-4 text-slate-300 max-w-xs truncate" title={reqItem.reason}>
                                {reqItem.reason}
                              </td>
                              <td className="py-4 px-4 text-slate-500 text-xs">
                                {new Date(reqItem.created_at).toLocaleString()}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                  ${reqItem.status === 'approved' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : reqItem.status === 'rejected' 
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  }`}>
                                  {reqItem.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                {reqItem.status === 'pending' ? (
                                  <div className="inline-flex gap-2 justify-end">
                                    <button
                                      onClick={() => handleApprove(reqItem.id)}
                                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1 active:scale-95"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleReject(reqItem.id)}
                                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-1 active:scale-95"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-slate-500 text-xs">Processed</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* RENDER VIEW: CREDIT TRANSACTIONS */}
              {activeTab === 'Credit Transactions' && (
                <div className="bg-[#0A0F20] border border-slate-800/80 rounded-[2rem] p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <History className="text-indigo-400" size={24} />
                        Credit Transactions Log
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">Audit log of all learning credit changes and consumption across the system</p>
                    </div>
                  </div>

                  {creditTransactions.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 text-sm">
                      No transactions recorded yet in the system.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <th className="py-4 px-4">Student Info</th>
                            <th className="py-4 px-4">Transaction Type</th>
                            <th className="py-4 px-4">Credits</th>
                            <th className="py-4 px-4">Balance After</th>
                            <th className="py-4 px-4">Description</th>
                            <th className="py-4 px-4">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-sm">
                          {creditTransactions.map((tx) => {
                            const typeColors = {
                              credit_added: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25',
                              credit_used: 'bg-rose-500/10 text-rose-400 border border-rose-500/25',
                              credit_request_approved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
                              credit_request_rejected: 'bg-red-500/10 text-red-400 border border-red-500/25',
                            };
                            const typeLabels = {
                              credit_added: 'Credit Added',
                              credit_used: 'Credit Used',
                              credit_request_approved: 'Request Approved',
                              credit_request_rejected: 'Request Rejected',
                            };
                            return (
                              <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                                <td className="py-4 px-4 font-bold text-white">
                                  <div>{tx.student_name}</div>
                                  <div className="text-xs text-slate-500 font-normal">{tx.student_email}</div>
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${typeColors[tx.transaction_type] || 'bg-slate-800 text-slate-400'}`}>
                                    {typeLabels[tx.transaction_type] || tx.transaction_type}
                                  </span>
                                </td>
                                <td className="py-4 px-4 font-bold text-white">
                                  {tx.transaction_type === 'credit_used' || tx.transaction_type === 'credit_request_rejected' ? '-' : '+'}{tx.credits}
                                </td>
                                <td className="py-4 px-4 font-bold text-slate-300">{tx.balance_after}</td>
                                <td className="py-4 px-4 text-slate-300">{tx.description}</td>
                                <td className="py-4 px-4 text-slate-500 text-xs">
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
              )}

              {/* RENDER VIEW: SYSTEM ROLES */}
              {activeTab === 'System Roles' && (
                <div className="bg-white p-8 rounded-[2rem] shadow-xl text-slate-800">
                  <SystemRole />
                </div>
              )}

              {/* RENDER VIEW: USER MANAGEMENT */}
              {activeTab === 'User Management' && (
                <div className="bg-white p-8 rounded-[2rem] shadow-xl text-slate-800">
                  <UserManagement />
                </div>
              )}

              {/* OTHER MOCK TAB VIEWS */}
              {['Students', 'Settings'].includes(activeTab) && (
                <div className="bg-[#0A0F20] border border-slate-800/80 rounded-[2rem] p-8 shadow-xl">
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                      <Shield size={32} />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-xl font-bold text-white">{activeTab} Control Center</h3>
                      <p className="text-slate-400 text-sm">
                        This section lists and allows modifications of system-wide {activeTab.toLowerCase()}. Advanced security parameters are actively enforced for the Super Admin panel.
                      </p>
                    </div>
                    <div className="inline-flex gap-3">
                      <button className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors">
                        Configure Settings
                      </button>
                      <button className="px-5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-slate-300 font-bold text-xs transition-colors">
                        Load Backup Records
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
