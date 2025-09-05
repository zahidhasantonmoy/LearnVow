// Simplified Admin context provider
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
        // For demo purposes, we'll just check if the session exists
        // In a real application, this would validate against the database
        
        // Mock user data for authenticated user
        const mockUserData = {
          id: 1,
          email: 'admin@learnvow.com',
          full_name: 'Administrator',
          role: 'admin',
          is_active: true,
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setUser(mockUserData);
        setIsAuthenticated(true);
        console.log('Admin authenticated successfully');
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
      // Simplified authentication - just check credentials
      if (email === 'admin@learnvow.com' && password === 'admin123') {
        // Mock user data for successful login
        const mockUserData = {
          id: 1,
          email: 'admin@learnvow.com',
          full_name: 'Administrator',
          role: 'admin',
          is_active: true,
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Create session
        const sessionId = 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7-day session
        
        // Set session cookie
        document.cookie = `admin_session=${sessionId}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        console.log('Set session cookie:', sessionId);
        
        // Update user state
        setUser(mockUserData);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out admin user');
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