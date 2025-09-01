'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiHeadphones, FiStar, FiDownload, FiHeart, FiBookmark, FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import { apiClient } from '../../services/apiClient';
import BookCard from '../BookCard/BookCard';
import styles from './UserDashboard.module.css';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('library');
  const [user, setUser] = useState<any>(null);
  const [libraryBooks, setLibraryBooks] = useState<any[]>([]);
  const [wishlistBooks, setWishlistBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const userResult = await apiClient.getCurrentUser();
        if (userResult.success) {
          setUser(userResult.data);
        } else {
          // Redirect to login if not authenticated
          window.location.href = '/auth/login';
          return;
        }
        
        // Fetch library books
        const libraryResult = await apiClient.getLibrary();
        if (libraryResult.success) {
          setLibraryBooks(libraryResult.data || []);
        }
        
        // Fetch wishlist
        const wishlistResult = await apiClient.getWishlist();
        if (wishlistResult.success) {
          setWishlistBooks(wishlistResult.data || []);
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const result = await apiClient.logout();
      if (result.success) {
        window.location.href = '/';
      } else {
        alert('Failed to logout: ' + result.message);
      }
    } catch (error: any) {
      alert('An error occurred during logout: ' + error.message);
    }
  };

  const stats = [
    { icon: <FiBook size={24} />, label: "Books Read", value: libraryBooks.filter(book => book.progress === 100).length },
    { icon: <FiHeadphones size={24} />, label: "Hours Listened", value: "42" },
    { icon: <FiStar size={24} />, label: "Avg. Rating", value: "4.5" },
    { icon: <FiBookmark size={24} />, label: "In Library", value: libraryBooks.length }
  ];
  
  const tabs = [
    { id: 'library', name: 'My Library', icon: <FiBook size={20} /> },
    { id: 'wishlist', name: 'Wishlist', icon: <FiHeart size={20} /> },
    { id: 'history', name: 'Reading History', icon: <FiBookmark size={20} /> },
    { id: 'profile', name: 'Profile', icon: <FiUser size={20} /> }
  ];
  
  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.error}>
          <h2>Authentication Required</h2>
          <p>Please log in to access your dashboard</p>
          <button 
            className={styles.loginButton} 
            onClick={() => window.location.href = '/auth/login'}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <FiUser size={32} />
          </div>
          <div className={styles.userDetails}>
            <h1 className={styles.userName}>Welcome back, {user.name || user.email}</h1>
            <p className={styles.userEmail}>{user.email}</p>
            <p className={styles.memberSince}>Member since {new Date(user.created_at || user.created_at).toLocaleDateString()}</p>
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <FiLogOut size={20} />
            Logout
          </button>
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
      
      <div className={styles.dashboardContent}>
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
                <p>{libraryBooks.length} books in your library</p>
              </div>
              
              {libraryBooks.length > 0 ? (
                <div className={styles.libraryGrid}>
                  {libraryBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptySection}>
                  <h3>Your library is empty</h3>
                  <p>Start building your library by purchasing books</p>
                  <button 
                    className={styles.browseButton}
                    onClick={() => window.location.href = '/books'}
                  >
                    Browse Books
                  </button>
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
                <p>{wishlistBooks.length} books in your wishlist</p>
              </div>
              
              {wishlistBooks.length > 0 ? (
                <div className={styles.libraryGrid}>
                  {wishlistBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptySection}>
                  <h3>Your wishlist is empty</h3>
                  <p>Start adding books to your wishlist</p>
                  <button 
                    className={styles.browseButton}
                    onClick={() => window.location.href = '/books'}
                  >
                    Browse Books
                  </button>
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.sectionHeader}>
                <h2>Reading History</h2>
                <p>Your reading and listening history</p>
              </div>
              
              {libraryBooks.length > 0 ? (
                <div className={styles.historyList}>
                  {libraryBooks.map((book) => (
                    <div key={book.id} className={styles.historyItem}>
                      <img src={book.cover} alt={book.title} />
                      <div className={styles.historyInfo}>
                        <h3>{book.title}</h3>
                        <p>by {book.author}</p>
                        <div className={styles.historyMeta}>
                          <span className={styles.historyType}>{book.type}</span>
                          <span className={styles.historyDate}>
                            Last accessed: {book.purchase_date ? new Date(book.purchase_date).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${book.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className={styles.progressText}>{book.progress || 0}% complete</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptySection}>
                  <h3>No reading history</h3>
                  <p>Start reading books to see your history</p>
                  <button 
                    className={styles.browseButton}
                    onClick={() => window.location.href = '/books'}
                  >
                    Browse Books
                  </button>
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
                      <input type="text" id="name" defaultValue={user.name || ''} />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email Address</label>
                      <input type="email" id="email" defaultValue={user.email} />
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