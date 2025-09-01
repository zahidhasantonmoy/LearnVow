'use client';

import { useState, useEffect } from 'react';
import { api } from '../api/apiService';
import EbookReader from '../components/EbookReader/EbookReader';
import AudiobookPlayer from '../components/AudiobookPlayer/AudiobookPlayer';
import styles from './reader.module.css';

export default function Reader({ searchParams }: { searchParams: { id: string } }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await api.getBook(searchParams.id || 1);
        setBook(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch book');
        setLoading(false);
      }
    };

    fetchBook();
  }, [searchParams.id]);

  if (loading) {
    return <div className={styles.container}>Loading book...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  if (!book) {
    return <div className={styles.container}>Book not found</div>;
  }

  return (
    <div className={styles.container}>
      {book.type === 'ebook' ? (
        <EbookReader book={book} />
      ) : (
        <AudiobookPlayer book={book} />
      )}
    </div>
  );
}