'use client';

import { useState, useEffect } from 'react';
import { api } from '../api/apiService';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';
import styles from './books.module.css';

export default function Books() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(books.map(book => book.category))];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.getBooks();
        
        if (response.message && response.message !== 'Success') {
          setError(response.message || 'Failed to fetch books');
        } else {
          setBooks(response || []);
          setFilteredBooks(response || []);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let result = books;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'All') {
      result = result.filter(book => book.category === categoryFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'All') {
      result = result.filter(book => book.type === typeFilter.toLowerCase());
    }
    
    setFilteredBooks(result);
  }, [searchTerm, categoryFilter, typeFilter, books]);

  const handlePurchase = async (bookId) => {
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }
      
      const response = await api.purchaseBook(bookId, session.access_token);
      
      if (response.message && response.message !== 'Purchase successful') {
        alert('Purchase failed: ' + response.message);
      } else {
        alert('Book purchased successfully!');
        // Refresh the page to update the UI
        router.refresh();
      }
    } catch (err) {
      alert('An error occurred during purchase');
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading books...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Browse Books</h1>
      </header>
      
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search books or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={styles.filterSelect}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="All">All Types</option>
          <option value="Ebook">Ebooks</option>
          <option value="Audiobook">Audiobooks</option>
        </select>
      </div>
      
      <div className={styles.booksGrid}>
        {filteredBooks.map(book => (
          <div key={book.id} className={styles.bookCard}>
            <img src={book.cover} alt={book.title} className={styles.bookCover} />
            <div className={styles.bookInfo}>
              <h3 className={styles.bookTitle}>{book.title}</h3>
              <p className={styles.bookAuthor}>by {book.author}</p>
              <p className={styles.bookCategory}>{book.category}</p>
              <p className={styles.bookType}>{book.type}</p>
              <p className={styles.bookPrice}>${book.price}</p>
              <button 
                className={styles.buyButton}
                onClick={() => handlePurchase(book.id)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}