// Admin authentication service
'use client';

import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';
import { cache } from 'react';

// Admin user interface
export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}

// Admin session interface
export interface AdminSession {
  id: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

// Admin login credentials
export interface AdminLoginCredentials {
  email: string;
  password: string;
}

// Hash password function (in a real app, this would be handled server-side)
const hashPassword = async (password: string): Promise<string> => {
  // Simple hashing for demo purposes - in production, use bcrypt or similar
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Admin authentication service
export class AdminAuthService {
  // Login admin user
  static async login(credentials: AdminLoginCredentials): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      // In a real implementation, this would be a server-side RPC call
      // For now, we'll simulate the login process
      
      // Hash the provided password for comparison
      const hashedPassword = await hashPassword(credentials.password);
      
      // Query the database for the user
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', credentials.email)
        .eq('is_active', true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'Invalid credentials' };
        }
        throw error;
      }
      
      // In a real app, we would use bcrypt.compare() here
      // For demo purposes, we're comparing the hashed password
      if (data.password_hash !== hashedPassword) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      // Update last login timestamp
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id);
      
      // Create session (in a real app, this would be handled server-side)
      const sessionId = this.generateSessionId();
      const sessionExpiry = new Date();
      sessionExpiry.setDate(sessionExpiry.getDate() + 7); // 7-day session
      
      await supabase
        .from('admin_sessions')
        .insert({
          id: sessionId,
          user_id: data.id,
          expires_at: sessionExpiry.toISOString()
        });
      
      // Set session cookie (in a real app, this would be HttpOnly)
      if (typeof window !== 'undefined') {
        document.cookie = `admin_session=${sessionId}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      }
      
      // Return user data without password hash
      const { password_hash, ...userData } = data;
      
      return { 
        success: true, 
        user: {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role as 'admin' | 'editor' | 'viewer',
          is_active: userData.is_active,
          last_login: userData.last_login,
          created_at: userData.created_at,
          updated_at: userData.updated_at
        }
      };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  }
  
  // Logout admin user
  static async logout(sessionId: string): Promise<boolean> {
    try {
      // Delete session from database
      const { error } = await supabase
        .from('admin_sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) throw error;
      
      // Clear session cookie
      if (typeof window !== 'undefined') {
        document.cookie = `admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
      
      return true;
    } catch (error) {
      console.error('Admin logout error:', error);
      return false;
    }
  }
  
  // Check if admin is authenticated
  static async isAuthenticated(sessionId?: string): Promise<{ isAuthenticated: boolean; user?: AdminUser }> {
    try {
      // Get session ID from cookie if not provided
      let sessionIdToCheck = sessionId;
      
      if (!sessionIdToCheck && typeof window !== 'undefined') {
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
          const [name, value] = cookie.split('=');
          acc[name] = value;
          return acc;
        }, {} as Record<string, string>);
        
        sessionIdToCheck = cookies.admin_session;
      }
      
      if (!sessionIdToCheck) {
        return { isAuthenticated: false };
      }
      
      // Check if session exists and is valid
      const { data: session, error: sessionError } = await supabase
        .from('admin_sessions')
        .select('*, admin_users(*)')
        .eq('id', sessionIdToCheck)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (sessionError || !session) {
        // Session invalid or expired, clear cookie
        if (typeof window !== 'undefined') {
          document.cookie = `admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
        return { isAuthenticated: false };
      }
      
      // Return user data
      const userData = session.admin_users;
      if (!userData) {
        return { isAuthenticated: false };
      }
      
      // Remove password hash from user data
      const { password_hash, ...safeUserData } = userData;
      
      return { 
        isAuthenticated: true,
        user: {
          id: safeUserData.id,
          email: safeUserData.email,
          full_name: safeUserData.full_name,
          role: safeUserData.role as 'admin' | 'editor' | 'viewer',
          is_active: safeUserData.is_active,
          last_login: safeUserData.last_login,
          created_at: safeUserData.created_at,
          updated_at: safeUserData.updated_at
        }
      };
    } catch (error) {
      console.error('Admin authentication check error:', error);
      return { isAuthenticated: false };
    }
  }
  
  // Get current admin user
  static async getCurrentUser(sessionId?: string): Promise<AdminUser | null> {
    const { isAuthenticated, user } = await this.isAuthenticated(sessionId);
    return isAuthenticated ? user || null : null;
  }
  
  // Generate session ID
  static generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Check user permissions
  static async hasPermission(userId: number, requiredRole: 'admin' | 'editor' | 'viewer'): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', userId)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      
      const roleHierarchy: Record<string, number> = {
        'viewer': 1,
        'editor': 2,
        'admin': 3
      };
      
      const userRoleLevel = roleHierarchy[data.role] || 0;
      const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
      
      return userRoleLevel >= requiredRoleLevel;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }
}