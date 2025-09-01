const db = require('../config/db');

class Book {
  constructor(id, title, author, category, type, price, cover, description, filePath) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.category = category;
    this.type = type;
    this.price = price;
    this.cover = cover;
    this.description = description;
    this.filePath = filePath;
  }

  static async findAll() {
    const query = 'SELECT * FROM books';
    const result = await db.query(query);
    
    return result.rows.map(book => new Book(
      book.id, 
      book.title, 
      book.author, 
      book.category, 
      book.type, 
      book.price, 
      book.cover, 
      book.description,
      book.file_path
    ));
  }

  static async findById(id) {
    const query = 'SELECT * FROM books WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rows.length > 0) {
      const book = result.rows[0];
      return new Book(
        book.id, 
        book.title, 
        book.author, 
        book.category, 
        book.type, 
        book.price, 
        book.cover, 
        book.description,
        book.file_path
      );
    }
    
    return null;
  }
}

module.exports = Book;