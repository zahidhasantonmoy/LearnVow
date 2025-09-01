const User = require('../models/User');

// Mock authentication token generation
const generateToken = (userId) => {
  // In a real app, this would generate a JWT
  return `mock-jwt-token-for-user-${userId}`;
};

exports.register = (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = User.create({ name, email, password });
    
    // Generate token
    const token = generateToken(newUser.id);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password (in a real app, this would be hashed)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};