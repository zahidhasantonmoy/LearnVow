'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard, FiShield, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { apiClient } from '../../services/apiClient';
import styles from './Checkout.module.css';

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
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

  const steps = [
    { id: 1, name: 'Shipping' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Confirm' }
  ];
  
  const paymentMethods = [
    { id: 'card', name: 'Credit Card', icon: <FiCreditCard size={20} /> },
    { id: 'paypal', name: 'PayPal', icon: <FiCreditCard size={20} /> },
    { id: 'crypto', name: 'Cryptocurrency', icon: <FiCreditCard size={20} /> }
  ];
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  const handlePlaceOrder = async () => {
    try {
      // Create order data
      const orderData = {
        items: cartItems.map(item => ({
          bookId: item.book.id,
          quantity: item.quantity,
          price: item.book.price
        })),
        totalAmount: total,
        paymentMethod
      };
      
      // Process payment
      const result = await apiClient.createOrder(orderData);
      
      if (result.success) {
        alert('Order placed successfully!');
        // Redirect to library or order confirmation page
        window.location.href = '/library';
      } else {
        alert('Failed to process payment: ' + result.message);
      }
    } catch (error: any) {
      alert('An error occurred while processing your order: ' + error.message);
    }
  };
  
  const handleBackToCart = () => {
    window.location.href = '/cart';
  };

  if (loading) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.error}>
          <h3>Error</h3>
          <p>{error}</p>
          <button className={styles.continueShopping} onClick={handleBackToCart}>
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.emptyCart}>
          <h3>Your cart is empty</h3>
          <p>Add some books to your cart before checkout</p>
          <button className={styles.continueShopping} onClick={handleBackToCart}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

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
                    <input type="text" id="firstName" placeholder="John" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" placeholder="Doe" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="john@example.com" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" placeholder="+1 (555) 123-4567" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" placeholder="123 Main St" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" placeholder="New York" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="state">State</label>
                    <input type="text" id="state" placeholder="NY" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="zip">ZIP Code</label>
                    <input type="text" id="zip" placeholder="10001" />
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button className={styles.secondaryButton} onClick={handleBackToCart}>
                    <FiArrowLeft size={18} />
                    Back to Cart
                  </button>
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
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id}
                      className={`${styles.paymentMethod} ${paymentMethod === method.id ? styles.selected : ''}`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className={styles.methodIcon}>
                        {method.icon}
                      </div>
                      <span>{method.name}</span>
                    </div>
                  ))}
                </div>
                
                {paymentMethod === 'card' && (
                  <div className={styles.cardForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor="cardNumber">Card Number</label>
                      <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="expiry">Expiry Date</label>
                        <input type="text" id="expiry" placeholder="MM/YY" />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="cvv">CVV</label>
                        <input type="text" id="cvv" placeholder="123" />
                      </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="cardName">Name on Card</label>
                      <input type="text" id="cardName" placeholder="John Doe" />
                    </div>
                  </div>
                )}
                
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
                      <div key={item.book.id} className={styles.orderItem}>
                        <div className={styles.itemImage}>
                          <img src={item.book.cover} alt={item.book.title} />
                        </div>
                        <div className={styles.itemDetails}>
                          <h4>{item.book.title}</h4>
                          <p>by {item.book.author}</p>
                          <p>{item.book.type}</p>
                        </div>
                        <div className={styles.itemPrice}>
                          ${item.book.price} x {item.quantity}
                        </div>
                        <div className={styles.itemTotal}>
                          ${(item.book.price * item.quantity).toFixed(2)}
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
                
                <div className={styles.formActions}>
                  <button 
                    className={styles.secondaryButton}
                    onClick={() => setCurrentStep(2)}
                  >
                    <FiArrowLeft size={18} />
                    Back to Payment
                  </button>
                  <button className={styles.primaryButton} onClick={handlePlaceOrder}>
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
                  <div key={item.book.id} className={styles.summaryItem}>
                    <div className={styles.summaryItemInfo}>
                      <h4>{item.book.title}</h4>
                      <p>{item.quantity} x ${item.book.price}</p>
                    </div>
                    <div className={styles.summaryItemPrice}>
                      ${(item.book.price * item.quantity).toFixed(2)}
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