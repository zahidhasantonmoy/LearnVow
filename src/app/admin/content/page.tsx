// Content management page
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FiPlus, FiEdit, FiTrash2, FiBook, FiHeadphones, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

interface Content {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cover_url: string;
  content_type: 'ebook' | 'audiobook';
  author_id: number;
  publisher_id: number;
  category_id: number;
  isbn: string;
  pages: number;
  duration: number;
  language: string;
  tags: string[];
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  author_name: string;
  category_name: string;
  publisher_name: string;
}

export default function ContentManagement() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchContent();
  }, [currentPage, searchTerm]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('content')
        .select(`
          id,
          title,
          subtitle,
          description,
          cover_url,
          content_type,
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
          authors (name),
          categories (name),
          publishers (name)
        `)
        .order('created_at', { ascending: false });

      // Add search filter if term exists
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,subtitle.ilike.%${searchTerm}%`);
      }

      // Add pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      // Transform data to match our interface
      const transformedData = data?.map((item: any) => ({
        ...item,
        author_name: item.authors?.name || '',
        category_name: item.categories?.name || '',
        publisher_name: item.publishers?.name || ''
      })) || [];

      setContent(transformedData);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh content list
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error deleting content');
    }
  };

  const toggleActiveStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('content')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Refresh content list
      fetchContent();
    } catch (error) {
      console.error('Error updating content status:', error);
      alert('Error updating content status');
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 h-48"></div>
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
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-gray-400">Manage all books and audiobooks</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          <Link href="/admin/content/create">
            <Button>
              <FiPlus className="mr-2" />
              Add New Content
            </Button>
          </Link>
        </div>
      </div>

      {content.length === 0 ? (
        <Card className="text-center py-12">
          <FiBook className="text-4xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No content found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? 'Try a different search term' : 'Get started by adding your first book or audiobook'}
          </p>
          <Link href="/admin/content/create">
            <Button>
              <FiPlus className="mr-2" />
              Add Content
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex">
                  <div className="bg-gray-700 rounded-lg w-16 h-20 flex-shrink-0 flex items-center justify-center mr-4">
                    {item.cover_url ? (
                      <img 
                        src={item.cover_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-2xl text-gray-500">
                        {item.content_type === 'ebook' ? <FiBook /> : <FiHeadphones />}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{item.title}</h3>
                    <p className="text-gray-400 text-sm truncate">{item.subtitle}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="px-2 py-1 bg-gray-700 text-xs rounded">
                        {item.content_type}
                      </span>
                      <span className="px-2 py-1 bg-gray-700 text-xs rounded">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.is_active ? (
                        <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-900/50 text-red-400 text-xs rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-xs text-gray-500">
                        {item.author_name}
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleActiveStatus(item.id, item.is_active)}
                          className="p-1"
                        >
                          {item.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Link href={`/admin/content/${item.id}/edit`}>
                          <Button variant="outline" size="sm" className="p-1">
                            <FiEdit />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteContent(item.id)}
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