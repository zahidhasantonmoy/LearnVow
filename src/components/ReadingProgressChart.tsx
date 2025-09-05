// Reading progress chart component
'use client';

import { useEffect, useState } from 'react';
import { FiBook } from 'react-icons/fi';

interface ReadingProgressChartProps {
  stats: any[];
  timeRange: 'week' | 'month' | 'all';
}

export default function ReadingProgressChart({ 
  stats, 
  timeRange 
}: ReadingProgressChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Process data based on time range
    const processedData = processData(stats, timeRange);
    setChartData(processedData);
  }, [stats, timeRange]);

  const processData = (data: any[], range: string) => {
    // For simplicity, we'll create mock data
    // In a real implementation, this would process actual reading stats
    
    if (range === 'week') {
      return [
        { day: 'Mon', time: 45, pages: 25 },
        { day: 'Tue', time: 30, pages: 18 },
        { day: 'Wed', time: 60, pages: 35 },
        { day: 'Thu', time: 40, pages: 22 },
        { day: 'Fri', time: 50, pages: 28 },
        { day: 'Sat', time: 90, pages: 45 },
        { day: 'Sun', time: 75, pages: 40 }
      ];
    }
    
    if (range === 'month') {
      return [
        { week: 'Week 1', time: 250, pages: 120 },
        { week: 'Week 2', time: 320, pages: 160 },
        { week: 'Week 3', time: 280, pages: 140 },
        { week: 'Week 4', time: 350, pages: 180 }
      ];
    }
    
    // All time data
    return [
      { month: 'Jan', time: 1200, pages: 600 },
      { month: 'Feb', time: 1100, pages: 550 },
      { month: 'Mar', time: 1300, pages: 650 },
      { month: 'Apr', time: 1400, pages: 700 },
      { month: 'May', time: 1500, pages: 750 },
      { month: 'Jun', time: 1600, pages: 800 }
    ];
  };

  // Format time for display
  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Reading Time</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg">
              Time
            </button>
            <button className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600">
              Pages
            </button>
          </div>
        </div>
        
        {/* Chart visualization */}
        <div className="h-64 flex items-end space-x-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-indigo-600 rounded-t hover:bg-indigo-500 transition-colors"
                style={{ 
                  height: `${Math.min(100, (item.time / 200) * 100)}%` 
                }}
              ></div>
              <div className="text-xs text-gray-400 mt-2 text-center">
                {item.day || item.week || item.month}
              </div>
              <div className="text-xs text-gray-300 mt-1">
                {formatTime(item.time)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <FiBook className="text-indigo-500 mr-2" />
            <h4 className="font-bold">Most Read Book</h4>
          </div>
          <p className="text-lg font-bold">The Art of War</p>
          <p className="text-sm text-gray-400">12 hours read</p>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <FiBook className="text-indigo-500 mr-2" />
            <h4 className="font-bold">Favorite Genre</h4>
          </div>
          <p className="text-lg font-bold">Fiction</p>
          <p className="text-sm text-gray-400">42% of reading time</p>
        </div>
      </div>
    </div>
  );
}