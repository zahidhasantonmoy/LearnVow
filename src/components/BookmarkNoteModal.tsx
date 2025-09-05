// Bookmark note modal component
'use client';

import { useState } from 'react';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { FiX, FiBookmark, FiEdit2 } from 'react-icons/fi';
import Button from '@/components/ui/Button';

interface BookmarkNoteModalProps {
  bookmarkId?: number;
  contentId: number;
  currentPage: number;
  initialNote?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
}

export default function BookmarkNoteModal({
  bookmarkId,
  contentId,
  currentPage,
  initialNote = '',
  isOpen,
  onClose,
  onSave
}: BookmarkNoteModalProps) {
  const [note, setNote] = useState(initialNote);
  const [isSaving, setIsSaving] = useState(false);
  const { addBookmark, updateBookmark } = useBookmarks();

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      if (bookmarkId) {
        // Update existing bookmark
        await updateBookmark(bookmarkId, note);
      } else {
        // Add new bookmark
        await addBookmark(contentId, currentPage, note);
      }
      onSave(note);
      onClose();
    } catch (error) {
      console.error('Error saving bookmark note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div 
        className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold flex items-center">
            <FiBookmark className="mr-2" />
            {bookmarkId ? 'Edit Bookmark Note' : 'Add Bookmark Note'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Page {currentPage}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your note here..."
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white resize-none"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <FiEdit2 className="mr-2" />
                  Save Note
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}