// Admin context provider
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}

interface AdminContextType {
  user: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasPermission: (requiredRole: 'admin' | 'editor' | 'viewer') => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking admin auth status...');
      // Check for existing admin session
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);
      
      const sessionId = cookies.admin_session;
      console.log('Session ID from cookie:', sessionId);
      
      if (sessionId) {
        // Validate session with backend
        const { data, error } = await supabase
          .from('admin_sessions')
          .select('*, admin_users(*)')
          .eq('id', sessionId)
          .gt('expires_at', new Date().toISOString())
          .single();
        
        console.log('Session validation result:', { data, error });
        
        if (!error && data) {
          const userData = data.admin_users;
          console.log('User data:', userData);
          if (userData && userData.is_active) {
            setUser({
              id: userData.id,
              email: userData.email,
              full_name: userData.full_name,
              role: userData.role as 'admin' | 'editor' | 'viewer',
              is_active: userData.is_active,
              last_login: userData.last_login,
              created_at: userData.created_at,
              updated_at: userData.updated_at
            });
            setIsAuthenticated(true);
            console.log('Admin authenticated successfully');
            
            // Update last activity
            await supabase
              .from('admin_users')
              .update({ last_login: new Date().toISOString() })
              .eq('id', userData.id);
          } else {
            console.log('User not active or no user data');
          }
        } else {
          console.log('Session validation failed:', error);
        }
      } else {
        console.log('No session ID found in cookies');
      }
    } catch (error) {
      console.error('Error checking admin auth status:', error);
    } finally {
      setLoading(false);
      console.log('Finished checking admin auth status');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting admin login for:', email);
      // Hash password for comparison (in a real app, this would be server-side)
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      console.log('Hashed password:', hashedPassword);
      
      // Check credentials
      const { data: userData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', hashedPassword)
        .eq('is_active', true)
        .single();
      
      console.log('Login result:', { userData, error });
      
      if (error) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      // Create session
      const sessionId = 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7-day session
      
      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          id: sessionId,
          user_id: userData.id,
          expires_at: expiresAt.toISOString()
        });
      
      if (sessionError) {
        throw sessionError;
      }
      
      // Set session cookie
      document.cookie = `admin_session=${sessionId}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      console.log('Set session cookie:', sessionId);
      
      // Update user state
      setUser({
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role as 'admin' | 'editor' | 'viewer',
        is_active: userData.is_active,
        last_login: userData.last_login,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      });
      setIsAuthenticated(true);
      
      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id);
      
      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out admin user');
      // Get session ID from cookie
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);
      
      const sessionId = cookies.admin_session;
      
      if (sessionId) {
        // Delete session from database
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('id', sessionId);
      }
      
      // Clear session cookie
      document.cookie = `admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      
      // Update user state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login page
      router.push('/admin/login');
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  const hasPermission = async (requiredRole: 'admin' | 'editor' | 'viewer') => {
    if (!user) return false;
    
    const roleHierarchy: Record<string, number> = {
      'viewer': 1,
      'editor': 2,
      'admin': 3
    };
    
    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasPermission
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}