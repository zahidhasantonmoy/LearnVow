// Ebook reader component
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiChevronLeft, FiChevronRight, FiMaximize, FiMinimize } from 'react-icons/fi';
import Button from '@/components/ui/Button';

interface EbookReaderProps {
  bookId: number;
  title: string;
  fileUrl: string;
}

export default function EbookReader({ bookId, title, fileUrl }: EbookReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100); // This would come from the ebook metadata
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading the ebook
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <FiMinimize /> : <FiMaximize />}
            </Button>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col md:flex-row gap-6">
          {/* Ebook viewer */}
          <motion.div 
            className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center p-8">
              <div className="text-6xl mb-4 text-gray-600">
                <FiBook />
              </div>
              <h2 className="text-2xl font-bold mb-2">Page {currentPage}</h2>
              <p className="text-gray-400 max-w-md">
                This is where the ebook content would be displayed. In a real implementation, 
                this would render the actual ebook content using a library like epub.js.
              </p>
            </div>
          </motion.div>

          {/* Book info sidebar */}
          <motion.div 
            className="w-full md:w-80 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 h-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-bold text-lg mb-4">Book Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Current Page</p>
                <p>{currentPage} of {totalPages}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Reading Progress</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${(currentPage / totalPages) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
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