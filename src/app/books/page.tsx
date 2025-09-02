// Books catalog page
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import BookCard from '@/components/BookCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Book {
  id: number;
  title: string;
  author: string;
  cover_url?: string;
  content_type: 'ebook' | 'audiobook';
  price: number;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [contentType, setContentType] = useState<'all' | 'ebook' | 'audiobook'>('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchTerm, contentType, books]);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let result = books;
    
    if (searchTerm) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (contentType !== 'all') {
      result = result.filter(book => book.content_type === contentType);
    }
    
    setFilteredBooks(result);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Book Catalog</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                placeholder="Search books or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={contentType === 'all' ? 'secondary' : 'outline'}
                onClick={() => setContentType('all')}
              >
                All
              </Button>
              <Button 
                variant={contentType === 'ebook' ? 'secondary' : 'outline'}
                onClick={() => setContentType('ebook')}
              >
                Ebooks
              </Button>
              <Button 
                variant={contentType === 'audiobook' ? 'secondary' : 'outline'}
                onClick={() => setContentType('audiobook')}
              >
                Audiobooks
              </Button>
            </div>
          </div>
          
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
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
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">No books found</h2>
              <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={() => { setSearchTerm(''); setContentType('all'); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}