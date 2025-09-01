"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBook, FiHeadphones, FiStar, FiBookmark, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import styles from './library.module.css';

export default function Library() {
  const [activeTab, setActiveTab] = useState('library');
  
  // Mock library data
  const mockLibrary = [
    {
      id: 1,
      title: "The Future of AI",
      author: "Dr. Jane Smith",
      progress: 75,
      cover: "/placeholder-book.jpg",
      type: "ebook",
      category: "Technology",
      lastAccessed: "2023-06-15"
    },
    {
      id: 2,
      title: "Mysteries of the Universe",
      author: "Prof. John Doe",
      progress: 30,
      cover: "/placeholder-book.jpg",
      type: "audiobook",
      category: "Science",
      lastAccessed: "2023-06-10"
    },
    {
      id: 3,
      title: "Digital Nomad Lifestyle",
      author: "Sarah Williams",
      progress: 100,
      cover: "/placeholder-book.jpg",
      type: "ebook",
      category: "Lifestyle",
      lastAccessed: "2023-05-28"
    }
  ];
  
  // Mock wishlist data
  const mockWishlist = [
    {
      id: 4,
      title: "Quantum Computing Explained",
      author: "Dr. Michael Brown",
      price: 29.99,
      cover: "/placeholder-book.jpg",
      type: "ebook",
      category: "Technology",
      rating: 4.7
    },
    {
      id: 5,
      title: "The Art of Mindfulness",
      author: "Emma Thompson",
      price: 16.99,
      cover: "/placeholder-book.jpg",
      type: "audiobook",
      category: "Self-Help",
      rating: 4.3
    }
  ];
  
  const stats = [
    { icon: <FiBook size={24} />, label: "Books Read", value: 24 },
    { icon: <FiHeadphones size={24} />, label: "Hours Listened", value: 42 },
    { icon: <FiStar size={24} />, label: "Avg. Rating", value: "4.5" },
    { icon: <FiBookmark size={24} />, label: "In Library", value: mockLibrary.length }
  ];
  
  const tabs = [
    { id: 'library', name: 'My Library', icon: <FiBook size={20} /> },
    { id: 'wishlist', name: 'Wishlist', icon: <FiBookmark size={20} /> },
    { id: 'profile', name: 'Profile', icon: <FiUser size={20} /> }
  ];
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <FiUser size={32} />
          </div>
          <div className={styles.userDetails}>
            <h1 className={styles.userName}>Welcome back, Alex</h1>
            <p className={styles.userEmail}>alex.johnson@example.com</p>
            <p className={styles.memberSince}>Member since January 2023</p>
          </div>
        </div>
        
        <div className={styles.userStats}>
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className={styles.statCard}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={styles.statIcon}>
                {stat.icon}
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <nav className={styles.nav}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
          
          <div className={styles.favoriteGenre}>
            <h3>Favorite Genre</h3>
            <div className={styles.genreTag}>
              Science Fiction
            </div>
          </div>
        </div>
        
        <div className={styles.mainContent}>
          {activeTab === 'library' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.sectionHeader}>
                <h2>My Library</h2>
                <p>{mockLibrary.length} books in your library</p>
              </div>
              
              {mockLibrary.length > 0 ? (
                <div className={styles.libraryGrid}>
                  {mockLibrary.map((book) => (
                    <div key={book.id} className={styles.bookCard}>
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
                        
                        <div className={styles.progressContainer}>
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill} 
                              style={{ width: `${book.progress}%` }}
                            ></div>
                          </div>
                          <span className={styles.progressText}>{book.progress}% complete</span>
                        </div>
                        
                        <p className={styles.lastAccessed}>
                          Last accessed: {new Date(book.lastAccessed).toLocaleDateString()}
                        </p>
                        
                        <button className={styles.continueButton}>
                          {book.type === 'ebook' ? 'Continue Reading' : 'Continue Listening'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptySection}>
                  <h3>Your library is empty</h3>
                  <p>Start building your library by purchasing books</p>
                  <Link href="/books" className={styles.browseButton}>
                    Browse Books
                  </Link>
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'wishlist' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.sectionHeader}>
                <h2>Wishlist</h2>
                <p>{mockWishlist.length} books in your wishlist</p>
              </div>
              
              {mockWishlist.length > 0 ? (
                <div className={styles.libraryGrid}>
                  {mockWishlist.map((book) => (
                    <div key={book.id} className={styles.bookCard}>
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
                                className={i < Math.floor(book.rating || 4.5) ? styles.filledStar : styles.emptyStar}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className={styles.ratingValue}>{book.rating || 4.5}</span>
                        </div>
                        
                        <div className={styles.bookPrice}>
                          <span className={styles.currentPrice}>${book.price}</span>
                          <span className={styles.originalPrice}>${(book.price * 1.2).toFixed(2)}</span>
                        </div>
                        
                        <div className={styles.wishlistActions}>
                          <button className={styles.actionButton}>
                            <FiShoppingCart size={20} />
                            Add to Cart
                          </button>
                          <button className={styles.actionButton}>
                            <FiBookmark size={20} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptySection}>
                  <h3>Your wishlist is empty</h3>
                  <p>Start adding books to your wishlist</p>
                  <Link href="/books" className={styles.browseButton}>
                    Browse Books
                  </Link>
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.sectionHeader}>
                <h2>Profile Settings</h2>
                <p>Manage your account information</p>
              </div>
              
              <div className={styles.profileForm}>
                <div className={styles.formSection}>
                  <h3>Personal Information</h3>
                  
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Full Name</label>
                      <input type="text" id="name" defaultValue="Alex Johnson" />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email Address</label>
                      <input type="email" id="email" defaultValue="alex.johnson@example.com" />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="password">Password</label>
                      <input type="password" id="password" placeholder="••••••••" />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input type="password" id="confirmPassword" placeholder="••••••••" />
                    </div>
                  </div>
                </div>
                
                <div className={styles.formSection}>
                  <h3>Reading Preferences</h3>
                  
                  <div className={styles.preferenceGroup}>
                    <label>Favorite Genres</label>
                    <div className={styles.genreTags}>
                      <span className={styles.genreTag}>Science Fiction</span>
                      <span className={styles.genreTag}>Mystery</span>
                      <span className={styles.genreTag}>Technology</span>
                      <span className={styles.genreTag}>Self-Help</span>
                    </div>
                  </div>
                  
                  <div className={styles.preferenceGroup}>
                    <label>Notification Preferences</label>
                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" defaultChecked />
                        <span>New book releases</span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" defaultChecked />
                        <span>Special offers</span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" />
                        <span>Reading recommendations</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button className={styles.cancelButton}>Cancel</button>
                  <button className={styles.saveButton}>Save Changes</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}