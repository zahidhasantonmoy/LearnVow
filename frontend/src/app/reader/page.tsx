'use client';

import { useState, useEffect } from 'react';
import styles from './reader.module.css';

export default function Reader({ searchParams }: { searchParams: { id: string } }) {
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(100); // Mock total pages

  // Mock book data
  useEffect(() => {
    // In a real app, this would come from an API call
    const mockBook = {
      id: searchParams.id || 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      content: `Chapter 1
When I came back from the war, I didn't want to go back to my old job in the city. 
Instead, I decided to try my luck in the bond business, and I moved to West Egg, 
a less fashionable area than East Egg but still quite luxurious.

My neighbor was a mysterious man who threw enormous parties every weekend. 
I had never actually met him, but I had heard many stories about him. 
They said he was a millionaire, but no one seemed to know exactly where his money came from.

One day, I received an invitation to one of his parties. I decided to go, 
thinking it might be interesting to meet this enigmatic host...`
    };
    setBook(mockBook);
  }, [searchParams.id]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!book) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{book.title}</h1>
        <p>by {book.author}</p>
      </header>
      
      <div className={styles.readerControls}>
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
          className={styles.controlButton}
        >
          Previous
        </button>
        <span className={styles.pageIndicator}>
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
          className={styles.controlButton}
        >
          Next
        </button>
      </div>
      
      <div className={styles.content}>
        <pre className={styles.bookContent}>
          {book.content}
        </pre>
      </div>
      
      <div className={styles.readerControls}>
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
          className={styles.controlButton}
        >
          Previous
        </button>
        <span className={styles.pageIndicator}>
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
          className={styles.controlButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}