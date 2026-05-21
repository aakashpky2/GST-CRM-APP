import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import SystemRole from './pages/SystemRole';
import UserManagement from './pages/UserManagement';
import Projects from './pages/Projects';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#050A14]">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="modules" element={<Modules />} />
            <Route path="modules/:id" element={<ModuleDetail />} />
            <Route path="compliance" element={<div className="p-8"><h1 className="text-2xl font-bold">Compliance Updates</h1><p className="text-slate-500 mt-2">Feature coming soon...</p></div>} />
            <Route path="resources" element={<div className="p-8"><h1 className="text-2xl font-bold">Resources</h1><p className="text-slate-500 mt-2">Feature coming soon...</p></div>} />
            <Route path="settings" element={<Settings />} />
            <Route path="projects" element={<Projects />} />
            <Route path="system-role" element={<SystemRole />} />
            <Route path="user-management" element={<UserManagement />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
