'use client';

import { useState, useEffect } from 'react';
import { api } from '../../api/apiService';
import { useRouter } from 'next/navigation';
import styles from './EbookReader.module.css';

export default function EbookReader({ book }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(100); // In a real app, this would come from the book data
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.getProgress(book.id);
        if (!response.error) {
          setProgress(response.data || 0);
          // Set current page based on progress
          const calculatedPage = Math.floor(((response.data || 0) / 100) * totalPages) || 1;
          setCurrentPage(calculatedPage);
        }
      } catch (err) {
        console.error('Failed to fetch reading progress');
      }
    };

    fetchProgress();
  }, [book.id, totalPages]);

  const updateProgress = async (newProgress) => {
    try {
      const response = await api.updateProgress(book.id, newProgress);
      if (!response.error) {
        setProgress(newProgress);
      }
    } catch (err) {
      console.error('Failed to update reading progress');
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      
      // Update progress
      const newProgress = Math.floor((newPage / totalPages) * 100);
      updateProgress(newProgress);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      
      // Update progress
      const newProgress = Math.floor((newPage / totalPages) * 100);
      updateProgress(newProgress);
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 2);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // In a real app, this would fetch the actual book content
  const bookContent = `Chapter ${currentPage}
  
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.`;

  return (
    <div className={`${styles.readerContainer} ${styles[theme]}`}>
      <div className={styles.readerHeader}>
        <h2>{book.title}</h2>
        <p>by {book.author}</p>
      </div>
      
      <div className={styles.readerControls}>
        <div className={styles.controlGroup}>
          <button onClick={decreaseFontSize} disabled={fontSize <= 12}>A-</button>
          <span>Font Size: {fontSize}px</span>
          <button onClick={increaseFontSize} disabled={fontSize >= 24}>A+</button>
        </div>
        
        <div className={styles.controlGroup}>
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>
      
      <div className={styles.readerContent}>
        <pre className={styles.bookContent} style={{ fontSize: `${fontSize}px` }}>
          {bookContent}
        </pre>
      </div>
      
      <div className={styles.readerNavigation}>
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
          className={styles.navButton}
        >
          Previous
        </button>
        
        <span className={styles.pageIndicator}>
          Page {currentPage} of {totalPages} ({progress}% complete)
        </span>
        
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
          className={styles.navButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}