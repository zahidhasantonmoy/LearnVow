// Publishers management page
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FiPlus, FiEdit, FiTrash2, FiUsers, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

interface Publisher {
  id: number;
  name: string;
  logo_url: string;
  website: string;
  created_at: string;
}

export default function PublishersManagement() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchPublishers();
  }, [currentPage, searchTerm]);

  const fetchPublishers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('publishers')
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

      setPublishers(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching publishers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePublisher = async (id: number) => {
    if (!confirm('Are you sure you want to delete this publisher? This will not delete books published by this publisher.')) return;

    try {
      const { error } = await supabase
        .from('publishers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh publishers list
      fetchPublishers();
    } catch (error) {
      console.error('Error deleting publisher:', error);
      alert('Error deleting publisher');
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 h-24"></div>
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
          <h1 className="text-2xl font-bold">Publishers Management</h1>
          <p className="text-gray-400">Manage all publishing houses</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search publishers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          <Link href="/admin/publishers/create">
            <Button>
              <FiPlus className="mr-2" />
              Add New Publisher
            </Button>
          </Link>
        </div>
      </div>

      {publishers.length === 0 ? (
        <Card className="text-center py-12">
          <FiUsers className="text-4xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No publishers found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? 'Try a different search term' : 'Get started by adding your first publisher'}
          </p>
          <Link href="/admin/publishers/create">
            <Button>
              <FiPlus className="mr-2" />
              Add Publisher
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishers.map((publisher) => (
              <Card key={publisher.id} className="p-4">
                <div className="flex items-start">
                  <div className="bg-gray-700 rounded-lg w-16 h-16 flex-shrink-0 flex items-center justify-center mr-4">
                    {publisher.logo_url ? (
                      <img 
                        src={publisher.logo_url} 
                        alt={publisher.name} 
                        className="rounded-lg w-16 h-16 object-cover"
                      />
                    ) : (
                      <FiUsers className="text-gray-400 text-2xl" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{publisher.name}</h3>
                    
                    {publisher.website && (
                      <a 
                        href={publisher.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-sm block mt-1 truncate"
                      >
                        {publisher.website}
                      </a>
                    )}
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-gray-500 text-xs">
                        Added {new Date(publisher.created_at).toLocaleDateString()}
                      </span>
                      
                      <div className="flex space-x-1">
                        <Link href={`/admin/publishers/${publisher.id}/edit`}>
                          <Button variant="outline" size="sm" className="p-1">
                            <FiEdit />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deletePublisher(publisher.id)}
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