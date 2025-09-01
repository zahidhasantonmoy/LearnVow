"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCreditCard, FiShield, FiCheckCircle, FiArrowLeft, FiUser, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import styles from './checkout.module.css';

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: ''
  });
  
  const steps = [
    { id: 1, name: 'Shipping' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Confirm' }
  ];
  
  const cartItems = [
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
  ];
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePlaceOrder = () => {
    alert('Order placed successfully! Redirecting to library...');
    // In a real app, this would redirect to order confirmation
    window.location.href = '/library';
  };
  
  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutHeader}>
        <h1 className={styles.checkoutTitle}>Checkout</h1>
        <p className={styles.checkoutSubtitle}>Complete your purchase securely</p>
      </div>
      
      <div className={styles.checkoutContent}>
        <div className={styles.checkoutSteps}>
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`${styles.step} ${currentStep === step.id ? styles.active : ''} ${currentStep > step.id ? styles.completed : ''}`}
            >
              <div className={styles.stepIndicator}>
                {currentStep > step.id ? (
                  <FiCheckCircle size={20} />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className={styles.stepName}>{step.name}</span>
            </div>
          ))}
        </div>
        
        <div className={styles.checkoutMain}>
          <motion.div 
            className={styles.checkoutForm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentStep === 1 && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Shipping Information</h2>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John" 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe" 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com" 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567" 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="address">Address</label>
                    <input 
                      type="text" 
                      id="address" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St" 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="city">City</label>
                    <input 
                      type="text" 
                      id="city" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York" 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="state">State</label>
                    <input 
                      type="text" 
                      id="state" 
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY" 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="zip">ZIP Code</label>
                    <input 
                      type="text" 
                      id="zip" 
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="10001" 
                    />
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <Link href="/cart" className={styles.secondaryButton}>
                    <FiArrowLeft size={18} />
                    Back to Cart
                  </Link>
                  <button 
                    className={styles.primaryButton}
                    onClick={() => setCurrentStep(2)}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Payment Method</h2>
                
                <div className={styles.paymentMethods}>
                  <div className={`${styles.paymentMethod} ${styles.selected}`}>
                    <div className={styles.methodIcon}>
                      <FiCreditCard size={20} />
                    </div>
                    <span>Credit Card</span>
                  </div>
                </div>
                
                <div className={styles.cardForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="cardNumber">Card Number</label>
                    <input 
                      type="text" 
                      id="cardNumber" 
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456" 
                    />
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="expiry">Expiry Date</label>
                      <input 
                        type="text" 
                        id="expiry" 
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY" 
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="cvv">CVV</label>
                      <input 
                        type="text" 
                        id="cvv" 
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123" 
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="cardName">Name on Card</label>
                    <input 
                      type="text" 
                      id="cardName" 
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe" 
                    />
                  </div>
                </div>
                
                <div className={styles.securityNote}>
                  <FiShield size={20} />
                  <span>Your payment information is securely encrypted</span>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    className={styles.secondaryButton}
                    onClick={() => setCurrentStep(1)}
                  >
                    <FiArrowLeft size={18} />
                    Back to Shipping
                  </button>
                  <button 
                    className={styles.primaryButton}
                    onClick={() => setCurrentStep(3)}
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Order Review</h2>
                
                <div className={styles.orderSummary}>
                  <h3>Order Details</h3>
                  
                  <div className={styles.orderItems}>
                    {cartItems.map((item) => (
                      <div key={item.id} className={styles.orderItem}>
                        <div className={styles.itemImage}>
                          <img src={item.cover} alt={item.title} />
                        </div>
                        <div className={styles.itemDetails}>
                          <h4>{item.title}</h4>
                          <p>by {item.author}</p>
                          <p>{item.type}</p>
                        </div>
                        <div className={styles.itemPrice}>
                          ${item.price} x {item.quantity}
                        </div>
                        <div className={styles.itemTotal}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.orderTotals}>
                    <div className={styles.totalRow}>
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className={styles.totalRow}>
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className={styles.totalRow}>
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className={styles.totalRowFinal}>
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.shippingAddress}>
                  <h3>Shipping Address</h3>
                  <p>{formData.firstName} {formData.lastName}</p>
                  <p>{formData.address}</p>
                  <p>{formData.city}, {formData.state} {formData.zip}</p>
                  <p>{formData.email}</p>
                  <p>{formData.phone}</p>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    className={styles.secondaryButton}
                    onClick={() => setCurrentStep(2)}
                  >
                    <FiArrowLeft size={18} />
                    Back to Payment
                  </button>
                  <button 
                    className={styles.primaryButton}
                    onClick={handlePlaceOrder}
                  >
                    Complete Order
                  </button>
                </div>
              </div>
            )}
          </motion.div>
          
          <div className={styles.checkoutSidebar}>
            <div className={styles.orderSummary}>
              <h3 className={styles.sidebarTitle}>Order Summary</h3>
              
              <div className={styles.summaryItems}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.summaryItem}>
                    <div className={styles.summaryItemInfo}>
                      <h4>{item.title}</h4>
                      <p>{item.quantity} x ${item.price}</p>
                    </div>
                    <div className={styles.summaryItemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.summaryTotals}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className={styles.summaryRowFinal}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.securityBadge}>
              <FiShield size={24} />
              <div>
                <h4>Secure Checkout</h4>
                <p>Your information is protected with 256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}