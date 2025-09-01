const supabase = require('../config/supabase');

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
    const { data, error } = await supabase
      .from('books')
      .select('*');

    if (error) {
      console.error('Error fetching books:', error);
      return [];
    }

    return data.map(book => new Book(
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
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching book by ID:', error);
      return null;
    }

    if (data) {
      return new Book(
        data.id, 
        data.title, 
        data.author, 
        data.category, 
        data.type, 
        data.price, 
        data.cover, 
        data.description,
        data.file_path
      );
    }

    return null;
  }
}

module.exports = Book;