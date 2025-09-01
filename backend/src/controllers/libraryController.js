const Library = require('../models/Library');

exports.getUserLibrary = (req, res) => {
  try {
    // In a real app, we would get the user ID from the authenticated user
    // For now, we'll use a mock user ID
    const userId = 1; // This would come from req.user.id in a real app
    
    const books = Library.getUserBooks(userId);
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};