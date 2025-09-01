// frontend/src/pages/api/purchase/index.js
import { supabase } from '../../../app/utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get user from authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Set the session in Supabase
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: ''
    });
    
    if (sessionError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Get the user
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { bookId } = req.body;

    // First get the book price
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('price')
      .eq('id', bookId)
      .single();
      
    if (bookError) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Create purchase record
    const { data, error } = await supabase
      .from('purchases')
      .insert([
        {
          user_id: user.id,
          book_id: bookId,
          price: book.price
        }
      ]);
      
    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    return res.status(201).json({
      message: 'Purchase successful',
      data
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}