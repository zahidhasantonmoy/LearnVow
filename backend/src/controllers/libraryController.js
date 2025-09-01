const Library = require('../models/Library');

exports.getUserLibrary = async (req, res) => {
  try {
    const userId = req.user.id;
    const books = await Library.getUserBooks(userId);
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};