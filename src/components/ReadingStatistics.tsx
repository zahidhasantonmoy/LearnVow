// Reading statistics component
'use client';

import { useState, useEffect } from 'react';
import { ReadingExperienceService } from '@/services/readingExperience';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';

interface ReadingStatistics {
  id: number;
  user_id: string;
  content_id: number;
  time_spent: number;
  pages_read: number;
  last_read: string;
  created_at: string;
  updated_at: string;
}

export default function ReadingStatistics({ contentId }: { contentId: number }) {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<ReadingStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user, contentId]);

  const loadStatistics = async () => {
    if (!user) return;
    
    try {
      const data = await ReadingExperienceService.getReadingStatistics(user.id, contentId);
      setStatistics(data);
    } catch (error) {
      console.error('Error loading reading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="py-4">
        <div className="animate-pulse space-y-3">
          <div className="bg-gray-800/50 rounded-lg p-4 h-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-bold mb-3">Reading Statistics</h3>
      
      {statistics ? (
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-indigo-400">
              {formatTime(statistics.time_spent)}
            </p>
            <p className="text-gray-400 text-sm">Time Spent</p>
          </Card>
          
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-indigo-400">
              {statistics.pages_read}
            </p>
            <p className="text-gray-400 text-sm">Pages Read</p>
          </Card>
          
          <Card className="p-3 text-center col-span-2">
            <p className="text-gray-400 text-sm">Last Read</p>
            <p className="font-medium">
              {formatDate(statistics.last_read)}
            </p>
          </Card>
        </div>
      ) : (
        <Card className="p-4 text-center">
          <p className="text-gray-500">No reading statistics yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Statistics will appear as you read
          </p>
        </Card>
      )}
    </div>
  );
}