// Offline context for managing offline reading capabilities
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OfflineBook } from '@/types';

interface OfflineContextType {
  offlineBooks: OfflineBook[];
  isSupported: boolean;
  downloadBook: (bookId: number, bookData: Omit<OfflineBook, 'id' | 'downloaded_at' | 'status' | 'progress'>) => Promise<void>;
  removeOfflineBook: (bookId: number) => Promise<void>;
  getOfflineBook: (bookId: number) => OfflineBook | undefined;
  isBookDownloaded: (bookId: number) => boolean;
  clearAllOfflineBooks: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [offlineBooks, setOfflineBooks] = useState<OfflineBook[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use optional chaining to handle cases when auth context is not available
  const authContext = useAuth();
  const user = authContext?.user;

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    // Check if offline storage is supported
    const supported = 'caches' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);
    
    // Load offline books from localStorage
    if (supported && user) {
      loadOfflineBooks();
    }
  }, [user]);

  const loadOfflineBooks = () => {
    try {
      const savedBooks = localStorage.getItem('offlineBooks');
      if (savedBooks) {
        const parsedBooks = JSON.parse(savedBooks);
        setOfflineBooks(parsedBooks);
      }
    } catch (error: any) {
      console.error('Error loading offline books:', error);
      setError('Failed to load offline books. Please try again.');
    }
  };

  const saveOfflineBooks = (books: OfflineBook[]) => {
    try {
      localStorage.setItem('offlineBooks', JSON.stringify(books));
      setOfflineBooks(books);
    } catch (error: any) {
      console.error('Error saving offline books:', error);
      setError('Failed to save offline books. Storage may be full.');
      throw error;
    }
  };

  const downloadBook = async (
    bookId: number, 
    bookData: Omit<OfflineBook, 'id' | 'downloaded_at' | 'status' | 'progress'>
  ) => {
    clearError();
    
    if (!isSupported) {
      const errorMsg = 'Offline reading not supported in this browser';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    // Check if book is already downloaded
    const existingBook = offlineBooks.find(book => book.id === bookId);
    if (existingBook && existingBook.status === 'downloaded') {
      return;
    }

    // Add book to offline books list with downloading status
    const newBook: OfflineBook = {
      id: bookId,
      ...bookData,
      downloaded_at: new Date().toISOString(),
      status: 'downloading',
      progress: 0
    };

    const updatedBooks = existingBook 
      ? offlineBooks.map(book => book.id === bookId ? newBook : book)
      : [...offlineBooks, newBook];

    try {
      saveOfflineBooks(updatedBooks);
    } catch (error: any) {
      setError('Failed to start download. Please try again.');
      throw error;
    }

    try {
      // Simulate download progress
      const interval = setInterval(() => {
        setOfflineBooks(prev => 
          prev.map(book => 
            book.id === bookId 
              ? { 
                  ...book, 
                  progress: Math.min(book.progress + 10, 100),
                  status: book.progress >= 90 ? 'downloaded' : 'downloading'
                } 
              : book
          )
        );
      }, 200);

      // Simulate download completion
      setTimeout(() => {
        clearInterval(interval);
        try {
          saveOfflineBooks(
            updatedBooks.map(book => 
              book.id === bookId 
                ? { ...book, status: 'downloaded', progress: 100 } 
                : book
            )
          );
        } catch (error: any) {
          setError('Download completed but failed to save. Please try again.');
        }
      }, 2000);
    } catch (error: any) {
      console.error('Error downloading book:', error);
      setError('Download failed. Please check your connection and try again.');
      try {
        saveOfflineBooks(
          updatedBooks.map(book => 
            book.id === bookId 
              ? { ...book, status: 'failed', progress: 0 } 
              : book
          )
        );
      } catch (saveError: any) {
        console.error('Failed to update book status after download error:', saveError);
      }
      throw error;
    }
  };

  const removeOfflineBook = async (bookId: number) => {
    clearError();
    
    try {
      // In a real implementation, we would also remove the cached file
      const updatedBooks = offlineBooks.filter(book => book.id !== bookId);
      saveOfflineBooks(updatedBooks);
    } catch (error: any) {
      console.error('Error removing offline book:', error);
      setError('Failed to remove offline book. Please try again.');
      throw error;
    }
  };

  const getOfflineBook = (bookId: number) => {
    return offlineBooks.find(book => book.id === bookId);
  };

  const isBookDownloaded = (bookId: number) => {
    const book = getOfflineBook(bookId);
    return book?.status === 'downloaded';
  };

  const clearAllOfflineBooks = async () => {
    clearError();
    
    try {
      // In a real implementation, we would also clear the cache
      saveOfflineBooks([]);
    } catch (error: any) {
      console.error('Error clearing offline books:', error);
      setError('Failed to clear offline books. Please try again.');
      throw error;
    }
  };

  const value = {
    offlineBooks,
    isSupported,
    downloadBook,
    removeOfflineBook,
    getOfflineBook,
    isBookDownloaded,
    clearAllOfflineBooks,
    error,
    clearError
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    // Return a default context when used outside of provider to avoid errors during static generation
    return {
      offlineBooks: [],
      isSupported: false,
      downloadBook: async () => {},
      removeOfflineBook: async () => {},
      getOfflineBook: () => undefined,
      isBookDownloaded: () => false,
      clearAllOfflineBooks: async () => {},
      error: null,
      clearError: () => {}
    };
  }
  return context;
}