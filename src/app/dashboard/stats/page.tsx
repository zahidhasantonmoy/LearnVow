// Reading statistics dashboard page
'use client';

import { useState, useEffect } from 'react';
import { useReadingStats } from '@/contexts/ReadingStatsContext';
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';
import { FiBook, FiClock, FiTarget, FiTrendingUp, FiCalendar, FiLoader } from 'react-icons/fi';
import StatCard from '@/components/StatCard';
import ReadingProgressChart from '@/components/ReadingProgressChart';
import RecentActivity from '@/components/RecentActivity';

export default function ReadingStatsDashboard() {
  const { stats, summary, loading } = useReadingStats();
  const { settings } = useReadingSettings();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  // Format time for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FiLoader className="animate-spin text-4xl text-indigo-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading reading statistics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <FiTrendingUp className="mr-3 text-indigo-500" />
            Reading Statistics
          </h1>
          <p className="text-gray-400">
            Track your reading progress and achievements
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex rounded-lg bg-gray-800 p-1">
            {(['week', 'month', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Reading Time"
            value={formatTime(summary.total_time_spent)}
            icon={<FiClock className="text-indigo-500" />}
            change="+12% from last month"
          />
          
          <StatCard
            title="Pages Read"
            value={formatNumber(summary.total_pages_read)}
            icon={<FiBook className="text-indigo-500" />}
            change="+8% from last month"
          />
          
          <StatCard
            title="Books Completed"
            value={summary.books_read.toString()}
            icon={<FiTarget className="text-indigo-500" />}
            change="+3 books this month"
          />
          
          <StatCard
            title="Current Streak"
            value={`${summary.current_streak} days`}
            icon={<FiCalendar className="text-indigo-500" />}
            change={`${summary.longest_streak} day longest streak`}
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reading Progress Chart */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <FiTrendingUp className="mr-2" />
                  Reading Progress
                </h2>
              </div>
              <ReadingProgressChart stats={stats} timeRange={timeRange} />
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 h-full">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <FiClock className="mr-2" />
                Recent Activity
              </h2>
              <RecentActivity stats={stats} />
            </div>
          </div>
        </div>

        {/* Reading Goals */}
        <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <FiTarget className="mr-2" />
            Reading Goals
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-bold mb-2">Daily Goal</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">30 min</span>
                <span className="text-sm text-gray-400">of 60 min</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: '50%' }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">50% completed today</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-bold mb-2">Weekly Goal</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">5 books</span>
                <span className="text-sm text-gray-400">of 10 books</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: '50%' }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">50% completed this week</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-bold mb-2">Monthly Goal</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">20 hrs</span>
                <span className="text-sm text-gray-400">of 30 hrs</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: '66%' }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">66% completed this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}