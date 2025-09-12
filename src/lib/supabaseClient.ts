// Supabase client configuration with enhanced error handling
import { createClient } from '@supabase/supabase-js';

// Ensure these environment variables are set in Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htvficmfwlkxaoxgsslc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dmZpY21md2xreGFveGdzc2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzIyMTYsImV4cCI6MjA3MjMwODIxNn0.e03QaHrUvAKdqRVoC9C5P_PhWCNVx5blVVa1YQtL2PE';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'learnvow-app-1.0'
    }
  }
});

// Helper functions for common operations with error handling
export const getUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Content functions with enhanced error handling
export const getBooks = async () => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        authors(name),
        categories(name),
        publishers(name)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        authors(name),
        categories(name),
        publishers(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    throw error;
  }
};

export const getUserLibrary = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_libraries')
      .select(`
        content(
          *,
          authors(name),
          categories(name),
          publishers(name)
        )
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    
    return data.map((item: any) => item.content);
  } catch (error) {
    console.error('Error fetching user library:', error);
    throw error;
  }
};

// Function to test the connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};