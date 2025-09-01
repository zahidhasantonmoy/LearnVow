// API service for connecting to backend and Supabase
import { supabase } from '../utils/supabaseClient';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-url.vercel.app/api' // Update this when you deploy
  : 'http://localhost:3001/api';

export const api = {
  // Auth endpoints
  register: async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name
        }
      }
    });
    
    return { data, error };
  },

  login: async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });
    
    return { data, error };
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Book endpoints
  getBooks: async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*');
    
    return { data, error };
  },

  getBook: async (id) => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  // Library endpoints
  getLibrary: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Call the Supabase function we created
    const { data, error } = await supabase.rpc('get_user_library', {
      user_uuid: user.id
    });
    
    return { data, error };
  },

  // Purchase endpoints
  purchaseBook: async (bookId) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // First get the book price
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('price')
      .eq('id', bookId)
      .single();
      
    if (bookError) {
      throw new Error('Book not found');
    }
    
    // Create purchase record
    const { data, error } = await supabase
      .from('purchases')
      .insert([
        {
          user_id: user.id,
          book_id: bookId,
          price: book.price
        }
      ]);
      
    return { data, error };
  },

  // Reading progress endpoints
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
    
    return { data: data ? data.progress : 0, error };
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
    
    return { data, error };
  }
};