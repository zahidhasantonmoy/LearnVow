// Bookmark card component
'use client';

import { useState } from 'react';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { FiBook, FiTrash2, FiEdit2, FiExternalLink } from 'react-icons/fi';
import BookmarkNoteModal from '@/components/BookmarkNoteModal';
import Button from '@/components/ui/Button';

interface BookmarkCardProps {
  bookmark: {
    id: number;
    content_id: number;
    content_title: string;
    content_cover_url: string;
    page_number: number;
    note: string;
    created_at: string;
  };
}

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const { removeBookmark } = useBookmarks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await removeBookmark(bookmark.id);
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-indigo-500 transition-colors">
        {/* Book cover */}
        <div className="relative">
          {bookmark.content_cover_url ? (
            <img 
              src={bookmark.content_cover_url} 
              alt={bookmark.content_title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="bg-gray-700 w-full h-48 flex items-center justify-center">
              <FiBook className="text-4xl text-gray-500" />
            </div>
          )}
          <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
            Page {bookmark.page_number}
          </div>
        </div>

        {/* Bookmark content */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-2">
            {bookmark.content_title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-3">
            Bookmarked on {formatDate(bookmark.created_at)}
          </p>

          {bookmark.note && (
            <div className="mb-4">
              <p className="text-gray-300 line-clamp-3 italic">
                "{bookmark.note}"
              </p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <a 
              href={`/books/${bookmark.content_id}?page=${bookmark.page_number}`}
              className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
            >
              <FiExternalLink className="mr-1" />
              Go to page
            </a>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsModalOpen(true)}
                aria-label="Edit note"
              >
                <FiEdit2 size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                aria-label="Delete bookmark"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <FiTrash2 size={16} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BookmarkNoteModal
        bookmarkId={bookmark.id}
        contentId={bookmark.content_id}
        currentPage={bookmark.page_number}
        initialNote={bookmark.note}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => setIsModalOpen(false)}
      />
    </>
  );
}