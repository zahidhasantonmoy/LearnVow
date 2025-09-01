'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { apiClient } from '../../services/apiClient';
import styles from './ShoppingCart.module.css';

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const result = await apiClient.getCart();
        if (result.success) {
          setCartItems(result.data.items || []);
        } else {
          setError(result.message || 'Failed to fetch cart items');
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch cart items');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const updateQuantity = async (bookId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const result = await apiClient.updateCartItem(bookId, newQuantity);
      if (result.success) {
        setCartItems(result.data.items || []);
      } else {
        alert('Failed to update quantity: ' + result.message);
      }
    } catch (error: any) {
      alert('Failed to update quantity: ' + error.message);
    }
  };

  const removeItem = async (bookId: string) => {
    try {
      const result = await apiClient.removeFromCart(bookId);
      if (result.success) {
        setCartItems(result.data.items || []);
      } else {
        alert('Failed to remove item: ' + result.message);
      }
    } catch (error: any) {
      alert('Failed to remove item: ' + error.message);
    }
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  const handleContinueShopping = () => {
    window.location.href = '/books';
  };

  if (loading) {
    return (
      <div className={styles.cartContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.cartContainer}>
        <div className={styles.error}>
          <h3>Error</h3>
          <p>{error}</p>
          <button className={styles.continueShopping} onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <h1 className={styles.cartTitle}>Your Shopping Cart</h1>
        <p className={styles.cartCount}>{cartItems.length} items</p>
      </div>

      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <h3>Your cart is empty</h3>
          <p>Start adding some books to your cart</p>
          <button className={styles.continueShopping} onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div 
                  key={item.book.id}
                  className={styles.cartItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.itemImage}>
                    <img src={item.book.cover} alt={item.book.title} />
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemTitle}>{item.book.title}</h3>
                    <p className={styles.itemAuthor}>by {item.book.author}</p>
                    <span className={styles.itemType}>{item.book.type}</span>
                  </div>
                  
                  <div className={styles.itemQuantity}>
                    <button 
                      className={styles.quantityButton}
                      onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button 
                      className={styles.quantityButton}
                      onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                  
                  <div className={styles.itemPrice}>
                    ${(item.book.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button 
                    className={styles.removeItem}
                    onClick={() => removeItem(item.book.id)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className={styles.cartSummary}>
            <div className={styles.summarySection}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className={styles.summaryRowTotal}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button className={styles.checkoutButton} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            
            <button className={styles.continueShopping} onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}