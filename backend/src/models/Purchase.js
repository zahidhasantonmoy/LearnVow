const db = require('../config/db');

class Purchase {
  static async createPurchase(userId, bookId) {
    // First, get the book price
    const bookQuery = 'SELECT price FROM books WHERE id = $1';
    const bookResult = await db.query(bookQuery, [bookId]);
    
    if (bookResult.rows.length === 0) {
      throw new Error('Book not found');
    }
    
    const price = bookResult.rows[0].price;
    
    // Create the purchase record
    const purchaseQuery = 'INSERT INTO purchases (user_id, book_id, price) VALUES ($1, $2, $3) RETURNING *';
    const purchaseResult = await db.query(purchaseQuery, [userId, bookId, price]);
    
    if (purchaseResult.rows.length > 0) {
      return purchaseResult.rows[0];
    }
    
    return null;
  }
}

module.exports = Purchase;