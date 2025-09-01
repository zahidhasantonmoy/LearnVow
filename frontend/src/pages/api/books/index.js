// frontend/src/pages/api/books/index.js
import { supabase } from '../../../app/utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('books')
      .select('*');

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}