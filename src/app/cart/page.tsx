// Enhanced Shopping cart page with improved mobile responsiveness
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiBook, FiHeadphones, FiTrash2 } from 'react-icons/fi';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  contentType: 'ebook' | 'audiobook';
  cover_url?: string;
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = () => {
    setCheckoutLoading(true);
    // In a real implementation, this would redirect to a payment processor
    setTimeout(() => {
      setCheckoutLoading(false);
      alert('Checkout simulation complete. In a real app, this would redirect to a payment processor.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          
          {cartCount === 0 ? (
            <Card className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-gray-400 mb-6">Add some books to your cart to get started</p>
              <Button variant="secondary" href="/books" className="touch-target">
                Browse Books
              </Button>
            </Card>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4">
                      <div className="bg-gray-700 rounded-lg w-24 h-32 flex-shrink-0 flex items-center justify-center">
                        {item.cover_url ? (
                          <img 
                            src={item.cover_url} 
                            alt={item.title} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-3xl">
                            {item.contentType === 'ebook' ? <FiBook /> : <FiHeadphones />}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 w-full">
                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {item.contentType === 'ebook' ? 'Ebook' : 'Audiobook'}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="touch-target"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="touch-target"
                            >
                              +
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="touch-target"
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="w-full lg:w-80">
                <Card className="sticky top-28">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal ({cartCount} items)</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tax</span>
                      <span>${(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-700">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">${(cartTotal * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full touch-target"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-3 touch-target"
                    href="/books"
                  >
                    Continue Shopping
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}