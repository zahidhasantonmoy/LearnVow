"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '../services/apiClient';
import BooksGrid from '../components/BooksGrid/BooksGrid';
import styles from './books.module.css';

export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const type = searchParams?.get('type') || '';
  const category = searchParams?.get('category') || '';

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // Create filters object
        const filters: { type?: string; category?: string } = {};
        if (type) filters.type = type;
        if (category) filters.category = category;
        
        const result = await apiClient.getBooks(filters);
        
        if (result.success) {
          setBooks(result.data);
        } else {
          setError(result.message || 'Failed to fetch books');
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, [type, category]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {type ? `${type.charAt(0).toUpperCase() + type.slice(1)}s` : 'All Books'}
          {category && ` in ${category}`}
        </h1>
        <p className={styles.subtitle}>
          {books.length} {books.length === 1 ? 'book' : 'books'} found
        </p>
      </div>
      
      <BooksGrid books={books} />
    </div>
  );
}