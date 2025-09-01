const Book = require('../models/Book');

exports.getAllBooks = (req, res) => {
  try {
    const books = Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBookById = (req, res) => {
  try {
    const { id } = req.params;
    const book = Book.findById(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};