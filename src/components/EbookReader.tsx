// Enhanced Ebook reader component with bookmarks and highlights
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiChevronLeft, FiChevronRight, FiMaximize, FiMinimize, FiBookmark, FiBarChart2, FiSettings } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import BookmarksAndHighlights from '@/components/BookmarksAndHighlights';
import ReadingStatistics from '@/components/ReadingStatistics';
import { ReadingExperienceService } from '@/services/readingExperience';
import { useAuth } from '@/contexts/AuthContext';

interface EbookReaderProps {
  bookId: number;
  title: string;
  fileUrl: string;
}

export default function EbookReader({ bookId, title, fileUrl }: EbookReaderProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100); // This would come from the ebook metadata
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'bookmarks' | 'stats' | 'settings'>('bookmarks');
  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading the ebook
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update reading statistics when page changes
    if (user && !loading) {
      updateReadingStatistics();
    }
  }, [currentPage, user, loading]);

  const updateReadingStatistics = async () => {
    if (!user) return;
    
    try {
      await ReadingExperienceService.updateReadingStatistics(
        user.id,
        bookId,
        {
          pages_read: currentPage,
          last_read: new Date().toISOString(),
          time_spent: 120 // In a real implementation, this would track actual time
        }
      );
    } catch (error) {
      console.error('Error updating reading statistics:', error);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const navigateToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading ebook...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-gray-900 to-indigo-900 text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="container mx-auto px-4 py-6 h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-4"
        >
          <h1 className="text-2xl font-bold truncate max-w-md">{title}</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiBookmark />
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <FiMinimize /> : <FiMaximize />}
            </Button>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col md:flex-row gap-6">
          {/* Ebook viewer */}
          <motion.div 
            ref={readerRef}
            className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center p-8 max-w-2xl">
              <div className="text-6xl mb-4 text-gray-600">
                <FiBook />
              </div>
              <h2 className="text-2xl font-bold mb-2">Page {currentPage}</h2>
              <p className="text-gray-400 mb-6">
                This is where the ebook content would be displayed. In a real implementation, 
                this would render the actual ebook content using a library like epub.js.
              </p>
              <div className="bg-gray-700 rounded-lg p-6 text-left">
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          {sidebarOpen && (
            <motion.div 
              className="w-full md:w-80 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 h-fit md:h-full flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Reading Tools</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  Close
                </Button>
              </div>
              
              <div className="flex gap-1 mb-4 border-b border-gray-700">
                <Button
                  variant={activeSidebarTab === 'bookmarks' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveSidebarTab('bookmarks')}
                  className="flex-1"
                >
                  <FiBookmark className="mr-1" />
                  Notes
                </Button>
                <Button
                  variant={activeSidebarTab === 'stats' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveSidebarTab('stats')}
                  className="flex-1"
                >
                  <FiBarChart2 className="mr-1" />
                  Stats
                </Button>
                <Button
                  variant={activeSidebarTab === 'settings' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveSidebarTab('settings')}
                  className="flex-1"
                >
                  <FiSettings className="mr-1" />
                  Settings
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {activeSidebarTab === 'bookmarks' && (
                  <BookmarksAndHighlights 
                    contentId={bookId}
                    currentPage={currentPage}
                    onNavigateToBookmark={navigateToPage}
                  />
                )}
                
                {activeSidebarTab === 'stats' && (
                  <ReadingStatistics contentId={bookId} />
                )}
                
                {activeSidebarTab === 'settings' && (
                  <div className="space-y-4">
                    <h4 className="font-bold">Reading Settings</h4>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Font Size
                      </label>
                      <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option>Small</option>
                        <option selected>Medium</option>
                        <option>Large</option>
                        <option>Extra Large</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Background Color
                      </label>
                      <div className="flex gap-2">
                        {['#1e293b', '#f0f0f0', '#fef3c7', '#dbeafe'].map((color) => (
                          <div
                            key={color}
                            className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-600"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500" />
                        <span className="ml-2 text-gray-400">Night Mode</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation controls */}
        <motion.div 
          className="flex justify-between items-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            variant="outline"
          >
            <FiChevronLeft className="mr-2" /> Previous
          </Button>
          
          <div className="text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          
          <Button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next <FiChevronRight className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}