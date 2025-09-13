// Context for managing Supabase auth state
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error: any) {
        console.error('Error getting session:', error);
        setError('Failed to load authentication session. Please try again.');
      } finally {
        setLoading(false);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      });
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    getSession();
  }, []);

  const signUp = async (email: string, password: string) => {
    clearError();
    
    try {
      const result = await supabase.auth.signUp({ email, password });
      if (result.error) {
        setError(result.error.message);
        throw result.error;
      }
      return result;
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError('Failed to sign up. Please try again.');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    clearError();
    
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        setError(result.error.message);
        throw result.error;
      }
      return result;
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError('Failed to sign in. Please check your credentials and try again.');
      throw error;
    }
  };

  const signOut = async () => {
    clearError();
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
      throw error;
    }
  };

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  // Return a default context when used outside of provider to avoid errors during static generation
  if (context === undefined) {
    return {
      user: null,
      signUp: async () => {},
      signIn: async () => {},
      signOut: async () => {},
      loading: true,
      error: null,
      clearError: () => {}
    };
  }
  return context;
}