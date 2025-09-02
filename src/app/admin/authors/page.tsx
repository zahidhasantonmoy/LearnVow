// Authors management page
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FiPlus, FiEdit, FiTrash2, FiUser, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

interface Author {
  id: number;
  name: string;
  bio: string;
  photo_url: string;
  website: string;
  created_at: string;
  updated_at: string;
}

export default function AuthorsManagement() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchAuthors();
  }, [currentPage, searchTerm]);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('authors')
        .select('*')
        .order('name', { ascending: true });

      // Add search filter if term exists
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      // Add pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      setAuthors(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAuthor = async (id: number) => {
    if (!confirm('Are you sure you want to delete this author? This will also remove all books by this author.')) return;

    try {
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh authors list
      fetchAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('Error deleting author');
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Authors Management</h1>
          <p className="text-gray-400">Manage all authors in the system</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          <Link href="/admin/authors/create">
            <Button>
              <FiPlus className="mr-2" />
              Add New Author
            </Button>
          </Link>
        </div>
      </div>

      {authors.length === 0 ? (
        <Card className="text-center py-12">
          <FiUser className="text-4xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No authors found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? 'Try a different search term' : 'Get started by adding your first author'}
          </p>
          <Link href="/admin/authors/create">
            <Button>
              <FiPlus className="mr-2" />
              Add Author
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <Card key={author.id} className="p-4">
                <div className="flex items-start">
                  <div className="bg-gray-700 rounded-full w-16 h-16 flex-shrink-0 flex items-center justify-center mr-4">
                    {author.photo_url ? (
                      <img 
                        src={author.photo_url} 
                        alt={author.name} 
                        className="rounded-full w-16 h-16 object-cover"
                      />
                    ) : (
                      <FiUser className="text-gray-400 text-2xl" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{author.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                      {author.bio}
                    </p>
                    
                    {author.website && (
                      <a 
                        href={author.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-sm block mt-2 truncate"
                      >
                        {author.website}
                      </a>
                    )}
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-gray-500 text-xs">
                        Added {new Date(author.created_at).toLocaleDateString()}
                      </span>
                      
                      <div className="flex space-x-1">
                        <Link href={`/admin/authors/${author.id}/edit`}>
                          <Button variant="outline" size="sm" className="p-1">
                            <FiEdit />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteAuthor(author.id)}
                          className="p-1"
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
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