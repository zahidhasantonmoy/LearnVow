// Reading statistics context for tracking reading progress
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { ReadingStat, ReadingStatsSummary } from '@/types';

interface ReadingStatsContextType {
  stats: ReadingStat[];
  summary: ReadingStatsSummary;
  loading: boolean;
  error: string | null;
  addReadingTime: (contentId: number, timeInSeconds: number, pagesRead: number) => Promise<void>;
  getStatsForContent: (contentId: number) => ReadingStat | undefined;
  refreshStats: () => Promise<void>;
  clearError: () => void;
}

const ReadingStatsContext = createContext<ReadingStatsContextType | undefined>(undefined);

export function ReadingStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<ReadingStat[]>([]);
  const [summary, setSummary] = useState<ReadingStatsSummary>({
    total_time_spent: 0,
    total_pages_read: 0,
    books_read: 0,
    current_streak: 0,
    longest_streak: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use optional chaining to handle cases when auth context is not available
  const authContext = useAuth();
  const user = authContext?.user;

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      setStats([]);
      setSummary({
        total_time_spent: 0,
        total_pages_read: 0,
        books_read: 0,
        current_streak: 0,
        longest_streak: 0
      });
      setLoading(false);
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    
    setLoading(true);
    clearError();
    
    try {
      // Fetch individual reading stats
      const { data: statsData, error: statsError } = await supabase
        .from('reading_statistics')
        .select(`
          *,
          content(title, cover_url)
        `)
        .eq('user_id', user.id)
        .order('last_read', { ascending: false });

      if (statsError) throw statsError;

      // Format stats data
      const formattedStats = statsData.map(stat => ({
        ...stat,
        content_title: stat.content?.title || 'Unknown Book',
        content_cover_url: stat.content?.cover_url || ''
      })) as ReadingStat[];

      setStats(formattedStats);

      // Calculate summary statistics
      const total_time_spent = formattedStats.reduce((sum, stat) => sum + stat.time_spent, 0);
      const total_pages_read = formattedStats.reduce((sum, stat) => sum + stat.pages_read, 0);
      const books_read = formattedStats.length;
      
      // For streak calculation, we would need more complex logic
      // For now, we'll set simple values
      const current_streak = 0;
      const longest_streak = 0;

      setSummary({
        total_time_spent,
        total_pages_read,
        books_read,
        current_streak,
        longest_streak
      });
    } catch (error: any) {
      console.error('Error fetching reading stats:', error);
      setError('Failed to load reading statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addReadingTime = async (contentId: number, timeInSeconds: number, pagesRead: number) => {
    if (!user) return;
    
    clearError();
    
    try {
      // Check if there's already a record for this user and content
      const { data: existingStat, error: fetchError } = await supabase
        .from('reading_statistics')
        .select('*')
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingStat) {
        // Update existing record
        const { data, error } = await supabase
          .from('reading_statistics')
          .update({
            time_spent: existingStat.time_spent + timeInSeconds,
            pages_read: existingStat.pages_read + pagesRead,
            last_read: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingStat.id)
          .select(`
            *,
            content(title, cover_url)
          `)
          .single();

        if (error) throw error;

        // Format and update in stats list
        const formattedStat = {
          ...data,
          content_title: data.content?.title || 'Unknown Book',
          content_cover_url: data.content?.cover_url || ''
        } as ReadingStat;

        setStats(prev => 
          prev.map(stat => 
            stat.id === data.id ? formattedStat : stat
          )
        );
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('reading_statistics')
          .insert({
            user_id: user.id,
            content_id: contentId,
            time_spent: timeInSeconds,
            pages_read: pagesRead,
            last_read: new Date().toISOString()
          })
          .select(`
            *,
            content(title, cover_url)
          `)
          .single();

        if (error) throw error;

        // Format and add to stats list
        const formattedStat = {
          ...data,
          content_title: data.content?.title || 'Unknown Book',
          content_cover_url: data.content?.cover_url || ''
        } as ReadingStat;

        setStats(prev => [formattedStat, ...prev]);
      }

      // Refresh summary
      await fetchStats();
    } catch (error: any) {
      console.error('Error adding reading time:', error);
      setError('Failed to update reading statistics. Please try again.');
      throw error;
    }
  };

  const getStatsForContent = (contentId: number) => {
    return stats.find(stat => stat.content_id === contentId);
  };

  const refreshStats = async () => {
    await fetchStats();
  };

  const value = {
    stats,
    summary,
    loading,
    error,
    addReadingTime,
    getStatsForContent,
    refreshStats,
    clearError
  };

  return (
    <ReadingStatsContext.Provider value={value}>
      {children}
    </ReadingStatsContext.Provider>
  );
}

export function useReadingStats() {
  const context = useContext(ReadingStatsContext);
  if (context === undefined) {
    // Return a default context when used outside of provider to avoid errors during static generation
    return {
      stats: [],
      summary: {
        total_time_spent: 0,
        total_pages_read: 0,
        books_read: 0,
        current_streak: 0,
        longest_streak: 0
      },
      loading: false,
      error: null,
      addReadingTime: async () => {},
      getStatsForContent: () => undefined,
      refreshStats: async () => {},
      clearError: () => {}
    };
  }
  return context;
}