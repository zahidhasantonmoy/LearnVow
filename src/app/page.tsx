"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBook, FiHeadphones, FiStar, FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';
import styles from './page.module.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Mock data for demonstration
  const features = [
    {
      icon: <FiBook size={24} />,
      title: "Ebooks",
      description: "Read anytime, anywhere on any device"
    },
    {
      icon: <FiHeadphones size={24} />,
      title: "Audiobooks",
      description: "Listen while you commute, exercise, or relax"
    },
    {
      icon: <FiStar size={24} />,
      title: "Personal Library",
      description: "Access your purchased books anytime"
    }
  ];

  const heroButtons = [
    { text: "Browse Collection", href: "/books", primary: true },
    { text: "View Library", href: "/library", primary: false }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.div 
            className={styles.textContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className={styles.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Discover Your Next <span className={styles.highlight}>Favorite</span> Book
            </motion.h1>
            
            <motion.p 
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Explore thousands of ebooks and audiobooks from bestselling authors. 
              Read anytime, anywhere on any device.
            </motion.p>
            
            <motion.div 
              className={styles.ctaContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {heroButtons.map((button, index) => (
                <Link 
                  key={index}
                  href={button.href}
                  className={`${styles.ctaButton} ${button.primary ? styles.primary : styles.secondary}`}
                >
                  {button.text}
                </Link>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className={styles.features}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
        
        <div className={styles.heroBackground}>
          <div className={styles.orb1}></div>
          <div className={styles.orb2}></div>
          <div className={styles.orb3}></div>
        </div>
      </div>
      
      {/* Books Preview Section */}
      <div className={styles.previewSection}>
        <div className={styles.sectionHeader}>
          <h2>Popular Books</h2>
          <Link href="/books" className={styles.browseLink}>Browse All Books</Link>
        </div>
        
        <div className={styles.booksPreview}>
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className={styles.bookCard}>
              <div className={styles.bookCover}>
                <FiBook size={48} />
              </div>
              <div className={styles.bookInfo}>
                <h3>Book Title {id}</h3>
                <p>Author Name</p>
                <div className={styles.bookMeta}>
                  <span className={styles.bookType}>Ebook</span>
                  <span className={styles.bookPrice}>$19.99</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}