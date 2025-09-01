const db = require('../config/db');

class Library {
  static async getUserBooks(userId) {
    const query = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.type,
        b.cover,
        COALESCE(rp.progress, 0) as progress,
        rp.last_accessed
      FROM books b
      JOIN purchases p ON b.id = p.book_id
      LEFT JOIN reading_progress rp ON b.id = rp.book_id AND rp.user_id = $1
      WHERE p.user_id = $1
      ORDER BY rp.last_accessed DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }
}

module.exports = Library;