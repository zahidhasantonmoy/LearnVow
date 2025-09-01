'use client';

import { useState, useEffect } from 'react';
import { api } from '../api/apiService';
import styles from './library.module.css';

export default function Library() {
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLibrary = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/auth/login';
        return;
      }
      
      try {
        const data = await api.getLibrary(token);
        setPurchasedBooks(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch library');
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  if (loading) {
    return <div className={styles.container}>Loading library...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>My Library</h1>
      </header>
      
      {purchasedBooks.length === 0 ? (
        <div className={styles.emptyLibrary}>
          <p>You haven't purchased any books yet.</p>
          <a href="/books" className={styles.browseLink}>Browse Books</a>
        </div>
      ) : (
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
      )}
    </div>
  );
}