// Recommendation card component
'use client';

import { useState } from 'react';
import { FiBook, FiStar, FiUser, FiTrendingUp, FiHeart, FiShoppingCart } from 'react-icons/fi';
import Button from '@/components/ui/Button';

interface RecommendationCardProps {
  book: {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    cover_url: string;
    content_type: 'ebook' | 'audiobook';
    author: {
      name: string;
    };
    category: {
      name: string;
    };
    price: number;
    rating: number;
    review_count: number;
    pages: number;
    similarity_score: number;
  };
  onBookViewed: () => void;
}

export default function RecommendationCard({ book, onBookViewed }: RecommendationCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleViewBook = () => {
    onBookViewed();
    // Navigate to book detail page
    window.location.href = `/books/${book.id}`;
  };

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1">
      {/* Book cover */}
      <div className="relative">
        {book.cover_url ? (
          <img 
            src={book.cover_url} 
            alt={book.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="bg-gray-700 w-full h-48 flex items-center justify-center">
            <FiBook className="text-4xl text-gray-500" />
          </div>
        )}
        
        {/* Content type badge */}
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
          {book.content_type === 'ebook' ? 'Ebook' : 'Audiobook'}
        </div>
        
        {/* Similarity score for personalized recommendations */}
        {book.similarity_score > 0 && (
          <div className="absolute bottom-2 left-2 bg-indigo-600/90 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
            <FiUser className="mr-1" />
            {book.similarity_score}%
          </div>
        )}
      </div>

      {/* Book info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
        {book.subtitle && (
          <p className="text-gray-400 text-sm mb-2 line-clamp-1">{book.subtitle}</p>
        )}
        <p className="text-indigo-400 text-sm mb-3">by {book.author.name}</p>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            <FiStar className="text-yellow-400 mr-1" />
            <span className="font-medium">{book.rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-500 text-sm">({book.review_count})</span>
        </div>
        
        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {book.description}
        </p>
        
        {/* Book details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="bg-gray-700/50 rounded-lg p-2">
            <p className="text-gray-400">Category</p>
            <p className="font-medium">{book.category.name}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-2">
            <p className="text-gray-400">Pages</p>
            <p className="font-medium">{book.pages}</p>
          </div>
        </div>
        
        {/* Price and actions */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-indigo-400">${book.price.toFixed(2)}</span>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FiHeart className={isLiked ? "text-red-500 fill-current" : ""} />
            </Button>
            
            <Button 
              size="sm"
              onClick={handleViewBook}
            >
              <FiBook className="mr-2" />
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}