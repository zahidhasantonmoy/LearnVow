// Mock purchase model for now
// In a real application, this would connect to a database

class Purchase {
  // Mock method to create a new purchase
  static createPurchase(userId, bookId) {
    // In a real app, this would insert a new purchase record in the database
    // For now, we'll return mock data
    return {
      id: Math.floor(Math.random() * 1000),
      userId: userId,
      bookId: bookId,
      purchaseDate: new Date().toISOString(),
      price: 12.99 // This would come from the book data in a real app
    };
  }
}

module.exports = Purchase;