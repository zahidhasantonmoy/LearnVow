// Bookmark context for managing bookmarks and notes
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Bookmark } from '@/types';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  addBookmark: (contentId: number, pageNumber: number, note?: string) => Promise<void>;
  updateBookmark: (bookmarkId: number, note: string) => Promise<void>;
  removeBookmark: (bookmarkId: number) => Promise<void>;
  getBookmarksForContent: (contentId: number) => Bookmark[];
  refreshBookmarks: () => Promise<void>;
  clearError: () => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
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
      fetchBookmarks();
    } else {
      setBookmarks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;
    
    setLoading(true);
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          content(title, cover_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format the bookmarks data
      const formattedBookmarks = data.map(bookmark => ({
        ...bookmark,
        content_title: bookmark.content?.title || 'Unknown Book',
        content_cover_url: bookmark.content?.cover_url || ''
      })) as Bookmark[];

      setBookmarks(formattedBookmarks);
    } catch (error: any) {
      console.error('Error fetching bookmarks:', error);
      setError('Failed to load bookmarks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (contentId: number, pageNumber: number, note = '') => {
    if (!user) return;
    
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          content_id: contentId,
          page_number: pageNumber,
          note: note
        })
        .select(`
          *,
          content(title, cover_url)
        `)
        .single();

      if (error) throw error;

      // Format and add to bookmarks list
      const formattedBookmark = {
        ...data,
        content_title: data.content?.title || 'Unknown Book',
        content_cover_url: data.content?.cover_url || ''
      } as Bookmark;

      setBookmarks(prev => [formattedBookmark, ...prev]);
    } catch (error: any) {
      console.error('Error adding bookmark:', error);
      setError('Failed to add bookmark. Please try again.');
      throw error;
    }
  };

  const updateBookmark = async (bookmarkId: number, note: string) => {
    clearError();
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .update({
          note: note,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookmarkId)
        .select()
        .single();

      if (error) throw error;

      // Update in bookmarks list
      setBookmarks(prev => 
        prev.map(bookmark => 
          bookmark.id === bookmarkId 
            ? { ...bookmark, note: data.note, updated_at: data.updated_at } 
            : bookmark
        )
      );
    } catch (error: any) {
      console.error('Error updating bookmark:', error);
      setError('Failed to update bookmark. Please try again.');
      throw error;
    }
  };

  const removeBookmark = async (bookmarkId: number) => {
    clearError();
    
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      // Remove from bookmarks list
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
    } catch (error: any) {
      console.error('Error removing bookmark:', error);
      setError('Failed to remove bookmark. Please try again.');
      throw error;
    }
  };

  const getBookmarksForContent = (contentId: number) => {
    return bookmarks.filter(bookmark => bookmark.content_id === contentId);
  };

  const refreshBookmarks = async () => {
    await fetchBookmarks();
  };

  const value = {
    bookmarks,
    loading,
    error,
    addBookmark,
    updateBookmark,
    removeBookmark,
    getBookmarksForContent,
    refreshBookmarks,
    clearError
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    // Return a default context when used outside of provider to avoid errors during static generation
    return {
      bookmarks: [],
      loading: false,
      error: null,
      addBookmark: async () => {},
      updateBookmark: async () => {},
      removeBookmark: async () => {},
      getBookmarksForContent: () => [],
      refreshBookmarks: async () => {},
      clearError: () => {}
    };
  }
  return context;
}