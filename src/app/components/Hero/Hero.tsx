'use client';

import { motion } from 'framer-motion';
import { FiBook, FiHeadphones, FiStar } from 'react-icons/fi';
import styles from './Hero.module.css';

export default function Hero() {
  return (
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
            <button className={styles.primaryButton}>
              Browse Collection
            </button>
            <button className={styles.secondaryButton}>
              View Library
            </button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className={styles.features}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiBook size={24} />
            </div>
            <h3>Ebooks</h3>
            <p>Read anytime, anywhere on any device</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiHeadphones size={24} />
            </div>
            <h3>Audiobooks</h3>
            <p>Listen while you commute, exercise, or relax</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiStar size={24} />
            </div>
            <h3>Library</h3>
            <p>Access your purchased books anytime</p>
          </div>
        </motion.div>
      </div>
      
      <div className={styles.heroBackground}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.orb3}></div>
      </div>
    </div>
  );
}