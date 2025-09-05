// Bookmarks page
'use client';

import { useState, useEffect } from 'react';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';
import BookmarkCard from '@/components/BookmarkCard';
import { FiBookmark, FiLoader, FiBook } from 'react-icons/fi';

export default function BookmarksPage() {
  const { bookmarks, loading } = useBookmarks();
  const { settings } = useReadingSettings();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter bookmarks based on search term
  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.content_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FiLoader className="animate-spin text-4xl text-indigo-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading bookmarks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <FiBookmark className="mr-3 text-indigo-500" />
            My Bookmarks
          </h1>
          <p className="text-gray-400">
            {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
            <FiBook className="text-5xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No bookmarks yet</h2>
            <p className="text-gray-400 mb-6">
              Start reading books and add bookmarks to save your favorite pages.
            </p>
            <a 
              href="/books" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Browse Books
            </a>
          </div>
        ) : (
          <>
            {/* Search bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                style={{
                  fontSize: `${settings.fontSize}px`,
                  fontFamily: settings.fontFamily
                }}
              />
            </div>

            {/* Bookmarks grid */}
            {filteredBookmarks.length === 0 ? (
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
                <h2 className="text-2xl font-bold mb-2">No bookmarks found</h2>
                <p className="text-gray-400">
                  Try adjusting your search term.
                </p>
              </div>
            ) : (
              <div 
                className="grid gap-6"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                }}
              >
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}