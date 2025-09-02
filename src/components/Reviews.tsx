// Reviews component for displaying and submitting book reviews with fixed data structure
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiStar, FiUser } from 'react-icons/fi';
import Link from 'next/link';

interface Review {
  id: number;
  user_id: string;
  content_id: number;
  rating: number;
  title: string;
  review: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
  } | null;
}

interface ReviewFormProps {
  contentId: number;
  onReviewSubmitted: () => void;
}

function ReviewForm({ contentId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          content_id: contentId,
          rating,
          title,
          review
        });
      
      if (error) throw error;
      
      // Reset form
      setRating(0);
      setTitle('');
      setReview('');
      onReviewSubmitted();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400 mb-4">Please sign in to leave a review</p>
        <Link href="/login" passHref>
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Rating
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-2xl focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <FiStar 
                  className={
                    star <= (hoverRating || rating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-600'
                  }
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Give your review a title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Share your thoughts about this book..."
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Card>
  );
}

interface ReviewsListProps {
  contentId: number;
}

function ReviewsList({ contentId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [contentId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          content_id,
          rating,
          title,
          review,
          created_at,
          profiles (username, avatar_url)
        `)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fix the data structure to match our interface
      const fixedData = data?.map((item: any) => ({
        ...item,
        profiles: item.profiles ? item.profiles[0] : null
      })) || [];
      
      setReviews(fixedData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4">
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400">No reviews yet. Be the first to review this book!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">
        Reviews ({reviews.length})
      </h3>
      
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex items-start mb-3">
            <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              {review.profiles?.avatar_url ? (
                <img 
                  src={review.profiles.avatar_url} 
                  alt={review.profiles.username || 'User'} 
                  className="rounded-full w-10 h-10"
                />
              ) : (
                <FiUser className="text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-bold">
                  {review.profiles?.username || 'Anonymous'}
                </h4>
                <span className="text-gray-500 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={
                      star <= review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-600'
                    }
                  />
                ))}
              </div>
              
              {review.title && (
                <h5 className="font-semibold mb-1">{review.title}</h5>
              )}
              
              <p className="text-gray-300">{review.review}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function Reviews({ contentId }: { contentId: number }) {
  const [key, setKey] = useState(0);
  
  const handleReviewSubmitted = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="mt-8">
      <ReviewForm contentId={contentId} onReviewSubmitted={handleReviewSubmitted} />
      <ReviewsList key={key} contentId={contentId} />
    </div>
  );
}