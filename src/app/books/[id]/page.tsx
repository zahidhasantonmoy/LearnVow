// Book detail page with PDF viewer
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import ReadingContent from '@/components/ReadingContent';
import TextCustomizationControls from '@/components/TextCustomizationControls';
import Button from '@/components/ui/Button';
import { FiDownload, FiHeart, FiShare2, FiStar, FiBook, FiFile } from 'react-icons/fi';

interface Book {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cover_url: string;
  content_type: 'ebook' | 'audiobook';
  file_urls: { full: string; sample: string };
  sample_url: string;
  author: {
    name: string;
    bio: string;
  };
  category: {
    name: string;
  };
  publisher: {
    name: string;
  };
  price: number;
  pages: number;
  rating: number;
  review_count: number;
}

export default function BookDetail({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLibrary, setUserLibrary] = useState<any[]>([]);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showFullPdf, setShowFullPdf] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  console.log('BookDetail component loaded with params:', params);

  useEffect(() => {
    fetchBook();
    if (user) {
      fetchUserLibrary();
    }
  }, [params.id, user]);

  const fetchBook = async () => {
    try {
      console.log('Fetching book with ID:', params.id);
      const bookId = parseInt(params.id);
      console.log('Parsed book ID:', bookId);
      
      if (isNaN(bookId)) {
        console.error('Invalid book ID:', params.id);
        setLoading(false);
        return;
      }
      
      // First, let's check if the book exists at all with a simple query
      console.log('Checking if book exists with simple query...');
      const { data: simpleData, error: simpleError } = await supabase
        .from('content')
        .select('id, title')
        .eq('id', bookId);
      
      console.log('Simple query result:', { simpleData, simpleError });
      
      if (simpleError) {
        console.error('Simple query error:', simpleError);
      } else {
        console.log('Simple query found', simpleData?.length, 'books');
        if (simpleData && simpleData.length > 0) {
          console.log('Book exists:', simpleData[0]);
        }
      }
      
      // Now try the full query with joins
      console.log('Running full query with joins...');
      const { data, error } = await supabase
        .from('content')
        .select(`
          *,
          authors(name, bio),
          categories(name),
          publishers(name)
        `)
        .eq('id', bookId)
        .single();

      console.log('Full query response:', { data, error });
      
      if (error) {
        console.error('Full query error:', error);
        setLoading(false);
        return;
      }
      
      // Check if book exists
      if (!data) {
        console.log('No book found with full query for ID:', bookId);
        setLoading(false);
        return;
      }

      // Format the book data
      const formattedBook = {
        ...data,
        author: data.authors,
        category: data.categories,
        publisher: data.publishers,
        file_urls: data.file_urls ? JSON.parse(data.file_urls) : null
      };

      console.log('Formatted book:', formattedBook);
      
      setBook(formattedBook);
      
      // Set PDF URL based on user status
      if (user) {
        // For logged in users, show sample by default
        setPdfUrl(formattedBook.sample_url || formattedBook.file_urls?.sample);
      } else {
        // For non-logged in users, show sample (first 15 pages)
        setPdfUrl(formattedBook.sample_url || formattedBook.file_urls?.sample);
      }
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      console.log('Finished fetching book, loading:', false);
      setLoading(false);
    }
  };

  const fetchUserLibrary = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_libraries')
        .select('content_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const libraryContentIds = data.map(item => item.content_id);
      setUserLibrary(libraryContentIds);
      setIsInLibrary(libraryContentIds.includes(parseInt(params.id)));
    } catch (error) {
      console.error('Error fetching user library:', error);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Add to cart logic would go here
    // For now, we'll just simulate adding to library
    try {
      const { error } = await supabase
        .from('user_libraries')
        .insert({
          user_id: user.id,
          content_id: parseInt(params.id)
        });
      
      if (error) throw error;
      
      setIsInLibrary(true);
      
      // Show full PDF after purchase
      if (book?.file_urls?.full) {
        setPdfUrl(book.file_urls.full);
        setShowFullPdf(true);
      }
    } catch (error) {
      console.error('Error purchasing book:', error);
    }
  };

  const toggleLibrary = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (isInLibrary) {
        // Remove from library
        const { error } = await supabase
          .from('user_libraries')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', parseInt(params.id));
        
        if (error) throw error;
        setIsInLibrary(false);
      } else {
        // Add to library
        const { error } = await supabase
          .from('user_libraries')
          .insert({
            user_id: user.id,
            content_id: parseInt(params.id)
          });
        
        if (error) throw error;
        setIsInLibrary(true);
      }
    } catch (error) {
      console.error('Error updating library:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Book not found</h1>
          <p className="text-gray-400 mb-6">The book you're looking for doesn't exist or is no longer available.</p>
          <Button onClick={() => router.push('/books')}>Browse Books</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      <TextCustomizationControls />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 sticky top-24">
              <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                {book.cover_url ? (
                  <img 
                    src={book.cover_url} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiBook className="text-6xl text-gray-500" />
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{book.title}</h1>
                  {book.subtitle && <p className="text-gray-400">{book.subtitle}</p>}
                  <p className="text-indigo-400 mt-2">by {book.author?.name || 'Unknown Author'}</p>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span>{book.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <span>{book.review_count || 0} reviews</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${book.price.toFixed(2)}</span>
                  <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                    {book.content_type === 'ebook' ? 'Ebook' : 'Audiobook'}
                  </span>
                </div>
                
                {user ? (
                  isInLibrary ? (
                    <Button 
                      onClick={toggleLibrary}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      In Library
                    </Button>
                  ) : (
                    <Button 
                      onClick={handlePurchase}
                      className="w-full"
                    >
                      Add to Library - ${book.price.toFixed(2)}
                    </Button>
                  )
                ) : (
                  <Button 
                    onClick={() => router.push('/login')}
                    className="w-full"
                  >
                    Login to Purchase
                  </Button>
                )}
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <FiHeart className="mr-2" />
                    Wishlist
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FiShare2 className="mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Book Content and PDF Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <ReadingContent className="text-gray-300 mb-6">
                {book.description}
              </ReadingContent>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Category</p>
                  <p className="font-medium">{book.category?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Publisher</p>
                  <p className="font-medium">{book.publisher?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Pages</p>
                  <p className="font-medium">{book.pages || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Language</p>
                  <p className="font-medium">English</p>
                </div>
              </div>
              
              {book.author?.bio && (
                <div>
                  <h3 className="text-lg font-bold mb-2">About the Author</h3>
                  <ReadingContent className="text-gray-300">
                    {book.author.bio}
                  </ReadingContent>
                </div>
              )}
            </div>
            
            {/* PDF Viewer */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Preview</h2>
                {user && isInLibrary && !showFullPdf && (
                  <Button 
                    onClick={() => {
                      if (book.file_urls?.full) {
                        setPdfUrl(book.file_urls.full);
                        setShowFullPdf(true);
                      }
                    }}
                    size="sm"
                  >
                    Read Full Book
                  </Button>
                )}
              </div>
              
              {!user && (
                <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 mb-4">
                  <p className="text-yellow-200">
                    <strong>Note:</strong> Non-logged in users can only view the first 15 pages of this book. 
                    Please <a href="/login" className="text-yellow-300 underline">login</a> or{' '}
                    <a href="/signup" className="text-yellow-300 underline">sign up</a> to purchase full access.
                  </p>
                </div>
              )}
              
              {pdfUrl ? (
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <iframe
                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    className="w-full h-[600px]"
                    title={`${book.title} preview`}
                  />
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <FiFile className="text-4xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No preview available</p>
                  </div>
                </div>
              )}
              
              {user && isInLibrary && (
                <div className="mt-4 flex justify-between items-center">
                  <Button variant="outline">
                    <FiDownload className="mr-2" />
                    Download PDF
                  </Button>
                  <p className="text-sm text-gray-400">
                    Full access to {book.pages} pages
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}