import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Network, Users, Activity, FileText } from 'lucide-react';

const ChannelDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Channel Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back, {user?.username}. Here's what's happening with your channels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Institutes', value: '12', icon: Network, color: 'bg-indigo-50 text-indigo-600' },
          { title: 'Managers', value: '34', icon: Users, color: 'bg-emerald-50 text-emerald-600' },
          { title: 'Analytics', value: '89%', icon: Activity, color: 'bg-amber-50 text-amber-600' },
          { title: 'Reports', value: '5', icon: FileText, color: 'bg-blue-50 text-blue-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Placeholder content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px]">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Institutes</h2>
          <div className="flex items-center justify-center h-48 text-slate-400">
            Data visualization coming soon
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px]">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Channel Analytics</h2>
          <div className="flex items-center justify-center h-48 text-slate-400">
            Chart data coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelDashboard;
