// Offline books page
'use client';

import { useState, useEffect } from 'react';
import { useOffline } from '@/contexts/OfflineContext';
import { FiDownload, FiTrash2, FiWifiOff, FiBook, FiLoader, FiAlertCircle } from 'react-icons/fi';
import OfflineBookCard from '@/components/OfflineBookCard';

export default function OfflineBooksPage() {
  const { offlineBooks, isSupported, clearAllOfflineBooks } = useOffline();
  const [deletingAll, setDeletingAll] = useState(false);

  const handleClearAll = async () => {
    if (deletingAll || offlineBooks.length === 0) return;
    
    if (confirm('Are you sure you want to remove all downloaded books?')) {
      setDeletingAll(true);
      try {
        await clearAllOfflineBooks();
      } catch (error) {
        console.error('Error clearing offline books:', error);
      } finally {
        setDeletingAll(false);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
            <FiAlertCircle className="text-5xl text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Offline Reading Not Supported</h1>
            <p className="text-gray-400 mb-6">
              Your browser doesn't support offline reading capabilities. 
              Please use a modern browser that supports service workers.
            </p>
            <a 
              href="https://browsehappy.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Upgrade Your Browser
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <FiWifiOff className="mr-3 text-indigo-500" />
                Offline Library
              </h1>
              <p className="text-gray-400">
                {offlineBooks.length} downloaded {offlineBooks.length === 1 ? 'book' : 'books'}
              </p>
            </div>
            
            {offlineBooks.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={deletingAll}
                className="flex items-center text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                {deletingAll ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="mr-2" />
                    Clear All
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {offlineBooks.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
            <FiDownload className="text-5xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Offline Books</h2>
            <p className="text-gray-400 mb-6">
              Download books to read them offline when you don't have an internet connection.
            </p>
            <a 
              href="/books" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Browse Books
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offlineBooks.map((book) => (
              <OfflineBookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}