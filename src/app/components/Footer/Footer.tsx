'use client';

import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import styles from './Footer.module.css';

export default function Footer() {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Books', path: '/books' },
    { name: 'Ebooks', path: '/books?type=ebook' },
    { name: 'Audiobooks', path: '/books?type=audiobook' },
    { name: 'Library', path: '/library' },
    { name: 'Cart', path: '/cart' },
  ];
  
  const categories = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 
    'Romance', 'Biography', 'Self-Help', 'Technology'
  ];
  
  const socialLinks = [
    { icon: <FiFacebook size={20} />, url: '#' },
    { icon: <FiTwitter size={20} />, url: '#' },
    { icon: <FiInstagram size={20} />, url: '#' },
    { icon: <FiLinkedin size={20} />, url: '#' },
  ];

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
            {socialLinks.map((social, index) => (
              <a 
                key={index} 
                href={social.url} 
                className={styles.socialLink}
                aria-label="Social media link"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Quick Links</h4>
          <ul className={styles.footerLinks}>
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.path} className={styles.footerLink}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Categories</h4>
          <ul className={styles.footerLinks}>
            {categories.map((category, index) => (
              <li key={index}>
                <Link href={`/books?category=${encodeURIComponent(category)}`} className={styles.footerLink}>
                  {category}
                </Link>
              </li>
            ))}
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
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/refund">Refund Policy</Link>
        </div>
      </div>
    </footer>
  );
}