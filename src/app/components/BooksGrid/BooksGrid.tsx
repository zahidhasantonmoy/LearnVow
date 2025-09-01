'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookCard from '../BookCard/BookCard';
import styles from './BooksGrid.module.css';

export default function BooksGrid({ books }: { books: any[] }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high'>('popular');

  // Sort books based on selected option
  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default: // popular
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  return (
    <div className={styles.booksContainer}>
      <div className={styles.controls}>
        <div className={styles.viewControls}>
          <button 
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </button>
          <button 
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
        </div>
        
        <div className={styles.sortControls}>
          <label htmlFor="sortBy">Sort by:</label>
          <select 
            id="sortBy"
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
      
      <AnimatePresence>
        <motion.div 
          className={`${styles.booksGrid} ${viewMode === 'list' ? styles.listMode : ''}`}
          layout
        >
          {sortedBooks.map((book) => (
            <motion.div
              key={book.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {sortedBooks.length === 0 && (
        <div className={styles.noBooks}>
          <h3>No books found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}