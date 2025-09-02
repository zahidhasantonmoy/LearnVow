// Reading experience service for bookmarks, highlights, and statistics
'use client';

import { supabase } from '@/lib/supabaseClient';

interface Bookmark {
  id: number;
  user_id: string;
  content_id: number;
  page_number: number;
  position: number;
  note: string;
  highlight_color: string;
  annotation: string;
  created_at: string;
}

interface ReadingStatistics {
  id: number;
  user_id: string;
  content_id: number;
  time_spent: number;
  pages_read: number;
  last_read: string;
  created_at: string;
  updated_at: string;
}

interface HighlightColor {
  id: number;
  name: string;
  hex_color: string;
  created_at: string;
}

export class ReadingExperienceService {
  // Get all bookmarks for a user and content
  static async getBookmarks(userId: string, contentId: number): Promise<Bookmark[]> {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
  }
  
  // Add a new bookmark
  static async addBookmark(bookmark: Omit<Bookmark, 'id' | 'created_at'>): Promise<Bookmark | null> {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert(bookmark)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      return null;
    }
  }
  
  // Update an existing bookmark
  static async updateBookmark(id: number, updates: Partial<Bookmark>): Promise<Bookmark | null> {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating bookmark:', error);
      return null;
    }
  }
  
  // Delete a bookmark
  static async deleteBookmark(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      return false;
    }
  }
  
  // Get reading statistics for a user and content
  static async getReadingStatistics(userId: string, contentId: number): Promise<ReadingStatistics | null> {
    try {
      const { data, error } = await supabase
        .from('reading_statistics')
        .select('*')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      return data || null;
    } catch (error) {
      console.error('Error fetching reading statistics:', error);
      return null;
    }
  }
  
  // Update reading statistics
  static async updateReadingStatistics(
    userId: string, 
    contentId: number, 
    updates: Partial<ReadingStatistics>
  ): Promise<ReadingStatistics | null> {
    try {
      // First try to update existing record
      const { data: existing, error: fetchError } = await supabase
        .from('reading_statistics')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      let result;
      
      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from('reading_statistics')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('reading_statistics')
          .insert({
            user_id: userId,
            content_id: contentId,
            ...updates,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      return result;
    } catch (error) {
      console.error('Error updating reading statistics:', error);
      return null;
    }
  }
  
  // Get available highlight colors
  static async getHighlightColors(): Promise<HighlightColor[]> {
    try {
      const { data, error } = await supabase
        .from('highlight_colors')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching highlight colors:', error);
      return [];
    }
  }
  
  // Get user's reading goals
  static async getReadingGoals(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('reading_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching reading goals:', error);
      return [];
    }
  }
  
  // Update reading goal progress
  static async updateReadingGoalProgress(
    userId: string, 
    goalType: string, 
    increment: number = 1
  ): Promise<boolean> {
    try {
      // Get current goal for the period
      const now = new Date();
      let startDate, endDate;
      
      switch (goalType) {
        case 'daily':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date(now.setHours(23, 59, 59, 999));
          break;
        case 'weekly':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          weekStart.setHours(0, 0, 0, 0);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);
          startDate = weekStart;
          endDate = weekEnd;
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
        default:
          return false;
      }
      
      // Try to update existing goal
      const { data: existingGoal, error: fetchError } = await supabase
        .from('reading_goals')
        .select('id, current_value')
        .eq('user_id', userId)
        .eq('goal_type', goalType)
        .gte('start_date', startDate.toISOString())
        .lte('end_date', endDate.toISOString())
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (existingGoal) {
        // Update existing goal
        const { error } = await supabase
          .from('reading_goals')
          .update({
            current_value: existingGoal.current_value + increment,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingGoal.id);
        
        if (error) throw error;
      } else {
        // Create new goal (this would typically be set by user, but we'll create a default)
        // In a real implementation, goals would be set by user in the UI
      }
      
      return true;
    } catch (error) {
      console.error('Error updating reading goal progress:', error);
      return false;
    }
  }
}