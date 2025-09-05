// Bookmark button component
'use client';

import { useState } from 'react';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { FiBookmark, FiCheck } from 'react-icons/fi';

interface BookmarkButtonProps {
  contentId: number;
  currentPage: number;
  className?: string;
}

export default function BookmarkButton({ contentId, currentPage, className = '' }: BookmarkButtonProps) {
  const { bookmarks, addBookmark, loading } = useBookmarks();
  const [isAdding, setIsAdding] = useState(false);
  
  // Check if there's already a bookmark for this page
  const existingBookmark = bookmarks.find(
    bookmark => bookmark.content_id === contentId && bookmark.page_number === currentPage
  );
  
  const handleBookmark = async () => {
    if (existingBookmark || isAdding || loading) return;
    
    setIsAdding(true);
    try {
      await addBookmark(contentId, currentPage);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={!!existingBookmark || isAdding || loading}
      className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
        existingBookmark 
          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
      } ${className}`}
      aria-label={existingBookmark ? "Bookmarked" : "Add bookmark"}
    >
      {existingBookmark ? (
        <FiCheck className="text-lg" />
      ) : isAdding ? (
        <div className="w-5 h-5 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        </div>
      ) : (
        <FiBookmark className="text-lg" />
      )}
    </button>
  );
}