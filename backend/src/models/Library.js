// Mock library model for now
// In a real application, this would connect to a database

class Library {
  // Mock method to get purchased books for a user
  static getUserBooks(userId) {
    // In a real app, this would query the database for books purchased by the user
    // For now, we'll return mock data
    return [
      {
        id: 1,
        userId: userId,
        bookId: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        type: 'ebook',
        cover: '/book1.jpg',
        progress: 50, // Percentage read/listened
        lastAccessed: '2023-05-15'
      },
      {
        id: 2,
        userId: userId,
        bookId: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        type: 'audiobook',
        cover: '/book2.jpg',
        progress: 75,
        lastAccessed: '2023-05-10'
      }
    ];
  }
}

module.exports = Library;