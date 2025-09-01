const supabase = require('../config/supabase');

class Library {
  static async getUserBooks(userId) {
    // Call the Supabase function we created
    const { data, error } = await supabase.rpc('get_user_library', {
      user_uuid: userId
    });

    if (error) {
      console.error('Error fetching user library:', error);
      return [];
    }

    return data || [];
  }
}

module.exports = Library;