const PaymentService = require('../services/paymentService');
const Purchase = require('../models/Purchase');
const Book = require('../models/Book');

exports.initiatePayment = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;
    
    // Check if book exists
    const book = Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Create order data
    const orderData = {
      orderId: `ORDER_${Date.now()}_${userId}_${bookId}`,
      amount: book.price,
      currency: 'BDT',
      productCategory: book.category,
      productName: book.title,
      userId: userId,
      bookId: bookId
    };
    
    // Initiate payment with SSLCommerz
    const paymentResponse = await PaymentService.initiatePayment(orderData);
    
    if (paymentResponse.status === 'SUCCESS') {
      res.json({
        message: 'Payment initiated successfully',
        redirectUrl: paymentResponse.gatewayUrl,
        orderId: paymentResponse.orderId
      });
    } else {
      res.status(500).json({ message: 'Failed to initiate payment' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId, orderId } = req.body;
    
    // Verify payment with SSLCommerz
    const verificationResponse = await PaymentService.verifyPayment({
      transactionId,
      orderId
    });
    
    if (verificationResponse.status === 'SUCCESS') {
      // Extract bookId and userId from orderId (in a real app, you might store this in a database)
      const orderParts = orderId.split('_');
      const userId = orderParts[2];
      const bookId = orderParts[3];
      
      // Create purchase record
      const purchase = Purchase.createPurchase(userId, bookId);
      
      res.json({
        message: 'Payment verified and book purchased successfully',
        purchase
      });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};