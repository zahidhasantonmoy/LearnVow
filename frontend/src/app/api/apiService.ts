// API service for connecting to Vercel API routes and Supabase
import { supabase } from '../utils/supabaseClient';

// Determine API base URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Vercel API routes are relative to the same domain
  : 'http://localhost:3000';

export const api = {
  // Auth endpoints
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Book endpoints
  getBooks: async () => {
    const response = await fetch(`${API_BASE_URL}/api/books`);
    return response.json();
  },

  getBook: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`);
    return response.json();
  },

  // Library endpoints
  getLibrary: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/library`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Purchase endpoints
  purchaseBook: async (bookId, token) => {
    const response = await fetch(`${API_BASE_URL}/api/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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