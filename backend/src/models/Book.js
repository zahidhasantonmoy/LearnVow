// Mock book model for now
// In a real application, this would connect to a database

class Book {
  constructor(id, title, author, category, type, price, cover, description) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.category = category;
    this.type = type; // 'ebook' or 'audiobook'
    this.price = price;
    this.cover = cover;
    this.description = description;
  }

  // Mock method to find all books
  static findAll() {
    // In a real app, this would query the database
    return [
      new Book(1, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 'ebook', 12.99, '/book1.jpg', 'A classic American novel set in the summer of 1922.'),
      new Book(2, 'To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'audiobook', 14.99, '/book2.jpg', 'A gripping tale of racial injustice and childhood innocence.'),
      new Book(3, '1984', 'George Orwell', 'Science Fiction', 'ebook', 13.99, '/book3.jpg', 'A dystopian social science fiction novel.'),
      new Book(4, 'Pride and Prejudice', 'Jane Austen', 'Romance', 'audiobook', 11.99, '/book4.jpg', 'A romantic novel of manners.')
    ];
  }

  // Mock method to find a book by ID
  static findById(id) {
    const books = this.findAll();
    return books.find(book => book.id == id) || null;
  }
}

module.exports = Book;