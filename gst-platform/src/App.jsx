import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RolesProvider } from './context/RolesContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChannelDashboard from './pages/ChannelDashboard';
import InstituteDashboard from './pages/InstituteDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import SystemRole from './pages/SystemRole';
import UserManagement from './pages/UserManagement';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LearningPage from './pages/LearningPage';
import GSTVideoPlayer from './pages/GSTVideoPlayer';
import WatchSessionsMonitoring from './pages/WatchSessionsMonitoring';

// Protected Route Component (General)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#050A14]">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Access Denied Component
const AccessDenied = () => (
  <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[2rem] border border-slate-100 shadow-sm mt-10 max-w-xl mx-auto text-center">
    <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
    <p className="text-slate-500 text-sm">You do not have permission to access this page.</p>
  </div>
);

// Generic Role Route Factory
const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#060B18]">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <AccessDenied />;
  
  return children;
};

// Permission Route Factory
const PermissionRoute = ({ children, permissionKey }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  
  const hasPermission = 
    user.role === 'superadmin' || 
    user.role === 'admin' || 
    user.permissions?.[permissionKey] === true;

  if (!hasPermission) return <AccessDenied />;
  
  return children;
};

function App() {
  return (
    <RolesProvider>
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Super Admin Routes */}
          <Route path="/superadmin/dashboard" element={
            <RoleRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </RoleRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <RoleRoute allowedRoles={['superadmin', 'admin']}>
              <AdminDashboard />
            </RoleRoute>
          } />

          {/* Protected Routes Wrapper */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            {/* Specific Role Dashboards */}
            <Route path="channel/dashboard" element={<RoleRoute allowedRoles={['channel']}><ChannelDashboard /></RoleRoute>} />
            <Route path="institute/dashboard" element={<RoleRoute allowedRoles={['institute']}><InstituteDashboard /></RoleRoute>} />
            <Route path="manager/dashboard" element={<RoleRoute allowedRoles={['manager']}><ManagerDashboard /></RoleRoute>} />
            <Route path="student/dashboard" element={<RoleRoute allowedRoles={['student']}><Dashboard /></RoleRoute>} />
            
            {/* If someone accesses / directly, we could redirect them but the dashboard layout handles the nested route. We will make index route dynamically handled or redirect */}
            <Route index element={<Navigate to="/login" replace />} />

            {/* Permission Based Routes */}
            <Route path="modules" element={<PermissionRoute permissionKey="learning_service"><Modules /></PermissionRoute>} />
            <Route path="modules/:id" element={<PermissionRoute permissionKey="learning_service"><ModuleDetail /></PermissionRoute>} />
            <Route path="learning/:service" element={<PermissionRoute permissionKey="learning_service"><LearningPage /></PermissionRoute>} />
            <Route path="learning/:service/video/:videoId" element={<PermissionRoute permissionKey="learning_service"><GSTVideoPlayer /></PermissionRoute>} />
            
            <Route path="settings" element={<Settings />} />
            <Route path="projects" element={<Projects />} />
            
            <Route path="system-role" element={<PermissionRoute permissionKey="admin_panel"><SystemRole /></PermissionRoute>} />
            <Route path="user-management" element={<PermissionRoute permissionKey="admin_panel"><UserManagement /></PermissionRoute>} />
            <Route path="watch-monitoring" element={<PermissionRoute permissionKey="admin_panel"><WatchSessionsMonitoring /></PermissionRoute>} />
            <Route path="team-management" element={<PermissionRoute permissionKey="hierarchy_management"><UserManagement /></PermissionRoute>} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </RolesProvider>
  );
}

export default App;
