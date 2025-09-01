const supabase = require('../config/supabase');

class Library {
  static async getUserBooks(userId) {
    const { data, error } = await supabase
      .from('books')
      .select(`
        id,
        title,
        author,
        type,
        cover,
        reading_progress(progress),
        purchases(price)
      `)
      .eq('purchases.user_id', userId);

    if (error) {
      console.error('Error fetching user library:', error);
      return [];
    }

    return data.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      type: book.type,
      cover: book.cover,
      progress: book.reading_progress?.[0]?.progress || 0,
      price: book.purchases?.[0]?.price || 0,
      last_accessed: book.reading_progress?.[0]?.last_accessed || null
    }));
  }
}

module.exports = Library;