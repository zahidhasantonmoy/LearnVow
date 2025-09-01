"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowLeft, FiCreditCard } from 'react-icons/fi';
import styles from './cart.module.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "The Future of AI",
      author: "Dr. Jane Smith",
      price: 19.99,
      quantity: 1,
      cover: "/placeholder-book.jpg",
      type: "ebook"
    },
    {
      id: 2,
      title: "Mysteries of the Universe",
      author: "Prof. John Doe",
      price: 24.99,
      quantity: 2,
      cover: "/placeholder-book.jpg",
      type: "audiobook"
    }
  ]);
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Shopping Cart</h1>
        <p className={styles.subtitle}>{cartItems.length} items in your cart</p>
      </div>
      
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <div className={styles.emptyIcon}>
            <FiShoppingCart size={64} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Start adding some books to your cart</p>
          <Link href="/books" className={styles.continueShopping}>
            Browse Books
          </Link>
        </div>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            <motion.div 
              className={styles.itemsList}
              layout
            >
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={styles.cartItem}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className={styles.itemImage}>
                    <img src={item.cover} alt={item.title} />
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemAuthor}>by {item.author}</p>
                    <span className={styles.itemType}>{item.type}</span>
                  </div>
                  
                  <div className={styles.itemQuantity}>
                    <button 
                      className={styles.quantityButton}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button 
                      className={styles.quantityButton}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                  
                  <div className={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button 
                    className={styles.removeItem}
                    onClick={() => removeItem(item.id)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <div className={styles.cartSummary}>
            <div className={styles.summaryCard}>
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
              
              <div className={styles.summaryActions}>
                <Link href="/books" className={styles.continueShopping}>
                  <FiArrowLeft size={20} />
                  Continue Shopping
                </Link>
                <Link href="/checkout" className={styles.checkoutButton}>
                  <FiCreditCard size={20} />
                  Proceed to Checkout
                </Link>
              </div>
            </div>
            
            <div className={styles.promoCode}>
              <h4>Have a promo code?</h4>
              <div className={styles.promoInput}>
                <input type="text" placeholder="Enter code" />
                <button>Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}