// frontend/src/pages/api/hello.js
import { supabase } from '../../app/utils/supabaseClient';

export default function handler(req, res) {
  res.status(200).json({ message: 'Backend API is working with Supabase!' });
}