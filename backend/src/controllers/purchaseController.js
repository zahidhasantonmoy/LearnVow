const Purchase = require('../models/Purchase');
const Book = require('../models/Book');

exports.purchaseBook = (req, res) => {
  try {
    const { bookId } = req.body;
    // In a real app, we would get the user ID from the authenticated user
    const userId = req.user.id;
    
    // Check if book exists
    const book = Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Create purchase record
    const purchase = Purchase.createPurchase(userId, bookId);
    
    res.status(201).json({
      message: 'Purchase successful',
      purchase
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};