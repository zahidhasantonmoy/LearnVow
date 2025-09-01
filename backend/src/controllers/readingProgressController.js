const ReadingProgress = require('../models/ReadingProgress');

exports.getProgress = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;
    
    const progress = await ReadingProgress.getProgress(userId, bookId);
    
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { progress } = req.body;
    const userId = req.user.id;
    
    // Validate progress
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }
    
    const updatedProgress = await ReadingProgress.updateProgress(userId, bookId, progress);
    
    res.json({ message: 'Progress updated successfully', progress: updatedProgress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};