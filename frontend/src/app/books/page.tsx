'use client';

import { useState, useEffect } from 'react';
import styles from './books.module.css';

// Mock data for books
const mockBooks = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    type: 'ebook',
    price: 12.99,
    cover: '/book1.jpg',
    description: 'A classic American novel set in the summer of 1922.'
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    type: 'audiobook',
    price: 14.99,
    cover: '/book2.jpg',
    description: 'A gripping tale of racial injustice and childhood innocence.'
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    category: 'Science Fiction',
    type: 'ebook',
    price: 13.99,
    cover: '/book3.jpg',
    description: 'A dystopian social science fiction novel.'
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Romance',
    type: 'audiobook',
    price: 11.99,
    cover: '/book4.jpg',
    description: 'A romantic novel of manners.'
  }
];

export default function Books() {
  const [books, setBooks] = useState(mockBooks);
  const [filteredBooks, setFilteredBooks] = useState(mockBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(mockBooks.map(book => book.category))];

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
              <button className={styles.buyButton}>Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}