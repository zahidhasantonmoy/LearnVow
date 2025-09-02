// Admin dashboard component
'use client';

import { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiBook, FiUsers, FiShoppingCart, FiDollarSign, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

interface Content {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cover_url: string;
  content_type: 'ebook' | 'audiobook';
  file_urls: any;
  sample_url: string;
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
}

export default function AdminDashboard() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [analytics, setAnalytics] = useState<any>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);

  useEffect(() => {
    loadContent();
    loadAnalytics();
  }, [currentPage]);

  const loadContent = async () => {
    try {
      const { data, count } = await AdminService.getContent(currentPage, 10);
      setContent(data);
      setTotalCount(count);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const [salesData, userData] = await Promise.all([
        AdminService.getSalesAnalytics(),
        AdminService.getUserAnalytics()
      ]);
      
      setAnalytics(salesData);
      setUserAnalytics(userData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const totalPages = Math.ceil(totalCount / 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-800 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="secondary">
            <FiPlus className="mr-2" />
            Add New Content
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-600 rounded-lg mr-4">
                <FiBook className="text-white text-xl" />
              </div>
              <div>
                <p className="text-gray-400">Total Books</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-600 rounded-lg mr-4">
                <FiUsers className="text-white text-xl" />
              </div>
              <div>
                <p className="text-gray-400">Total Users</p>
                <p className="text-2xl font-bold">{userAnalytics?.totalUsers || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-600 rounded-lg mr-4">
                <FiShoppingCart className="text-white text-xl" />
              </div>
              <div>
                <p className="text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold">{analytics?.totalOrders || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-600 rounded-lg mr-4">
                <FiDollarSign className="text-white text-xl" />
              </div>
              <div>
                <p className="text-gray-400">Revenue</p>
                <p className="text-2xl font-bold">
                  ${analytics?.totalSales ? analytics.totalSales.toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Top Selling Books</h2>
            <div className="space-y-4">
              {analytics?.topSellingBooks?.map((book: any, index: number) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{book.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{book.sales} sales</p>
                  </div>
                </div>
              )) || <p className="text-gray-400">No data available</p>}
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Revenue by Category</h2>
            <div className="space-y-4">
              {analytics?.revenueByCategory?.map((category: any, index: number) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{category.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${category.revenue.toFixed(2)}</p>
                  </div>
                </div>
              )) || <p className="text-gray-400">No data available</p>}
            </div>
          </Card>
        </div>
        
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Content Management</h2>
            <Button variant="outline" size="sm">
              <FiPlus className="mr-1" />
              Add Content
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3">Title</th>
                  <th className="text-left py-3">Type</th>
                  <th className="text-left py-3">Price</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Created</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800">
                    <td className="py-3">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-gray-400 text-xs">{item.subtitle}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                        {item.content_type}
                      </span>
                    </td>
                    <td className="py-3">${item.price.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.is_active 
                          ? 'bg-green-900/50 text-green-400' 
                          : 'bg-red-900/50 text-red-400'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FiEdit className="text-xs" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FiTrash2 className="text-xs" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
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
        </Card>
      </div>
    </div>
  );
}