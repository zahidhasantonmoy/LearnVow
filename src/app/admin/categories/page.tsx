// Categories management page
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FiPlus, FiEdit, FiTrash2, FiTag, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  created_at: string;
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('categories')
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

      setCategories(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? This will not delete books in this category.')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh categories list
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
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
          <h1 className="text-2xl font-bold">Categories Management</h1>
          <p className="text-gray-400">Manage all book categories</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          <Link href="/admin/categories/create">
            <Button>
              <FiPlus className="mr-2" />
              Add New Category
            </Button>
          </Link>
        </div>
      </div>

      {categories.length === 0 ? (
        <Card className="text-center py-12">
          <FiTag className="text-4xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No categories found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? 'Try a different search term' : 'Get started by adding your first category'}
          </p>
          <Link href="/admin/categories/create">
            <Button>
              <FiPlus className="mr-2" />
              Add Category
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="p-4">
                <div className="flex items-start">
                  <div className="bg-gray-700 rounded-lg w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4">
                    {category.icon_url ? (
                      <img 
                        src={category.icon_url} 
                        alt={category.name} 
                        className="rounded-lg w-12 h-12 object-cover"
                      />
                    ) : (
                      <FiTag className="text-gray-400 text-xl" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{category.name}</h3>
                    <p className="text-gray-400 text-sm truncate mt-1">
                      {category.slug}
                    </p>
                    
                    {category.description && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-gray-500 text-xs">
                        Added {new Date(category.created_at).toLocaleDateString()}
                      </span>
                      
                      <div className="flex space-x-1">
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <Button variant="outline" size="sm" className="p-1">
                            <FiEdit />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteCategory(category.id)}
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