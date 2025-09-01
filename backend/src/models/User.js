const supabase = require('../config/supabase');

class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error finding user by email:', error);
      return null;
    }

    if (data) {
      return new User(data.id, data.name, data.email, data.password);
    }

    return null;
  }

  static async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: userData.name,
          email: userData.email,
          password: userData.password
        }
      ])
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    if (data) {
      return new User(data.id, data.name, data.email, data.password);
    }

    return null;
  }
}

module.exports = User;