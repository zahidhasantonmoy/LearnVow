// Offline book card component
'use client';

import { useState } from 'react';
import { useOffline } from '@/contexts/OfflineContext';
import { FiBook, FiTrash2, FiDownload, FiLoader, FiCheck, FiX } from 'react-icons/fi';

interface OfflineBookCardProps {
  book: {
    id: number;
    title: string;
    author: string;
    cover_url: string;
    content_type: 'ebook' | 'audiobook';
    status: 'downloading' | 'downloaded' | 'failed';
    progress: number;
  };
}

export default function OfflineBookCard({ book }: OfflineBookCardProps) {
  const { removeOfflineBook } = useOffline();
  const [isRemoving, setIsRemoving] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRemove = async () => {
    if (isRemoving) return;
    
    setIsRemoving(true);
    try {
      await removeOfflineBook(book.id);
    } catch (error) {
      console.error('Error removing offline book:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-indigo-500 transition-colors">
      {/* Book cover */}
      <div className="relative">
        {book.cover_url ? (
          <img 
            src={book.cover_url} 
            alt={book.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="bg-gray-700 w-full h-48 flex items-center justify-center">
            <FiBook className="text-4xl text-gray-500" />
          </div>
        )}
        
        {/* Content type badge */}
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
          {book.content_type === 'ebook' ? 'Ebook' : 'Audiobook'}
        </div>
      </div>

      {/* Book info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-400 text-sm mb-3">by {book.author}</p>
        
        {/* Status indicator */}
        <div className="mb-4">
          {book.status === 'downloading' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-indigo-400">Downloading...</span>
                <span className="text-sm text-gray-400">{book.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${book.progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {book.status === 'downloaded' && (
            <div className="flex items-center text-sm text-green-500">
              <FiCheck className="mr-2" />
              <span>Downloaded</span>
            </div>
          )}
          
          {book.status === 'failed' && (
            <div className="flex items-center text-sm text-red-500">
              <FiX className="mr-2" />
              <span>Download Failed</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          {book.status === 'downloaded' ? (
            <a
              href={`/books/${book.id}`}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-center text-sm transition-colors flex items-center justify-center"
            >
              <FiBook className="mr-2" />
              Read
            </a>
          ) : (
            <button
              disabled={book.status === 'downloading'}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg text-center text-sm transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {book.status === 'downloading' ? (
                <FiLoader className="animate-spin mr-2" />
              ) : (
                <FiDownload className="mr-2" />
              )}
              {book.status === 'downloading' ? 'Downloading...' : 'Retry'}
            </button>
          )}
          
          <button
            onClick={handleRemove}
            disabled={isRemoving || book.status === 'downloading'}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors disabled:opacity-50"
            aria-label="Remove offline book"
          >
            {isRemoving ? (
              <FiLoader className="animate-spin" />
            ) : (
              <FiTrash2 />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}