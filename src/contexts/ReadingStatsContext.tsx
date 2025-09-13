// Reading statistics context for tracking reading progress
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

interface ReadingStat {
  id: number;
  user_id: string;
  content_id: number;
  time_spent: number; // in seconds
  pages_read: number;
  last_read: string;
  created_at: string;
  updated_at: string;
  content_title: string;
  content_cover_url: string;
}

interface ReadingStatsSummary {
  total_time_spent: number; // in seconds
  total_pages_read: number;
  books_read: number;
  current_streak: number; // days
  longest_streak: number; // days
}

interface ReadingStatsContextType {
  stats: ReadingStat[];
  summary: ReadingStatsSummary;
  loading: boolean;
  addReadingTime: (contentId: number, timeInSeconds: number, pagesRead: number) => Promise<void>;
  getStatsForContent: (contentId: number) => ReadingStat | undefined;
  refreshStats: () => Promise<void>;
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
  
  // Use optional chaining to handle cases when auth context is not available
  const authContext = useAuth();
  const user = authContext?.user;

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
      }));

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
    } catch (error) {
      console.error('Error fetching reading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReadingTime = async (contentId: number, timeInSeconds: number, pagesRead: number) => {
    if (!user) return;
    
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
        };

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
        };

        setStats(prev => [formattedStat, ...prev]);
      }

      // Refresh summary
      await fetchStats();
    } catch (error) {
      console.error('Error adding reading time:', error);
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
    addReadingTime,
    getStatsForContent,
    refreshStats
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
      addReadingTime: async () => {},
      getStatsForContent: () => undefined,
      refreshStats: async () => {}
    };
  }
  return context;
}