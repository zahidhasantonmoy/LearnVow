'use client';

import Link from 'next/link';
import styles from './navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.navLogo}>
          LearnVow
        </Link>
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <Link href="/books" className={styles.navLink}>
              Browse Books
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/library" className={styles.navLink}>
              My Library
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/auth/login" className={styles.navLink}>
              Login
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/auth/signup" className={styles.navLink}>
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}