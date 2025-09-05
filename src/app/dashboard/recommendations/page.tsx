// Recommendations page
'use client';

import { useState, useEffect } from 'react';
import { useRecommendations } from '@/contexts/RecommendationsContext';
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';
import { FiTrendingUp, FiUser, FiRefreshCw, FiLoader, FiBook } from 'react-icons/fi';
import RecommendationCard from '@/components/RecommendationCard';
import Button from '@/components/ui/Button';

export default function RecommendationsPage() {
  const { 
    recommendations, 
    trendingBooks, 
    personalizedRecommendations, 
    loading, 
    refreshRecommendations 
  } = useRecommendations();
  
  const { settings } = useReadingSettings();
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'personalized'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      await refreshRecommendations();
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getDisplayedBooks = () => {
    switch (activeTab) {
      case 'trending':
        return trendingBooks;
      case 'personalized':
        return personalizedRecommendations;
      default:
        return recommendations;
    }
  };

  const displayedBooks = getDisplayedBooks();

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FiLoader className="animate-spin text-4xl text-indigo-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading recommendations...</p>
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <FiUser className="mr-3 text-indigo-500" />
                Recommended For You
              </h1>
              <p className="text-gray-400">
                Discover your next great read
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Refreshing...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'all'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              All Recommendations
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 font-medium flex items-center ${
                activeTab === 'trending'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <FiTrendingUp className="mr-2" />
              Trending
            </button>
            <button
              onClick={() => setActiveTab('personalized')}
              className={`px-4 py-2 font-medium flex items-center ${
                activeTab === 'personalized'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <FiUser className="mr-2" />
              Personalized
            </button>
          </div>
        </div>

        {displayedBooks.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
            <FiBook className="text-5xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Recommendations</h2>
            <p className="text-gray-400 mb-6">
              We couldn't find any recommendations for you right now.
              Try reading some books to help us understand your preferences.
            </p>
            <a 
              href="/books" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Browse Books
            </a>
          </div>
        ) : (
          <div 
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
            }}
          >
            {displayedBooks.map((book) => (
              <RecommendationCard 
                key={book.id} 
                book={book} 
                onBookViewed={() => {}} // In a real implementation, we would track when a user views a recommendation
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}