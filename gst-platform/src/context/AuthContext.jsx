import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../supabase';

const AuthContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://gst-crm-app.onrender.com';
const API_URL = BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL.replace(/\/$/, '')}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('--- AUTH CHECK ON MOUNT ---');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Supabase getSession error:", sessionError);
          throw sessionError;
        }

        if (session) {
          const token = session.access_token;
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user details to get role and permissions
          const response = await axios.get(`${API_URL}/auth/me`);
          if (response.data.success) {
            setUser(response.data.data);
            localStorage.setItem('user', JSON.stringify(response.data.data));
          } else {
            throw new Error('Failed to fetch user profile');
          }
        } else {
          localStorage.clear();
          setUser(null);
        }
      } catch (e) {
        console.error('Session restoration failed:', e);
        localStorage.clear();
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    console.log('>>>> AUTH_CONTEXT: login() called');
    console.log('>>>> DATA RECEIVED: email:', email, 'passwordExists:', !!password);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (error) {
      console.log('<<<< LOGIN API REQUEST FAILED');
      console.error('Error details:', error.response?.data || error.message);
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    console.log('>>>> LOGOUT CALLED');
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Supabase signOut error:", err);
    }
    localStorage.clear();
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
