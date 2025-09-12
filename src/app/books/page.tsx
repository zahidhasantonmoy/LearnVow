// Enhanced Books catalog page with improved mobile responsiveness and better error handling
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import BookCard from '@/components/BookCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCart } from '@/contexts/CartContext';

interface Book {
  id: number;
  title: string;
  author: string;
  cover_url?: string;
  content_type: 'ebook' | 'audiobook';
  price: number;
  created_at: string;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentType, setContentType] = useState<'all' | 'ebook' | 'audiobook'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [searchTerm, contentType, books, sortBy]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch content with joined author data
      const { data, error } = await supabase
        .from('content')
        .select(`
          id,
          title,
          subtitle,
          description,
          cover_url,
          content_type,
          file_urls,
          sample_url,
          author_id,
          publisher_id,
          category_id,
          isbn,
          pages,
          duration,
          language,
          tags,
          price,
          is_active,
          created_at,
          updated_at,
          authors(name)
        `)
        .eq('is_active', true);
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Raw data from Supabase:', data);
      
      // Map the data to include author name directly
      const booksWithAuthors = data.map(book => ({
        ...book,
        author: book.authors && book.authors.length > 0 ? book.authors[0].name : 'Unknown Author'
      }));
      
      console.log('Processed books:', booksWithAuthors);
      
      setBooks(booksWithAuthors);
    } catch (error: any) {
      console.error('Error fetching books:', error);
      setError(error.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    console.log('Filtering books:', books);
    let result = [...books];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by content type
    if (contentType !== 'all') {
      result = result.filter(book => book.content_type === contentType);
    }
    
    // Sort books
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // Sort by creation date (newest first)
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    
    console.log('Filtered books:', result);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Books</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button onClick={fetchBooks} className="touch-target">
            Try Again
          </Button>
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
              <h1 className="text-3xl font-bold">Book Catalog</h1>
              <p className="text-gray-400">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                placeholder="Search books or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={contentType === 'all' ? 'secondary' : 'outline'}
                onClick={() => setContentType('all')}
                className="touch-target"
              >
                All
              </Button>
              <Button 
                variant={contentType === 'ebook' ? 'secondary' : 'outline'}
                onClick={() => setContentType('ebook')}
                className="touch-target"
              >
                Ebooks
              </Button>
              <Button 
                variant={contentType === 'audiobook' ? 'secondary' : 'outline'}
                onClick={() => setContentType('audiobook')}
                className="touch-target"
              >
                Audiobooks
              </Button>
            </div>
          </div>
          
          {filteredBooks.length > 0 ? (
            <div className="grid-responsive">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.cover_url}
                  contentType={book.content_type}
                  price={book.price}
                  onAddToCart={() => addToCart({
                    id: book.id,
                    title: book.title,
                    price: book.price,
                    contentType: book.content_type,
                    cover_url: book.cover_url
                  })}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">No books found</h2>
              <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
              <Button 
                onClick={() => { 
                  setSearchTerm(''); 
                  setContentType('all');
                  setSortBy('newest');
                }}
                className="touch-target"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}