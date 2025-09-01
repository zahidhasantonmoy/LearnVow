"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBook, FiHeadphones, FiStar, FiShoppingCart, FiHeart, FiFilter, FiSearch } from 'react-icons/fi';
import styles from './books.module.css';

export default function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  
  // Mock book data
  const mockBooks = [
    {
      id: 1,
      title: "The Future of AI",
      author: "Dr. Jane Smith",
      price: 19.99,
      cover: "/placeholder-book.jpg",
      type: "ebook",
      category: "Technology",
      rating: 4.8,
      description: "Explore the cutting-edge developments in artificial intelligence and their impact on society."
    },
    {
      id: 2,
      title: "Mysteries of the Universe",
      author: "Prof. John Doe",
      price: 24.99,
      cover: "/placeholder-book.jpg",
      type: "audiobook",
      category: "Science",
      rating: 4.5,
      description: "Journey through space and time to uncover the secrets of our cosmos."
    },
    {
      id: 3,
      title: "Digital Nomad Lifestyle",
      author: "Sarah Williams",
      price: 14.99,
      cover: "/placeholder-book.jpg",
      type: "ebook",
      category: "Lifestyle",
      rating: 4.2,
      description: "Learn how to travel the world while building a remote career."
    },
    {
      id: 4,
      title: "Quantum Computing Explained",
      author: "Dr. Michael Brown",
      price: 29.99,
      cover: "/placeholder-book.jpg",
      type: "ebook",
      category: "Technology",
      rating: 4.7,
      description: "A comprehensive guide to understanding quantum computing principles."
    },
    {
      id: 5,
      title: "The Art of Mindfulness",
      author: "Emma Thompson",
      price: 16.99,
      cover: "/placeholder-book.jpg",
      type: "audiobook",
      category: "Self-Help",
      rating: 4.3,
      description: "Practical techniques to reduce stress and improve mental well-being."
    },
    {
      id: 6,
      title: "Blockchain Revolution",
      author: "Robert Chen",
      price: 22.99,
      cover: "/placeholder-book.jpg",
      type: "ebook",
      category: "Technology",
      rating: 4.6,
      description: "How blockchain technology is transforming industries worldwide."
    }
  ];
  
  // Filter books based on search and filters
  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
    const matchesType = typeFilter === 'All' || book.type === typeFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesType;
  });
  
  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(mockBooks.map(book => book.category))];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Browse Books</h1>
        <p className={styles.subtitle}>{filteredBooks.length} books found</p>
      </div>
      
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search books or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterContainer}>
          <FiFilter className={styles.filterIcon} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.filterSelect}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterContainer}>
          <FiFilter className={styles.filterIcon} />
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
      </div>
      
      {filteredBooks.length === 0 ? (
        <div className={styles.noBooks}>
          <h3>No books found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <motion.div 
          className={styles.booksGrid}
          layout
        >
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              className={styles.bookCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className={styles.bookImage}>
                <img src={book.cover} alt={book.title} />
              </div>
              
              <div className={styles.bookInfo}>
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookAuthor}>by {book.author}</p>
                
                <div className={styles.bookMeta}>
                  <span className={styles.bookCategory}>{book.category}</span>
                  <span className={styles.bookType}>{book.type}</span>
                </div>
                
                <div className={styles.bookRating}>
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={i < Math.floor(book.rating) ? styles.filledStar : styles.emptyStar}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className={styles.ratingValue}>{book.rating}</span>
                </div>
                
                <div className={styles.bookPrice}>
                  <span className={styles.currentPrice}>${book.price}</span>
                  <span className={styles.originalPrice}>${(book.price * 1.2).toFixed(2)}</span>
                </div>
                
                <div className={styles.bookActions}>
                  <button className={styles.actionButton}>
                    <FiHeart size={20} />
                  </button>
                  <button className={styles.actionButton}>
                    <FiShoppingCart size={20} />
                  </button>
                  <Link href={`/books/${book.id}`} className={styles.actionButton}>
                    <FiBook size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}