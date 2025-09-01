const supabase = require('../config/supabase');

class Purchase {
  static async createPurchase(userId, bookId) {
    // First, get the book price
    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .select('price')
      .eq('id', bookId)
      .single();

    if (bookError) {
      throw new Error('Book not found');
    }

    const price = bookData.price;

    // Create the purchase record
    const { data, error } = await supabase
      .from('purchases')
      .insert([
        {
          user_id: userId,
          book_id: bookId,
          price: price
        }
      ])
      .single();

    if (error) {
      console.error('Error creating purchase:', error);
      return null;
    }

    return data;
  }
}

module.exports = Purchase;