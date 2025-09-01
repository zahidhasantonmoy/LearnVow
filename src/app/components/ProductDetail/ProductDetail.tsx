'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiShare2, FiStar, FiBook, FiHeadphones, FiDownload, FiBookmark, FiShoppingCart } from 'react-icons/fi';
import { apiClient } from '../../services/apiClient';
import styles from './ProductDetail.module.css';

export default function ProductDetail({ book }: { book: any }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState('ebook');
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  const formatOptions = [
    { id: 'ebook', name: 'Ebook', icon: <FiBook size={20} /> },
    { id: 'audiobook', name: 'Audiobook', icon: <FiHeadphones size={20} /> }
  ];
  
  const handleAddToCart = async () => {
    try {
      // Add to cart with selected format
      const result = await apiClient.addToCart(book.id, quantity);
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
  
  const handleBuyNow = async () => {
    try {
      // Add to cart first
      const result = await apiClient.addToCart(book.id, quantity);
      
      if (result.success) {
        // Redirect to checkout
        window.location.href = '/checkout';
      } else {
        alert('Failed to add book to cart: ' + result.message);
      }
    } catch (error: any) {
      alert('An error occurred while processing your request: ' + error.message);
    }
  };

  return (
    <div className={styles.productContainer}>
      <div className={styles.productContent}>
        <motion.div 
          className={styles.productImage}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={book.cover || "/placeholder-book.jpg"} alt={book.title} />
          <div className={styles.imageActions}>
            <button className={styles.actionButton} onClick={handleAddToWishlist}>
              <FiHeart size={20} />
            </button>
            <button className={styles.actionButton}>
              <FiShare2 size={20} />
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.productInfo}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.breadcrumb}>
            <a href="/">Home</a> / <a href="/books">Books</a> / <span>{book.category}</span>
          </div>
          
          <h1 className={styles.productTitle}>{book.title}</h1>
          <p className={styles.productAuthor}>by {book.author}</p>
          
          <div className={styles.productRating}>
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
            <span className={styles.ratingCount}>({book.reviews || 128} reviews)</span>
          </div>
          
          <p className={styles.productDescription}>
            {book.description || "This is a compelling book that explores the depths of human experience through a captivating narrative. With rich character development and an engaging plot, readers will be drawn into a world that challenges their perceptions and leaves them thinking long after the final page."}
          </p>
          
          <div className={styles.formatSelector}>
            <h3 className={styles.sectionTitle}>Choose Format</h3>
            <div className={styles.formatOptions}>
              {formatOptions.map((format) => (
                <button
                  key={format.id}
                  className={`${styles.formatOption} ${selectedFormat === format.id ? styles.selected : ''}`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  {format.icon}
                  <span>{format.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.productMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Category:</span>
              <span className={styles.metaValue}>{book.category}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Pages:</span>
              <span className={styles.metaValue}>{book.pages || "N/A"}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Language:</span>
              <span className={styles.metaValue}>{book.language || "English"}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Published:</span>
              <span className={styles.metaValue}>{book.published_date || "2023"}</span>
            </div>
          </div>
          
          <div className={styles.productActions}>
            <div className={styles.priceContainer}>
              <span className={styles.currentPrice}>${book.price}</span>
              <span className={styles.originalPrice}>${(book.price * 1.2).toFixed(2)}</span>
            </div>
            
            <div className={styles.quantitySelector}>
              <button 
                className={styles.quantityButton}
                onClick={decrementQuantity}
              >
                -
              </button>
              <span className={styles.quantity}>{quantity}</span>
              <button 
                className={styles.quantityButton}
                onClick={incrementQuantity}
              >
                +
              </button>
            </div>
            
            <button className={styles.addToCartButton} onClick={handleAddToCart}>
              <FiShoppingCart size={20} />
              Add to Cart
            </button>
            
            <button className={styles.buyNowButton} onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
          
          <div className={styles.productFeatures}>
            <button className={styles.featureButton} onClick={handleAddToWishlist}>
              <FiBookmark size={20} />
              Add to Wishlist
            </button>
            <button className={styles.featureButton}>
              <FiDownload size={20} />
              Free Sample
            </button>
          </div>
        </motion.div>
      </div>
      
      <div className={styles.productTabs}>
        <div className={styles.tabHeaders}>
          <button className={`${styles.tabHeader} ${styles.active}`}>
            Description
          </button>
          <button className={styles.tabHeader}>
            Reviews ({book.reviews || 128})
          </button>
          <button className={styles.tabHeader}>
            Details
          </button>
        </div>
        
        <div className={styles.tabContent}>
          <div className={styles.tabPanel}>
            <h3>About this book</h3>
            <p>
              {book.description || "This is a compelling book that explores the depths of human experience through a captivating narrative. With rich character development and an engaging plot, readers will be drawn into a world that challenges their perceptions and leaves them thinking long after the final page."}
            </p>
            
            <h3>What you'll learn</h3>
            <ul className={styles.featuresList}>
              <li>Deep insights into human nature</li>
              <li>Engaging storytelling techniques</li>
              <li>Thought-provoking themes</li>
              <li>Expertly crafted characters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}