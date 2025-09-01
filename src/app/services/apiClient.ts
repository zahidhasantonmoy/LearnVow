// API Client for LearnVow platform
import { supabase } from '../utils/supabaseClient';

// API base URL - uses relative paths for Vercel deployment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Relative to the same domain in production
  : 'http://localhost:3001'; // Development backend

// Helper function to get auth token
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};

// Generic API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message || 'An unexpected error occurred' };
  }
};

class ApiClient {
  // Authentication methods
  async register(userData: { name: string; email: string; password: string }) {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }
    
    // Get additional user data from our database
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      return { success: false, message: error.message };
    }
    
    return { success: true, data: { ...user, ...data } };
  }

  // Book methods
  async getBooks(filters?: { type?: string; category?: string }) {
    let url = '/api/books';
    const queryParams = new URLSearchParams();
    
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.category) queryParams.append('category', filters.category);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    return apiRequest(url);
  }

  async getBook(id: string) {
    return apiRequest(`/api/books/${id}`);
  }

  // Cart methods
  async getCart() {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    
    return apiRequest('/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async addToCart(bookId: string, quantity: number = 1) {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    
    return apiRequest('/api/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId, quantity }),
    });
  }

  async updateCartItem(bookId: string, quantity: number) {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    
    return apiRequest('/api/cart', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId, quantity }),
    });
  }

  async removeFromCart(bookId: string) {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    
    return apiRequest('/api/cart', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId }),
    });
  }

  // Library methods
  async getLibrary() {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    
    return apiRequest('/api/library', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Wishlist methods
  async getWishlist() {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    
    return apiRequest('/api/wishlist', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async addToWishlist(bookId: string) {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    
    return apiRequest('/api/wishlist', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId }),
    });
  }

  async removeFromWishlist(bookId: string) {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    
    return apiRequest('/api/wishlist', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId }),
    });
  }

  // Checkout methods
  async createOrder(orderData: any) {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    
    return apiRequest('/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
  }

  // Reading progress methods
  async getReadingProgress(bookId: string) {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    
    return apiRequest(`/api/progress/${bookId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateReadingProgress(bookId: string, progress: number) {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    
    return apiRequest(`/api/progress/${bookId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ progress }),
    });
  }
}

export const apiClient = new ApiClient();