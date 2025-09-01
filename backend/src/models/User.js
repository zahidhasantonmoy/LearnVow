const supabase = require('../config/supabase');

class User {
  constructor(id, name, email, created_at) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.created_at = created_at;
  }

  // Note: We're not implementing create or findByEmail here
  // because we'll use Supabase Auth for user management
  // This model is kept for compatibility with existing code

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }

    if (data) {
      return new User(data.id, data.name, data.email, data.created_at);
    }

    return null;
  }

  static async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: userData.name,
          email: userData.email
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    if (data) {
      return new User(data.id, data.name, data.email, data.created_at);
    }

    return null;
  }
}

module.exports = User;