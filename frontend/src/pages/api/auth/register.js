// frontend/src/pages/api/auth/register.js
import { supabase } from '../../../app/utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  try {
    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Create user record in our users table
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            name,
            email
          }
        ]);

      if (insertError) {
        console.error('Error creating user record:', insertError);
      }
    }

    return res.status(201).json({
      message: 'User registered successfully',
      user: data.user
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}