// Reviews management page
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FiMessageSquare, FiSearch, FiStar, FiFilter, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

interface Review {
  id: number;
  user_id: string;
  content_id: number;
  rating: number;
  title: string;
  review: string;
  created_at: string;
  updated_at: string;
  user_email: string;
  user_username: string;
  content_title: string;
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchReviews();
  }, [currentPage, searchTerm, ratingFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          content_id,
          rating,
          title,
          review,
          created_at,
          updated_at,
          profiles (username, email),
          content (title)
        `)
        .order('created_at', { ascending: false });

      // Add search filter if term exists
      if (searchTerm) {
        query = query.or(`profiles.username.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%,content.title.ilike.%${searchTerm}%`);
      }

      // Add rating filter
      if (ratingFilter !== 'all') {
        query = query.eq('rating', parseInt(ratingFilter));
      }

      // Add pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      // Transform data to match our interface
      const transformedData = data?.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        content_id: item.content_id,
        rating: item.rating,
        title: item.title,
        review: item.review,
        created_at: item.created_at,
        updated_at: item.updated_at,
        user_email: item.profiles?.email || '',
        user_username: item.profiles?.username || '',
        content_title: item.content?.title || ''
      })) || [];

      setReviews(transformedData);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh reviews list
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-600'
            }
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="bg-gray-800/50 rounded-lg p-4 h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reviews Management</h1>
          <p className="text-gray-400">Manage all user reviews</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-40"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          
          <Button variant="outline" onClick={fetchReviews}>
            <FiRefreshCw className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {reviews.length === 0 ? (
        <Card className="text-center py-12">
          <FiMessageSquare className="text-4xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No reviews found</h3>
          <p className="text-gray-400">
            {searchTerm || ratingFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'No reviews have been submitted yet'}
          </p>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Book</th>
                    <th className="text-left py-3 px-4 font-medium">Review</th>
                    <th className="text-left py-3 px-4 font-medium">Rating</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="border-b border-gray-800 last:border-0">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">
                            {review.user_username || 'Anonymous'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {review.user_email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">
                            {review.content_title}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          {review.title && (
                            <p className="font-medium mb-1">{review.title}</p>
                          )}
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {review.review}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {renderStars(review.rating)}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-400 text-sm">
                          {formatDate(review.created_at)}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteReview(review.id)}
                          >
                            <FiTrash2 />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}