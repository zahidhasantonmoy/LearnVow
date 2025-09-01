const supabase = require('../config/supabase');

class ReadingProgress {
  static async getProgress(userId, bookId) {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('progress')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .single();

    if (error) {
      console.error('Error fetching reading progress:', error);
      return 0;
    }

    return data ? data.progress : 0;
  }

  static async updateProgress(userId, bookId, progress) {
    // Check if progress record exists
    const { data: existingData, error: selectError } = await supabase
      .from('reading_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking existing progress:', selectError);
      throw selectError;
    }

    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('reading_progress')
        .update({ progress: progress, last_accessed: new Date() })
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .select()
        .single();

      if (error) {
        console.error('Error updating progress:', error);
        throw error;
      }

      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('reading_progress')
        .insert([
          {
            user_id: userId,
            book_id: bookId,
            progress: progress
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating progress record:', error);
        throw error;
      }

      return data;
    }
  }
}

module.exports = ReadingProgress;