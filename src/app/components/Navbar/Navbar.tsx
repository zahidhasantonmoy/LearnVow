'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiBook, FiHeadphones, FiSearch, FiLogOut } from 'react-icons/fi';
import { apiClient } from '../../services/apiClient';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is authenticated
        const userResult = await apiClient.getCurrentUser();
        if (userResult.success) {
          setUser(userResult.data);
        }
        
        // Get cart items count
        const cartResult = await apiClient.getCart();
        if (cartResult.success) {
          setCartItemsCount(cartResult.data.items?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch navbar data', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const result = await apiClient.logout();
      if (result.success) {
        setUser(null);
        setCartItemsCount(0);
        // Redirect to home page
        window.location.href = '/';
      } else {
        alert('Failed to logout: ' + result.message);
      }
    } catch (error: any) {
      alert('An error occurred during logout: ' + error.message);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Books', path: '/books' },
    { name: 'Ebooks', path: '/books?type=ebook' },
    { name: 'Audiobooks', path: '/books?type=audiobook' },
    { name: 'Library', path: '/library' },
  ];

  return (
    <motion.nav 
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <motion.span 
            className={styles.logoText}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Learn<span className={styles.logoAccent}>Vow</span>
          </motion.span>
        </Link>

        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`${styles.navLink} ${pathname === link.path ? styles.active : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className={styles.navActions}>
          <button className={styles.searchButton}>
            <FiSearch size={20} />
          </button>
          
          <Link href="/cart" className={styles.cartButton}>
            <FiShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className={styles.cartBadge}>{cartItemsCount}</span>
            )}
          </Link>
          
          {user ? (
            <div className={styles.userMenu}>
              <Link href="/library" className={styles.userButton}>
                <FiUser size={20} />
              </Link>
              <button className={styles.logoutButton} onClick={handleLogout}>
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className={styles.userButton}>
              <FiUser size={20} />
            </Link>
          )}
          
          <button 
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.mobileLinks}>
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={`${styles.mobileLink} ${pathname === link.path ? styles.active : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className={styles.mobileActions}>
              <Link href="/cart" className={styles.mobileCart}>
                <FiShoppingCart size={20} />
                <span>Cart ({cartItemsCount})</span>
              </Link>
              {user ? (
                <>
                  <Link href="/library" className={styles.mobileUser}>
                    <FiUser size={20} />
                    <span>Library</span>
                  </Link>
                  <button className={styles.mobileLogout} onClick={handleLogout}>
                    <FiLogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className={styles.mobileUser}>
                  <FiUser size={20} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}