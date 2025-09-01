'use client';

import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerLogo}>
            Learn<span className={styles.footerLogoAccent}>Vow</span>
          </h3>
          <p className={styles.footerDescription}>
            Discover and enjoy thousands of ebooks and audiobooks from bestselling authors.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>
              <FiFacebook size={20} />
            </a>
            <a href="#" className={styles.socialLink}>
              <FiTwitter size={20} />
            </a>
            <a href="#" className={styles.socialLink}>
              <FiInstagram size={20} />
            </a>
            <a href="#" className={styles.socialLink}>
              <FiLinkedin size={20} />
            </a>
          </div>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Quick Links</h4>
          <ul className={styles.footerLinks}>
            <li><a href="/">Home</a></li>
            <li><a href="/books">Books</a></li>
            <li><a href="/library">My Library</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/wishlist">Wishlist</a></li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Categories</h4>
          <ul className={styles.footerLinks}>
            <li><a href="/books?category=fiction">Fiction</a></li>
            <li><a href="/books?category=non-fiction">Non-Fiction</a></li>
            <li><a href="/books?category=sci-fi">Sci-Fi</a></li>
            <li><a href="/books?category=romance">Romance</a></li>
            <li><a href="/books?category=mystery">Mystery</a></li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Contact Us</h4>
          <ul className={styles.contactInfo}>
            <li className={styles.contactItem}>
              <FiMapPin size={18} />
              <span>123 Book Street, Literary City</span>
            </li>
            <li className={styles.contactItem}>
              <FiPhone size={18} />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className={styles.contactItem}>
              <FiMail size={18} />
              <span>support@learnvow.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} LearnVow. All rights reserved.</p>
        <div className={styles.footerPolicies}>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/refund">Refund Policy</a>
        </div>
      </div>
    </footer>
  );
}