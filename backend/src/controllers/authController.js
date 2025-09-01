const supabase = require('../config/supabase');
const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
      await User.create({
        id: data.user.id,
        name,
        email
      });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: data.user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({
      message: 'Login successful',
      user: data.user,
      session: data.session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    // Get user from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};