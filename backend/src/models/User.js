const db = require('../config/db');

class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      return new User(user.id, user.name, user.email, user.password);
    }
    
    return null;
  }

  static async create(userData) {
    const { name, email, password } = userData;
    const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
    const result = await db.query(query, [name, email, password]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      return new User(user.id, user.name, user.email, user.password);
    }
    
    return null;
  }
}

module.exports = User;