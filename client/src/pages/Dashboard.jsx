import { useEffect, useState } from 'react';
import { itemService } from '../services/api';
import { 
  Users, 
  Briefcase, 
  Clock, 
  CheckCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await itemService.getAll();
        const projects = data.data;
        setStats({
          total: projects.length,
          active: projects.filter(p => p.status === 'active').length,
          completed: projects.filter(p => p.status === 'completed').length,
          pending: projects.filter(p => p.status === 'pending').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Projects', value: stats.total, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { name: 'Active', value: stats.active, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { name: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { name: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome to your project management center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card flex items-center gap-4 transition-transform hover:scale-[1.02]">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold dark:text-white">Recent Activity</h2>
            <Link to="/projects" className="text-primary-600 text-sm font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {/* Placeholder for activity feed */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mt-1">
                  <Users size={16} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm dark:text-slate-300">
                    <span className="font-semibold">New project</span> was created successfully.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white border-none">
          <h2 className="text-xl font-bold mb-2">Upgrade to Pro</h2>
          <p className="text-primary-100 mb-6">Get access to unlimited projects, real-time collaboration, and advanced analytics.</p>
          <button className="bg-white text-primary-600 px-6 py-2 rounded-lg font-bold hover:bg-primary-50 transition-colors shadow-lg">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
