// Recommendations context for suggesting books to users
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useReadingStats } from '@/contexts/ReadingStatsContext';

interface RecommendedBook {
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
  publisher: {
    name: string;
  };
  price: number;
  rating: number;
  review_count: number;
  pages: number;
  similarity_score: number; // 0-100, how similar this book is to user's preferences
}

interface RecommendationsContextType {
  recommendations: RecommendedBook[];
  trendingBooks: RecommendedBook[];
  personalizedRecommendations: RecommendedBook[];
  loading: boolean;
  refreshRecommendations: () => Promise<void>;
  getRecommendationsForCategory: (categoryId: number) => Promise<RecommendedBook[]>;
  markBookAsViewed: (bookId: number) => Promise<void>;
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

export function RecommendationsProvider({ children }: { children: ReactNode }) {
  const [recommendations, setRecommendations] = useState<RecommendedBook[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<RecommendedBook[]>([]);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<RecommendedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { stats } = useReadingStats();

  useEffect(() => {
    fetchRecommendations();
  }, [user, stats]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Fetch trending books (most popular)
      await fetchTrendingBooks();
      
      // Fetch personalized recommendations
      if (user) {
        await fetchPersonalizedRecommendations();
      } else {
        // For non-logged in users, show popular books
        setPersonalizedRecommendations(trendingBooks.slice(0, 6));
      }
      
      // Combine recommendations
      const allRecommendations = [
        ...trendingBooks.slice(0, 3),
        ...(user ? personalizedRecommendations.slice(0, 3) : trendingBooks.slice(3, 6))
      ];
      
      setRecommendations(allRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingBooks = async () => {
    try {
      // In a real implementation, this would fetch books based on:
      // - Most purchased
      // - Highest rated
      // - Most read
      // - Recently added
      
      // For demo, we'll create mock trending books
      const mockTrendingBooks: RecommendedBook[] = [
        {
          id: 1,
          title: "The Art of War",
          subtitle: "Ancient Wisdom for Modern Life",
          description: "A classic treatise on military strategy that remains highly influential in business and politics.",
          cover_url: "",
          content_type: "ebook",
          author: { name: "Sun Tzu" },
          category: { name: "Philosophy" },
          publisher: { name: "Penguin Classics" },
          price: 12.99,
          rating: 4.7,
          review_count: 1240,
          pages: 273,
          similarity_score: 95
        },
        {
          id: 2,
          title: "Atomic Habits",
          subtitle: "Tiny Changes, Remarkable Results",
          description: "An easy & proven way to build good habits & break bad ones.",
          cover_url: "",
          content_type: "ebook",
          author: { name: "James Clear" },
          category: { name: "Self-Help" },
          publisher: { name: "Avery" },
          price: 16.99,
          rating: 4.8,
          review_count: 2100,
          pages: 320,
          similarity_score: 92
        },
        {
          id: 3,
          title: "Deep Work",
          subtitle: "Rules for Focused Success in a Distracted World",
          description: "The ability to perform deep work is becoming increasingly rare and therefore valuable.",
          cover_url: "",
          content_type: "ebook",
          author: { name: "Cal Newport" },
          category: { name: "Productivity" },
          publisher: { name: "Grand Central Publishing" },
          price: 15.99,
          rating: 4.6,
          review_count: 1850,
          pages: 306,
          similarity_score: 90
        },
        {
          id: 4,
          title: "Sapiens",
          subtitle: "A Brief History of Humankind",
          description: "A thrilling account of humankind's extraordinary history from the Stone Age to the silicon age.",
          cover_url: "",
          content_type: "ebook",
          author: { name: "Yuval Noah Harari" },
          category: { name: "History" },
          publisher: { name: "Harper" },
          price: 18.99,
          rating: 4.7,
          review_count: 3200,
          pages: 443,
          similarity_score: 88
        },
        {
          id: 5,
          title: "The Psychology of Money",
          subtitle: "Timeless Lessons on Wealth, Greed, and Happiness",
          description: "Doing well with money isn't necessarily about what you know. It's about how you behave.",
          cover_url: "",
          content_type: "ebook",
          author: { name: "Morgan Housel" },
          category: { name: "Finance" },
          publisher: { name: "Harriman House" },
          price: 14.99,
          rating: 4.8,
          review_count: 2800,
          pages: 256,
          similarity_score: 85
        },
        {
          id: 6,
          title: "Thinking, Fast and Slow",
          subtitle: "The Phenomenal Bestseller from Nobel Prize Winner Daniel Kahneman",
          description: "The guru to the gurus at last shares his knowledge with the rest of us.",
          cover_url: "",
          content_type: "ebook",
          author: { name: "Daniel Kahneman" },
          category: { name: "Psychology" },
          publisher: { name: "Farrar, Straus and Giroux" },
          price: 17.99,
          rating: 4.6,
          review_count: 2100,
          pages: 512,
          similarity_score: 87
        }
      ];
      
      setTrendingBooks(mockTrendingBooks);
    } catch (error) {
      console.error('Error fetching trending books:', error);
    }
  };

  const fetchPersonalizedRecommendations = async () => {
    if (!user) return;
    
    try {
      // In a real implementation, this would analyze:
      // - User's reading history
      // - Preferred categories
      // - Favorite authors
      // - Books similar to those they've enjoyed
      // - Collaborative filtering (users who liked X also liked Y)
      
      // For demo, we'll create mock personalized recommendations
      // based on the user's reading stats
      const favoriteCategories = getFavoriteCategories();
      const favoriteAuthors = getFavoriteAuthors();
      
      const mockPersonalizedBooks: RecommendedBook[] = [
        {
          id: 7,
          title: "Mindset",
          subtitle: "The New Psychology of Success",
          description: "World-renowned Stanford University psychologist Carol Dweck demonstrates how success in school, work, sports, and almost every area of human endeavor can be dramatically influenced by how we think about our talents and abilities.",
          cover_url: "",
          content_type: "ebook",
          author: { name: "Carol S. Dweck" },
          category: { name: "Psychology" },
          publisher: { name: "Ballantine Books" },
          price: 14.99,
          rating: 4.7,
          review_count: 1980,
          pages: 320,
          similarity_score: 94
        },
        {
          id: 8,
          title: "The 7 Habits of Highly Effective People",
          subtitle: "Powerful Lessons in Personal Change",
          description: "One of the most inspiring and impactful books ever written, Stephen Covey's masterpiece combines timeless wisdom with timely concepts to solve our most persistent personal and professional problems.",
          cover_url: "",
          content_type: "ebook",
          author: { name: "Stephen R. Covey" },
          category: { name: "Self-Help" },
          publisher: { name: "Free Press" },
          price: 16.99,
          rating: 4.8,
          review_count: 2800,
          pages: 381,
          similarity_score: 92
        },
        {
          id: 9,
          title: "Meditations",
          subtitle: "A New Translation",
          description: "Nearly two thousand years after he wrote them, Marcus Aurelius's Meditations remain one of the greatest works of spiritual and ethical reflection ever written.",
          cover_url: "",
          content_type: "ebook",
          author: { name: "Marcus Aurelius" },
          category: { name: "Philosophy" },
          publisher: { name: "Modern Library" },
          price: 12.99,
          rating: 4.6,
          review_count: 1500,
          pages: 256,
          similarity_score: 90
        },
        {
          id: 10,
          title: "The Power of Now",
          subtitle: "A Guide to Spiritual Enlightenment",
          description: "Eckhart Tolle's message is simple: Only a radical transformation in consciousness can save our world from the approaching catastrophe.",
          cover_url: "",
          content_type: "ebook",
          author: { name: "Eckhart Tolle" },
          category: { name: "Spirituality" },
          publisher: { name: "New World Library" },
          price: 15.99,
          rating: 4.7,
          review_count: 2200,
          pages: 229,
          similarity_score: 88
        },
        {
          id: 11,
          title: "How to Win Friends and Influence People",
          subtitle: "Updated Edition",
          description: "Millions of people around the world have improved their lives based on the teachings of Dale Carnegie.",
          cover_url: "",
          content_type: "ebook",
          author: { name: "Dale Carnegie" },
          category: { name: "Communication" },
          publisher: { name: "Simon & Schuster" },
          price: 14.99,
          rating: 4.7,
          review_count: 3500,
          pages: 320,
          similarity_score: 85
        },
        {
          id: 12,
          title: "The Subtle Art of Not Giving a F*ck",
          subtitle: "A Counterintuitive Approach to Living a Good Life",
          description: "In this generation-defining self-help guide, a superstar blogger cuts through the crap to show us how to stop trying to be positive all the time so that we can truly become more resilient, grounded, and honest.",
          cover_url: "",
          content_type: "ebook",
          author: { name: "Mark Manson" },
          category: { name: "Self-Help" },
          publisher: { name: "HarperOne" },
          price: 16.99,
          rating: 4.6,
          review_count: 2900,
          pages: 224,
          similarity_score: 87
        }
      ];
      
      setPersonalizedRecommendations(mockPersonalizedBooks);
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
    }
  };

  const getFavoriteCategories = (): string[] => {
    // In a real implementation, this would analyze the user's reading stats
    // to determine their favorite categories
    return ['Self-Help', 'Psychology', 'Philosophy'];
  };

  const getFavoriteAuthors = (): string[] => {
    // In a real implementation, this would analyze the user's reading stats
    // to determine their favorite authors
    return ['James Clear', 'Cal Newport', 'Yuval Noah Harari'];
  };

  const refreshRecommendations = async () => {
    await fetchRecommendations();
  };

  const getRecommendationsForCategory = async (categoryId: number): Promise<RecommendedBook[]> => {
    // In a real implementation, this would fetch recommendations for a specific category
    // For demo, we'll return a subset of trending books
    return trendingBooks.filter(book => 
      book.category.name.toLowerCase().includes('history') || 
      book.category.name.toLowerCase().includes('philosophy')
    ).slice(0, 3);
  };

  const markBookAsViewed = async (bookId: number): Promise<void> => {
    // In a real implementation, this would track when a user views a recommended book
    // to improve future recommendations
    console.log(`Marked book ${bookId} as viewed`);
  };

  const value = {
    recommendations,
    trendingBooks,
    personalizedRecommendations,
    loading,
    refreshRecommendations,
    getRecommendationsForCategory,
    markBookAsViewed
  };

  return (
    <RecommendationsContext.Provider value={value}>
      {children}
    </RecommendationsContext.Provider>
  );
}

export function useRecommendations() {
  const context = useContext(RecommendationsContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
}