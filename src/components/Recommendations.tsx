// Recommendations component for displaying AI-powered book suggestions with fixed icons
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RecommendationService } from '@/services/recommendations';
import BookCard from '@/components/BookCard';
import Card from '@/components/ui/Card';
import { FiRefreshCw, FiStar, FiTrendingUp, FiHeart } from 'react-icons/fi';

interface Book {
  id: number;
  title: string;
  author: string;
  cover_url: string;
  content_type: 'ebook' | 'audiobook';
  price: number;
  recommendation_score?: number;
  source?: string;
}

export default function Recommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [trending, setTrending] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Load personalized recommendations
      const [personalized, trendingBooks] = await Promise.all([
        RecommendationService.getRecommendations(user.id, 8),
        RecommendationService.getTrendingBooks(8)
      ]);
      
      setRecommendations(personalized);
      setTrending(trendingBooks);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    if (!user) return;
    
    setRefreshing(true);
    
    try {
      const newRecommendations = await RecommendationService.getRecommendations(user.id, 8);
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'content': return <FiHeart className="text-red-500" />;
      case 'collaborative': return <FiStar className="text-blue-500" />;
      case 'trending': return <FiTrendingUp className="text-yellow-500" />;
      default: return <FiStar className="text-indigo-500" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'content': return 'Based on your interests';
      case 'collaborative': return 'Similar readers also enjoyed';
      case 'trending': return 'Trending now';
      default: return 'Recommended for you';
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        <button
          onClick={refreshRecommendations}
          disabled={refreshing}
          className="flex items-center text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
        >
          <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {recommendations.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map((book) => (
              <div key={book.id} className="relative">
                <BookCard
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.cover_url}
                  contentType={book.content_type}
                  price={book.price}
                />
                {book.source && (
                  <div className="absolute top-2 left-2 bg-black/70 rounded-full p-1 flex items-center">
                    {getSourceIcon(book.source)}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              {recommendations[0]?.source && getSourceLabel(recommendations[0].source)}
            </p>
          </div>
        </div>
      ) : (
        <Card className="text-center py-12">
          <FiStar className="text-4xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No recommendations yet</h3>
          <p className="text-gray-400 mb-6">
            Start reading books to get personalized recommendations
          </p>
        </Card>
      )}
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Trending Books</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trending.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              coverUrl={book.cover_url}
              contentType={book.content_type}
              price={book.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}