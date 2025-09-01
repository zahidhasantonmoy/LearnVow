"use client";

import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>LearnVow - Ebook & Audiobook Platform</h1>
        <nav className={styles.nav}>
          <a href="/books">Browse Books</a>
          <a href="/library">My Library</a>
          <a href="/auth/login">Login</a>
          <a href="/auth/signup">Sign Up</a>
        </nav>
      </header>
      
      <main className={styles.main}>
        <section className={styles.hero}>
          <h2>Discover Your Next Favorite Book</h2>
          <p>Explore our collection of ebooks and audiobooks</p>
          <a href="/books" className={styles.browseButton}>Browse Collection</a>
        </section>
        
        <section className={styles.features}>
          <div className={styles.feature}>
            <h3>Ebooks</h3>
            <p>Read anytime, anywhere on any device</p>
          </div>
          <div className={styles.feature}>
            <h3>Audiobooks</h3>
            <p>Listen while you commute, exercise, or relax</p>
          </div>
          <div className={styles.feature}>
            <h3>Library</h3>
            <p>Access your purchased books anytime</p>
          </div>
        </section>
      </main>
      
      <footer className={styles.footer}>
        <p>&copy; 2023 LearnVow. All rights reserved.</p>
      </footer>
    </div>
  );
}