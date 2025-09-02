// AI-powered recommendations service
'use client';

import { supabase } from '@/lib/supabaseClient';

interface Book {
  id: number;
  title: string;
  author: string;
  cover_url: string;
  content_type: 'ebook' | 'audiobook';
  price: number;
  category_id: number;
  tags: string[];
}

interface UserPreference {
  category_id: number;
  preference_score: number;
}

export class RecommendationService {
  // Get user's reading history to determine preferences
  static async getUserPreferences(userId: string): Promise<UserPreference[]> {
    try {
      // Get user's library to understand their preferences
      const { data: library, error: libraryError } = await supabase
        .from('user_libraries')
        .select('content(category_id)')
        .eq('user_id', userId);
      
      if (libraryError) throw libraryError;
      
      // Count category preferences
      const categoryCount: Record<number, number> = {};
      
      library?.forEach((item: any) => {
        const categoryId = item.content?.category_id;
        if (categoryId) {
          categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1;
        }
      });
      
      // Convert to preference scores
      const totalBooks = library?.length || 1;
      const preferences: UserPreference[] = Object.entries(categoryCount)
        .map(([categoryId, count]) => ({
          category_id: parseInt(categoryId),
          preference_score: count / totalBooks
        }))
        .sort((a, b) => b.preference_score - a.preference_score);
      
      return preferences;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return [];
    }
  }
  
  // Get content-based recommendations
  static async getContentBasedRecommendations(
    userId: string, 
    limit: number = 10
  ): Promise<Book[]> {
    try {
      // Get user preferences
      const preferences = await this.getUserPreferences(userId);
      
      if (preferences.length === 0) {
        // If no preferences, return popular books
        return await this.getPopularBooks(limit);
      }
      
      // Get books from preferred categories
      const preferredCategoryIds = preferences
        .slice(0, 3)
        .map(p => p.category_id);
      
      const { data: books, error } = await supabase
        .from('content')
        .select('*')
        .in('category_id', preferredCategoryIds)
        .eq('is_active', true)
        .limit(limit * 2); // Get more to filter later
      
      if (error) throw error;
      
      // Sort by preference score and return top recommendations
      const booksWithScores = books?.map(book => {
        const preference = preferences.find(p => p.category_id === book.category_id);
        return {
          ...book,
          recommendation_score: preference?.preference_score || 0
        };
      });
      
      return booksWithScores
        ?.sort((a, b) => b.recommendation_score - a.recommendation_score)
        .slice(0, limit) || [];
    } catch (error) {
      console.error('Error getting content-based recommendations:', error);
      return [];
    }
  }
  
  // Get collaborative filtering recommendations
  static async getCollaborativeRecommendations(
    userId: string, 
    limit: number = 10
  ): Promise<Book[]> {
    try {
      // Find users with similar reading history
      const { data: similarUsers, error: userError } = await supabase
        .rpc('get_similar_users', {
          user_id: userId,
          limit: 10
        });
      
      if (userError) throw userError;
      
      if (!similarUsers || similarUsers.length === 0) {
        // Fallback to content-based recommendations
        return await this.getContentBasedRecommendations(userId, limit);
      }
      
      // Get books read by similar users but not by current user
      const similarUserIds = similarUsers.map((u: any) => u.user_id);
      
      const { data: books, error: bookError } = await supabase
        .rpc('get_books_by_similar_users', {
          user_id: userId,
          similar_user_ids: similarUserIds,
          limit: limit * 2
        });
      
      if (bookError) throw bookError;
      
      return books?.slice(0, limit) || [];
    } catch (error) {
      console.error('Error getting collaborative recommendations:', error);
      return [];
    }
  }
  
  // Get trending books
  static async getTrendingBooks(limit: number = 10): Promise<Book[]> {
    try {
      // This would typically use a more complex query based on recent activity
      // For now, we'll return recently added popular books
      const { data: books, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return books || [];
    } catch (error) {
      console.error('Error getting trending books:', error);
      return [];
    }
  }
  
  // Get popular books
  static async getPopularBooks(limit: number = 10): Promise<Book[]> {
    try {
      // This would typically use a more complex query based on purchase/reading data
      // For now, we'll return a random selection of books
      const { data: books, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_active', true)
        .limit(limit * 2); // Get more to randomize
      
      if (error) throw error;
      
      // Shuffle and return
      return books
        ?.sort(() => 0.5 - Math.random())
        .slice(0, limit) || [];
    } catch (error) {
      console.error('Error getting popular books:', error);
      return [];
    }
  }
  
  // Get personalized recommendations combining multiple approaches
  static async getRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<Book[]> {
    try {
      // Get different types of recommendations
      const [
        contentBased,
        collaborative,
        trending,
        popular
      ] = await Promise.all([
        this.getContentBasedRecommendations(userId, limit),
        this.getCollaborativeRecommendations(userId, limit),
        this.getTrendingBooks(limit),
        this.getPopularBooks(limit)
      ]);
      
      // Combine and deduplicate recommendations
      const allBooks = [
        ...contentBased.map(book => ({ ...book, source: 'content' })),
        ...collaborative.map(book => ({ ...book, source: 'collaborative' })),
        ...trending.map(book => ({ ...book, source: 'trending' })),
        ...popular.map(book => ({ ...book, source: 'popular' })
      ];
      
      // Deduplicate by book ID
      const uniqueBooks: any[] = [];
      const seenIds = new Set<number>();
      
      for (const book of allBooks) {
        if (!seenIds.has(book.id)) {
          seenIds.add(book.id);
          uniqueBooks.push(book);
        }
      }
      
      // Sort by a combination of factors (simplified)
      return uniqueBooks
        .sort((a, b) => {
          // Prioritize collaborative and content-based over trending/popular
          const sourcePriority: Record<string, number> = {
            'content': 4,
            'collaborative': 3,
            'trending': 2,
            'popular': 1
          };
          
          return sourcePriority[b.source] - sourcePriority[a.source];
        })
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }
}