const db = require('../config/db');

class ReadingProgress {
  static async getProgress(userId, bookId) {
    const query = 'SELECT progress FROM reading_progress WHERE user_id = $1 AND book_id = $2';
    const result = await db.query(query, [userId, bookId]);
    
    if (result.rows.length > 0) {
      return result.rows[0].progress;
    }
    
    return 0;
  }

  static async updateProgress(userId, bookId, progress) {
    // Check if progress record exists
    const checkQuery = 'SELECT id FROM reading_progress WHERE user_id = $1 AND book_id = $2';
    const checkResult = await db.query(checkQuery, [userId, bookId]);
    
    if (checkResult.rows.length > 0) {
      // Update existing record
      const updateQuery = 'UPDATE reading_progress SET progress = $1, last_accessed = CURRENT_TIMESTAMP WHERE user_id = $2 AND book_id = $3 RETURNING *';
      const result = await db.query(updateQuery, [progress, userId, bookId]);
      return result.rows[0];
    } else {
      // Create new record
      const insertQuery = 'INSERT INTO reading_progress (user_id, book_id, progress) VALUES ($1, $2, $3) RETURNING *';
      const result = await db.query(insertQuery, [userId, bookId, progress]);
      return result.rows[0];
    }
  }
}

module.exports = ReadingProgress;