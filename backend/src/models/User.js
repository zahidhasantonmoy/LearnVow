// Mock user model for now
// In a real application, this would connect to a database

class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password; // In a real app, this would be hashed
  }

  // Mock method to find a user by email
  static findByEmail(email) {
    // In a real app, this would query the database
    // For now, we'll return a mock user if the email matches
    if (email === 'user@example.com') {
      return new User(1, 'Test User', 'user@example.com', 'password123');
    }
    return null;
  }

  // Mock method to create a new user
  static create(userData) {
    // In a real app, this would insert into the database
    // For now, we'll just return a mock user
    return new User(2, userData.name, userData.email, userData.password);
  }
}

module.exports = User;