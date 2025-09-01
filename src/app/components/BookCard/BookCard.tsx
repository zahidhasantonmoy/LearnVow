'use client';

import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { apiClient } from '../../services/apiClient';
import styles from './BookCard.module.css';

export default function BookCard({ book }: { book: any }) {
  const handleAddToCart = async () => {
    try {
      const result = await apiClient.addToCart(book.id);
      if (result.success) {
        alert(`${book.title} added to cart!`);
      } else {
        alert('Failed to add book to cart: ' + result.message);
      }
    } catch (error: any) {
      alert('An error occurred while adding to cart: ' + error.message);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const result = await apiClient.addToWishlist(book.id);
      if (result.success) {
        alert(`${book.title} added to wishlist!`);
      } else {
        alert('Failed to add book to wishlist: ' + result.message);
      }
    } catch (error: any) {
      alert('An error occurred while adding to wishlist: ' + error.message);
    }
  };

  return (
    <motion.div 
      className={styles.bookCard}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={styles.bookImageContainer}>
        <img 
          src={book.cover || "/placeholder-book.jpg"} 
          alt={book.title} 
          className={styles.bookImage}
        />
        <div className={styles.bookActions}>
          <button className={styles.actionButton} onClick={handleAddToWishlist}>
            <FiHeart size={20} />
          </button>
          <button className={styles.actionButton}>
            <FiEye size={20} />
          </button>
        </div>
      </div>
      
      <div className={styles.bookInfo}>
        <h3 className={styles.bookTitle}>{book.title}</h3>
        <p className={styles.bookAuthor}>by {book.author}</p>
        
        <div className={styles.bookMeta}>
          <span className={styles.bookCategory}>{book.category}</span>
          <span className={styles.bookType}>{book.type}</span>
        </div>
        
        <div className={styles.bookPriceContainer}>
          <span className={styles.bookPrice}>${book.price}</span>
          <span className={styles.originalPrice}>${(book.price * 1.2).toFixed(2)}</span>
        </div>
        
        <div className={styles.bookRating}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={i < Math.floor(book.rating || 4.5) ? styles.filledStar : styles.emptyStar}
              >
                ★
              </span>
            ))}
          </div>
          <span className={styles.ratingValue}>{book.rating || 4.5}</span>
        </div>
        
        <button className={styles.addToCartButton} onClick={handleAddToCart}>
          <FiShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}