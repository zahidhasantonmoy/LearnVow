// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

// Ensure these environment variables are set in Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htvficmfwlkxaoxgsslc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dmZpY21md2xreGFveGdzc2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzIyMTYsImV4cCI6MjA3MjMwODIxNn0.e03QaHrUvAKdqRVoC9C5P_PhWCNVx5blVVa1YQtL2PE';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for common operations
export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Content functions
export const getBooks = async () => {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getBookById = async (id: number) => {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserLibrary = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_libraries')
    .select('content(*)')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data.map((item: any) => item.content);
};