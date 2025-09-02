// Admin service for content management
'use client';

import { supabase } from '@/lib/supabaseClient';

interface Content {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cover_url: string;
  content_type: 'ebook' | 'audiobook';
  file_urls: any;
  sample_url: string;
  author_id: number;
  publisher_id: number;
  category_id: number;
  isbn: string;
  pages: number;
  duration: number;
  language: string;
  tags: string[];
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Author {
  id: number;
  name: string;
  bio: string;
  photo_url: string;
  website: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  created_at: string;
}

interface Publisher {
  id: number;
  name: string;
  logo_url: string;
  website: string;
  created_at: string;
}

export class AdminService {
  // Get all content with pagination
  static async getContent(page: number = 1, limit: number = 20): Promise<{ data: Content[]; count: number }> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await supabase
        .from('content')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error fetching content:', error);
      return { data: [], count: 0 };
    }
  }
  
  // Get content by ID
  static async getContentById(id: number): Promise<Content | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data || null;
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      return null;
    }
  }
  
  // Create new content
  static async createContent(content: Omit<Content, 'id' | 'created_at' | 'updated_at'>): Promise<Content | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .insert(content)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating content:', error);
      return null;
    }
  }
  
  // Update content
  static async updateContent(id: number, updates: Partial<Content>): Promise<Content | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating content:', error);
      return null;
    }
  }
  
  // Delete content
  static async deleteContent(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting content:', error);
      return false;
    }
  }
  
  // Get all authors
  static async getAuthors(): Promise<Author[]> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching authors:', error);
      return [];
    }
  }
  
  // Create new author
  static async createAuthor(author: Omit<Author, 'id' | 'created_at'>): Promise<Author | null> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .insert(author)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating author:', error);
      return null;
    }
  }
  
  // Get all categories
  static async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
  
  // Create new category
  static async createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  }
  
  // Get all publishers
  static async getPublishers(): Promise<Publisher[]> {
    try {
      const { data, error } = await supabase
        .from('publishers')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching publishers:', error);
      return [];
    }
  }
  
  // Create new publisher
  static async createPublisher(publisher: Omit<Publisher, 'id' | 'created_at'>): Promise<Publisher | null> {
    try {
      const { data, error } = await supabase
        .from('publishers')
        .insert(publisher)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating publisher:', error);
      return null;
    }
  }
  
  // Get sales analytics
  static async getSalesAnalytics(): Promise<any> {
    try {
      // This would typically be a more complex query
      // For now, we'll return mock data
      return {
        totalSales: 12450.75,
        totalOrders: 856,
        topSellingBooks: [
          { title: 'The Great Gatsby', sales: 124 },
          { title: 'To Kill a Mockingbird', sales: 98 },
          { title: '1984', sales: 87 }
        ],
        revenueByCategory: [
          { category: 'Fiction', revenue: 4200.50 },
          { category: 'Non-Fiction', revenue: 3150.25 },
          { category: 'Sci-Fi', revenue: 2800.00 }
        ]
      };
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      return null;
    }
  }
  
  // Get user analytics
  static async getUserAnalytics(): Promise<any> {
    try {
      // This would typically be a more complex query
      // For now, we'll return mock data
      return {
        totalUsers: 1284,
        activeUsers: 956,
        newUserSignups: 42,
        userRetention: 85
      };
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      return null;
    }
  }
}