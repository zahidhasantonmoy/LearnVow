"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '../../services/apiClient';
import ProductDetail from '../../components/ProductDetail/ProductDetail';
import styles from './book-detail.module.css';

export default function BookDetailPage() {
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const { id } = params || {};

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          setError('No book ID provided');
          setLoading(false);
          return;
        }
        
        const result = await apiClient.getBook(id as string);
        
        if (result.success) {
          setBook(result.data);
        } else {
          setError(result.message || 'Failed to fetch book details');
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch book details');
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading book details...</p>
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

  if (!book) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Book Not Found</h2>
          <p>The book you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ProductDetail book={book} />
    </div>
  );
}