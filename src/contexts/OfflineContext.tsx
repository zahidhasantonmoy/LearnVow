// Offline context for managing offline reading capabilities
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface OfflineBook {
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

interface OfflineContextType {
  offlineBooks: OfflineBook[];
  isSupported: boolean;
  downloadBook: (bookId: number, bookData: Omit<OfflineBook, 'id' | 'downloaded_at' | 'status' | 'progress'>) => Promise<void>;
  removeOfflineBook: (bookId: number) => Promise<void>;
  getOfflineBook: (bookId: number) => OfflineBook | undefined;
  isBookDownloaded: (bookId: number) => boolean;
  clearAllOfflineBooks: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [offlineBooks, setOfflineBooks] = useState<OfflineBook[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  
  // Use optional chaining to handle cases when auth context is not available
  const authContext = useAuth();
  const user = authContext?.user;

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
    } catch (error) {
      console.error('Error loading offline books:', error);
    }
  };

  const saveOfflineBooks = (books: OfflineBook[]) => {
    try {
      localStorage.setItem('offlineBooks', JSON.stringify(books));
      setOfflineBooks(books);
    } catch (error) {
      console.error('Error saving offline books:', error);
    }
  };

  const downloadBook = async (
    bookId: number, 
    bookData: Omit<OfflineBook, 'id' | 'downloaded_at' | 'status' | 'progress'>
  ) => {
    if (!isSupported) {
      throw new Error('Offline reading not supported in this browser');
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

    saveOfflineBooks(updatedBooks);

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
        saveOfflineBooks(
          updatedBooks.map(book => 
            book.id === bookId 
              ? { ...book, status: 'downloaded', progress: 100 } 
              : book
          )
        );
      }, 2000);
    } catch (error) {
      console.error('Error downloading book:', error);
      saveOfflineBooks(
        updatedBooks.map(book => 
          book.id === bookId 
            ? { ...book, status: 'failed', progress: 0 } 
            : book
        )
      );
    }
  };

  const removeOfflineBook = async (bookId: number) => {
    try {
      // In a real implementation, we would also remove the cached file
      const updatedBooks = offlineBooks.filter(book => book.id !== bookId);
      saveOfflineBooks(updatedBooks);
    } catch (error) {
      console.error('Error removing offline book:', error);
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
    try {
      // In a real implementation, we would also clear the cache
      saveOfflineBooks([]);
    } catch (error) {
      console.error('Error clearing offline books:', error);
    }
  };

  const value = {
    offlineBooks,
    isSupported,
    downloadBook,
    removeOfflineBook,
    getOfflineBook,
    isBookDownloaded,
    clearAllOfflineBooks
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
      clearAllOfflineBooks: async () => {}
    };
  }
  return context;
}