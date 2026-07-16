import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Building, FileText, BookOpen, HandCoins } from 'lucide-react';

const ManagerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Manager Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back, {user?.username}. Overview of your assigned tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          { title: 'Assigned Students', value: '45', icon: GraduationCap, color: 'bg-emerald-50 text-emerald-600' },
          { title: 'Institute', value: '1', icon: Building, color: 'bg-indigo-50 text-indigo-600' },
          { title: 'Reports', value: '8', icon: FileText, color: 'bg-blue-50 text-blue-600' },
          { title: 'Learning Service', value: 'Active', icon: BookOpen, color: 'bg-purple-50 text-purple-600' },
          { title: 'Credit Requests', value: '3', icon: HandCoins, color: 'bg-amber-50 text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 whitespace-nowrap">{stat.title}</p>
              <p className="text-xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Placeholder content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px]">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Student Activity</h2>
          <div className="flex items-center justify-center h-48 text-slate-400">
            Activity feed coming soon
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px]">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Pending Credit Requests</h2>
          <div className="flex items-center justify-center h-48 text-slate-400">
            Request list coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
