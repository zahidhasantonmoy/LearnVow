// Enhanced Dashboard page with recommendations
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import BookCard from '@/components/BookCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Recommendations from '@/components/Recommendations';
import ReadingChallenges from '@/components/ReadingChallenges';

interface Book {
  id: number;
  title: string;
  author: string;
  cover_url?: string;
  content_type: 'ebook' | 'audiobook';
  price: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [library, setLibrary] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'library' | 'recommendations' | 'challenges'>('library');

  useEffect(() => {
    if (user) {
      fetchLibrary();
    }
  }, [user]);

  const fetchLibrary = async () => {
    try {
      const { data, error } = await supabase
        .from('user_libraries')
        .select('content(*)')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      setLibrary(data.map((item: any) => item.content));
    } catch (error) {
      console.error('Error fetching library:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-gray-400">
                Welcome back! Continue your reading journey
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            <Button 
              variant={activeTab === 'library' ? 'secondary' : 'outline'}
              onClick={() => setActiveTab('library')}
              className="touch-target"
            >
              My Library
            </Button>
            <Button 
              variant={activeTab === 'recommendations' ? 'secondary' : 'outline'}
              onClick={() => setActiveTab('recommendations')}
              className="touch-target"
            >
              Recommendations
            </Button>
            <Button 
              variant={activeTab === 'challenges' ? 'secondary' : 'outline'}
              onClick={() => setActiveTab('challenges')}
              className="touch-target"
            >
              Reading Challenges
            </Button>
          </div>
          
          {activeTab === 'library' ? (
            library.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Your Library ({library.length} books)
                </h2>
                <div className="grid-responsive">
                  {library.map((book) => (
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
            ) : (
              <Card className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Your library is empty</h2>
                <p className="text-gray-400 mb-6">Start building your collection by browsing our catalog</p>
                <Button variant="secondary" href="/books" className="touch-target">
                  Browse Books
                </Button>
              </Card>
            )
          ) : activeTab === 'recommendations' ? (
            <Recommendations />
          ) : (
            <ReadingChallenges />
          )}
        </motion.div>
      </div>
    </div>
  );
}