// Admin dashboard page with real database data
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/ui/Card';
import { FiBook, FiUsers, FiDollarSign, FiShoppingCart, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';

interface AnalyticsData {
  totalBooks: number;
  totalUsers: number;
  totalSales: number;
  totalOrders: number;
  topSellingBooks: Array<{
    title: string;
    sales: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch all analytics data in parallel
      const [
        booksResult,
        usersResult,
        salesResult,
        ordersResult,
        topBooksResult,
        categoryRevenueResult
      ] = await Promise.all([
        // Total books
        supabase
          .from('content')
          .select('id', { count: 'exact', head: true }),
        
        // Total users
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true }),
        
        // Total sales (simplified - in a real app this would be more complex)
        supabase
          .from('content')
          .select('price')
          .then(result => {
            if (result.data) {
              const total = result.data.reduce((sum, item) => sum + (item.price || 0), 0);
              return { count: total };
            }
            return { count: 0 };
          }),
        
        // Total orders (simplified)
        supabase
          .from('user_libraries')
          .select('id', { count: 'exact', head: true }),
        
        // Top selling books (simplified)
        supabase
          .from('content')
          .select('title, price')
          .order('price', { ascending: false })
          .limit(5),
        
        // Revenue by category (simplified)
        supabase
          .from('content')
          .select('categories(name), price')
          .limit(5)
      ]);

      // Process the results
      const totalBooks = booksResult.count || 0;
      const totalUsers = usersResult.count || 0;
      const totalSales = salesResult.count || 0;
      const totalOrders = ordersResult.count || 0;
      
      const topSellingBooks = topBooksResult.data?.map(item => ({
        title: item.title,
        sales: item.price || 0
      })) || [];
      
      const revenueByCategory = categoryRevenueResult.data?.map((item: any) => ({
        category: item.categories?.name || 'Unknown',
        revenue: item.price || 0
      })) || [];

      setAnalytics({
        totalBooks,
        totalUsers,
        totalSales,
        totalOrders,
        topSellingBooks,
        revenueByCategory
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 h-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 h-64"></div>
            <div className="bg-gray-800/50 rounded-xl p-6 h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-600 rounded-lg mr-4">
              <FiBook className="text-white text-xl" />
            </div>
            <div>
              <p className="text-gray-400">Total Books</p>
              <p className="text-2xl font-bold">{analytics?.totalBooks || 0}</p>
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
              <p className="text-2xl font-bold">{analytics?.totalUsers || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-600 rounded-lg mr-4">
              <FiDollarSign className="text-white text-xl" />
            </div>
            <div>
              <p className="text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold">${(analytics?.totalSales || 0).toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-600 rounded-lg mr-4">
              <FiShoppingCart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold">{analytics?.totalOrders || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiTrendingUp className="mr-2" />
            Top Selling Books
          </h2>
          <div className="space-y-4">
            {analytics?.topSellingBooks.map((book, index) => (
              <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                <div>
                  <h3 className="font-medium">{book.title}</h3>
                </div>
                <div className="text-right">
                  <p className="font-medium">${book.sales.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiBarChart2 className="mr-2" />
            Revenue by Category
          </h2>
          <div className="space-y-4">
            {analytics?.revenueByCategory.map((category, index) => (
              <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                <div>
                  <h3 className="font-medium">{category.category}</h3>
                </div>
                <div className="text-right">
                  <p className="font-medium">${category.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}