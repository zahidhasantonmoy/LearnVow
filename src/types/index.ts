// Enhanced TypeScript types for the application
import { User } from '@supabase/supabase-js';

// User types
export interface AppUser extends User {
  profile?: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
}

// Content types
export interface Author {
  id: number;
  name: string;
  bio?: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Publisher {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Content {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  cover_url?: string;
  file_url?: string;
  content_type: 'ebook' | 'audiobook';
  price: number;
  is_active: boolean;
  author_id?: number;
  category_id?: number;
  publisher_id?: number;
  pages?: number;
  duration?: number; // in minutes for audiobooks
  rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
  authors?: Author;
  categories?: Category;
  publishers?: Publisher;
}

// Reading statistics types
export interface ReadingStat {
  id: number;
  user_id: string;
  content_id: number;
  time_spent: number; // in seconds
  pages_read: number;
  last_read: string;
  created_at: string;
  updated_at: string;
  content?: Content;
}

export interface ReadingStatsSummary {
  total_time_spent: number; // in seconds
  total_pages_read: number;
  books_read: number;
  current_streak: number; // days
  longest_streak: number; // days
}

// Bookmark types
export interface Bookmark {
  id: number;
  user_id: string;
  content_id: number;
  page_number?: number;
  note?: string;
  created_at: string;
  content?: Content;
}

// Offline book types
export interface OfflineBook {
  id: number;
  title: string;
  author: string;
  cover_url: string;
  content_type: 'ebook' | 'audiobook';
  file_url: string;
  downloaded_at: string;
  file_size: number; // in bytes
  status: 'downloading' | 'downloaded' | 'failed';
  progress: number; // 0-100
}

// Recommendation types
export interface RecommendedBook extends Content {
  similarity_score: number; // 0-100, how similar this book is to user's preferences
}

// Cart types
export interface CartItem {
  id: number;
  user_id: string;
  content_id: number;
  quantity: number;
  added_at: string;
  content?: Content;
}

// Order types
export interface Order {
  id: number;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  content_id: number;
  quantity: number;
  price: number;
  content?: Content;
}

// Review types
export interface Review {
  id: number;
  user_id: string;
  content_id: number;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  updated_at: string;
  user?: {
    full_name?: string;
    avatar_url?: string;
  };
  content?: Content;
}