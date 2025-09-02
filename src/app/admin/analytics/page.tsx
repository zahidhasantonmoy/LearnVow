// Analytics page
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiBarChart2, FiTrendingUp, FiUsers, FiDollarSign, FiBook, FiDownload, FiRefreshCw } from 'react-icons/fi';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalBooks: number;
  totalSales: number;
  totalOrders: number;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
  }>;
  topSellingBooks: Array<{
    title: string;
    sales: number;
  }>;
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
  salesOverTime: Array<{
    date: string;
    amount: number;
  }>;
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would be a complex query
      // For now, we'll simulate the data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockData: AnalyticsData = {
        totalUsers: 12450,
        activeUsers: 8760,
        totalBooks: 5680,
        totalSales: 42560.75,
        totalOrders: 3856,
        revenueByCategory: [
          { category: 'Fiction', revenue: 12450.50 },
          { category: 'Non-Fiction', revenue: 9870.25 },
          { category: 'Science Fiction', revenue: 8760.00 },
          { category: 'Mystery', revenue: 6540.75 },
          { category: 'Romance', revenue: 4939.25 }
        ],
        topSellingBooks: [
          { title: 'The Great Gatsby', sales: 1245 },
          { title: 'To Kill a Mockingbird', sales: 987 },
          { title: '1984', sales: 876 },
          { title: 'Pride and Prejudice', sales: 654 },
          { title: 'The Catcher in the Rye', sales: 543 }
        ],
        userGrowth: [
          { date: '2023-01-01', count: 1000 },
          { date: '2023-02-01', count: 1500 },
          { date: '2023-03-01', count: 2200 },
          { date: '2023-04-01', count: 3100 },
          { date: '2023-05-01', count: 4200 },
          { date: '2023-06-01', count: 5600 },
          { date: '2023-07-01', count: 7200 },
          { date: '2023-08-01', count: 8700 },
          { date: '2023-09-01', count: 10200 },
          { date: '2023-10-01', count: 12450 }
        ],
        salesOverTime: [
          { date: '2023-01-01', amount: 2450.50 },
          { date: '2023-02-01', amount: 3120.25 },
          { date: '2023-03-01', amount: 3870.00 },
          { date: '2023-04-01', amount: 4540.75 },
          { date: '2023-05-01', amount: 5230.25 },
          { date: '2023-06-01', amount: 5870.50 },
          { date: '2023-07-01', amount: 6420.75 },
          { date: '2023-08-01', amount: 7150.00 },
          { date: '2023-09-01', amount: 7890.25 },
          { date: '2023-10-01', amount: 8760.50 }
        ]
      };
      
      setAnalytics(mockData);
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
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 h-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 h-80"></div>
            <div className="bg-gray-800/50 rounded-xl p-6 h-80"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 h-80"></div>
            <div className="bg-gray-800/50 rounded-xl p-6 h-80"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your platform performance</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          
          <Button variant="outline" onClick={fetchAnalytics}>
            <FiRefreshCw className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-600 rounded-lg mr-4">
              <FiUsers className="text-white text-xl" />
            </div>
            <div>
              <p className="text-gray-400">Total Users</p>
              <p className="text-2xl font-bold">{analytics?.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-600 rounded-lg mr-4">
              <FiUsers className="text-white text-xl" />
            </div>
            <div>
              <p className="text-gray-400">Active Users</p>
              <p className="text-2xl font-bold">{analytics?.activeUsers.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-600 rounded-lg mr-4">
              <FiBook className="text-white text-xl" />
            </div>
            <div>
              <p className="text-gray-400">Total Books</p>
              <p className="text-2xl font-bold">{analytics?.totalBooks.toLocaleString()}</p>
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
              <p className="text-2xl font-bold">${(analytics?.totalSales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiTrendingUp className="mr-2" />
            Revenue Over Time
          </h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FiBarChart2 className="text-4xl mx-auto mb-2" />
              <p>Chart visualization would appear here</p>
              <p className="text-sm mt-1">(Mock data for demonstration)</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiUsers className="mr-2" />
            User Growth
          </h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FiBarChart2 className="text-4xl mx-auto mb-2" />
              <p>Chart visualization would appear here</p>
              <p className="text-sm mt-1">(Mock data for demonstration)</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiDollarSign className="mr-2" />
            Revenue by Category
          </h2>
          <div className="space-y-4">
            {analytics?.revenueByCategory.map((category, index) => (
              <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                <div>
                  <h3 className="font-medium">{category.category}</h3>
                </div>
                <div className="text-right">
                  <p className="font-medium">${category.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-gray-400 text-sm">
                    {analytics ? ((category.revenue / analytics.totalSales) * 100).toFixed(1) : '0'}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiDownload className="mr-2" />
            Top Selling Books
          </h2>
          <div className="space-y-4">
            {analytics?.topSellingBooks.map((book, index) => (
              <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                <div>
                  <h3 className="font-medium">{book.title}</h3>
                </div>
                <div className="text-right">
                  <p className="font-medium">{book.sales.toLocaleString()} sales</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}