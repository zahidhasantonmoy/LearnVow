// API service for connecting to backend and Supabase
import { supabase } from '../utils/supabaseClient';

// Determine backend URL based on environment
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-render-backend.onrender.com' // Update this with your actual backend URL
    : 'http://localhost:3001');

const API_BASE_URL = `${BACKEND_BASE_URL}/api`;

export const api = {
  // Auth endpoints
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`);
    return response.json();
  },

  // Book endpoints
  getBooks: async () => {
    const response = await fetch(`${API_BASE_URL}/books`);
    return response.json();
  },

  getBook: async (id) => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    return response.json();
  },

  // Library endpoints (using Supabase directly)
  getLibrary: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Call the Supabase function we created
    const { data, error } = await supabase.rpc('get_user_library', {
      user_uuid: user.id
    });
    
    if (error) throw error;
    return data;
  },

  // Purchase endpoints (using backend API)
  purchaseBook: async (bookId) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    const response = await fetch(`${API_BASE_URL}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ bookId }),
    });
    
    return response.json();
  },

  // Reading progress endpoints (using Supabase directly)
  getProgress: async (bookId) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('reading_progress')
      .select('progress')
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data ? data.progress : 0;
  },

  updateProgress: async (bookId, progress) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if progress record exists
    const { data: existing } = await supabase
      .from('reading_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .maybeSingle();
    
    let data, error;
    
    if (existing) {
      // Update existing record
      ({ data, error } = await supabase
        .from('reading_progress')
        .update({ progress, last_accessed: new Date() })
        .eq('user_id', user.id)
        .eq('book_id', bookId));
    } else {
      // Create new record
      ({ data, error } = await supabase
        .from('reading_progress')
        .insert([
          {
            user_id: user.id,
            book_id: bookId,
            progress
          }
        ]));
    }
    
    if (error) throw error;
    return data;
  }
};