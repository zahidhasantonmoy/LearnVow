'use client';

import { useState, useEffect } from 'react';
import styles from './library.module.css';

// Mock data for purchased books
const mockPurchasedBooks = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    type: 'ebook',
    cover: '/book1.jpg',
    progress: 50, // Percentage read/listened
    lastAccessed: '2023-05-15'
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    type: 'audiobook',
    cover: '/book2.jpg',
    progress: 75,
    lastAccessed: '2023-05-10'
  }
];

export default function Library() {
  const [purchasedBooks, setPurchasedBooks] = useState(mockPurchasedBooks);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>My Library</h1>
      </header>
      
      <div className={styles.libraryGrid}>
        {purchasedBooks.map(book => (
          <div key={book.id} className={styles.bookCard}>
            <img src={book.cover} alt={book.title} className={styles.bookCover} />
            <div className={styles.bookInfo}>
              <h3 className={styles.bookTitle}>{book.title}</h3>
              <p className={styles.bookAuthor}>by {book.author}</p>
              <p className={styles.bookType}>{book.type}</p>
              
              <div className={styles.progressContainer}>
                <span>Progress: {book.progress}%</span>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${book.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <p className={styles.lastAccessed}>
                Last accessed: {book.lastAccessed}
              </p>
              
              <button className={styles.continueButton}>
                {book.type === 'ebook' ? 'Continue Reading' : 'Continue Listening'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}