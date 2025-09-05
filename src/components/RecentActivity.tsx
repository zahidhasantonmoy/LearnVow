// Recent activity component
'use client';

import { FiBook, FiClock } from 'react-icons/fi';

interface RecentActivityProps {
  stats: any[];
}

export default function RecentActivity({ stats }: RecentActivityProps) {
  // Get recent stats (last 5)
  const recentStats = stats.slice(0, 5);

  if (recentStats.length === 0) {
    return (
      <div className="text-center py-8">
        <FiBook className="text-4xl text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No reading activity yet</p>
        <p className="text-gray-500 text-sm mt-2">
          Start reading to see your activity here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentStats.map((stat) => (
        <div 
          key={stat.id} 
          className="flex items-center p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <div className="bg-gray-600 rounded-lg w-12 h-12 flex items-center justify-center mr-3 flex-shrink-0">
            {stat.content_cover_url ? (
              <img 
                src={stat.content_cover_url} 
                alt={stat.content_title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <FiBook className="text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{stat.content_title}</h4>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <FiClock className="mr-1" size={14} />
              <span>
                {Math.floor(stat.time_spent / 60)} min • {stat.pages_read} pages
              </span>
            </div>
          </div>
          
          <div className="text-right text-sm text-gray-400">
            <p>
              {new Date(stat.last_read).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      ))}
      
      {stats.length > 5 && (
        <div className="text-center pt-2">
          <a 
            href="/dashboard/stats" 
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            View all activity
          </a>
        </div>
      )}
    </div>
  );
}