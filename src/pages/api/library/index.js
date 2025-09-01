// frontend/src/pages/api/library/index.js
import { supabase } from '../../../app/utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    // Call the Supabase function we created
    const { data, error } = await supabase.rpc('get_user_library', {
      user_uuid: user.id
    });

    if (error) {
      return res.status(500).json({ message: 'Database error', error: error.message });
    }

    return res.status(200).json(data || []);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}