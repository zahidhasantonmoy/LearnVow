// Bookmark context for managing bookmarks and notes
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

interface Bookmark {
  id: number;
  user_id: string;
  content_id: number;
  page_number: number;
  note: string;
  created_at: string;
  updated_at: string;
  content_title: string;
  content_cover_url: string;
}

interface BookmarkContextType {
  bookmarks: Bookmark[];
  loading: boolean;
  addBookmark: (contentId: number, pageNumber: number, note?: string) => Promise<void>;
  updateBookmark: (bookmarkId: number, note: string) => Promise<void>;
  removeBookmark: (bookmarkId: number) => Promise<void>;
  getBookmarksForContent: (contentId: number) => Bookmark[];
  refreshBookmarks: () => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  // Use optional chaining to handle cases when auth context is not available
  const authContext = useAuth();
  const user = authContext?.user;

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
      }));

      setBookmarks(formattedBookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (contentId: number, pageNumber: number, note = '') => {
    if (!user) return;
    
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
      };

      setBookmarks(prev => [formattedBookmark, ...prev]);
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const updateBookmark = async (bookmarkId: number, note: string) => {
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
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const removeBookmark = async (bookmarkId: number) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      // Remove from bookmarks list
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
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
    addBookmark,
    updateBookmark,
    removeBookmark,
    getBookmarksForContent,
    refreshBookmarks
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
      addBookmark: async () => {},
      updateBookmark: async () => {},
      removeBookmark: async () => {},
      getBookmarksForContent: () => [],
      refreshBookmarks: async () => {}
    };
  }
  return context;
}