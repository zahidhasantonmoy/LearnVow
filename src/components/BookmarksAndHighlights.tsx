// Bookmarks and highlights component
'use client';

import { useState, useEffect } from 'react';
import { ReadingExperienceService } from '@/services/readingExperience';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiBookmark, FiEdit, FiTrash2, FiSave, FiX } from 'react-icons/fi';

interface Bookmark {
  id: number;
  user_id: string;
  content_id: number;
  page_number: number;
  position: number;
  note: string;
  highlight_color: string;
  annotation: string;
  created_at: string;
}

interface HighlightColor {
  id: number;
  name: string;
  hex_color: string;
}

export default function BookmarksAndHighlights({ 
  contentId, 
  currentPage,
  onNavigateToBookmark
}: { 
  contentId: number; 
  currentPage: number;
  onNavigateToBookmark: (page: number) => void;
}) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [highlightColors, setHighlightColors] = useState<HighlightColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBookmarkNote, setNewBookmarkNote] = useState('');
  const [editingBookmark, setEditingBookmark] = useState<number | null>(null);
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    if (user) {
      loadBookmarks();
      loadHighlightColors();
    }
  }, [user, contentId]);

  const loadBookmarks = async () => {
    if (!user) return;
    
    try {
      const data = await ReadingExperienceService.getBookmarks(user.id, contentId);
      setBookmarks(data);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHighlightColors = async () => {
    try {
      const colors = await ReadingExperienceService.getHighlightColors();
      setHighlightColors(colors);
    } catch (error) {
      console.error('Error loading highlight colors:', error);
    }
  };

  const addBookmark = async () => {
    if (!user || !newBookmarkNote.trim()) return;
    
    try {
      const newBookmark = await ReadingExperienceService.addBookmark({
        user_id: user.id,
        content_id: contentId,
        page_number: currentPage,
        position: 0, // In a real implementation, this would be the text position
        note: newBookmarkNote,
        highlight_color: 'yellow',
        annotation: ''
      });
      
      if (newBookmark) {
        setBookmarks([...bookmarks, newBookmark]);
        setNewBookmarkNote('');
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const updateBookmark = async (id: number) => {
    if (!editNote.trim()) return;
    
    try {
      const updatedBookmark = await ReadingExperienceService.updateBookmark(id, {
        note: editNote
      });
      
      if (updatedBookmark) {
        setBookmarks(bookmarks.map(b => 
          b.id === id ? updatedBookmark : b
        ));
        setEditingBookmark(null);
        setEditNote('');
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const deleteBookmark = async (id: number) => {
    try {
      const success = await ReadingExperienceService.deleteBookmark(id);
      
      if (success) {
        setBookmarks(bookmarks.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="py-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-3 h-16"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold mb-3 flex items-center">
          <FiBookmark className="mr-2" />
          Bookmarks & Highlights
        </h3>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={newBookmarkNote}
            onChange={(e) => setNewBookmarkNote(e.target.value)}
            placeholder="Add a note to your bookmark..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addBookmark();
              }
            }}
          />
          <Button 
            onClick={addBookmark}
            disabled={!newBookmarkNote.trim()}
            className="rounded-l-none"
            size="sm"
          >
            <FiBookmark className="mr-1" />
            Add
          </Button>
        </div>
      </div>
      
      {bookmarks.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <FiBookmark className="mx-auto text-2xl mb-2" />
          <p>No bookmarks yet</p>
          <p className="text-sm">Add bookmarks as you read to keep track of important passages</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="p-3">
              {editingBookmark === bookmark.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingBookmark(null)}
                    >
                      <FiX className="mr-1" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => updateBookmark(bookmark.id)}
                    >
                      <FiSave className="mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-400">
                      Page {bookmark.page_number} • {formatDate(bookmark.created_at)}
                    </span>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingBookmark(bookmark.id);
                          setEditNote(bookmark.note);
                        }}
                      >
                        <FiEdit className="text-xs" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteBookmark(bookmark.id)}
                      >
                        <FiTrash2 className="text-xs" />
                      </Button>
                    </div>
                  </div>
                  
                  <p 
                    className="cursor-pointer hover:text-indigo-300 transition-colors"
                    onClick={() => onNavigateToBookmark(bookmark.page_number)}
                  >
                    {bookmark.note}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {highlightColors.slice(0, 4).map((color) => (
                      <div
                        key={color.id}
                        className="w-4 h-4 rounded-full cursor-pointer border border-gray-600"
                        style={{ backgroundColor: color.hex_color }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}