// Admin dashboard page
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiUsers, FiShoppingCart, FiDollarSign } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
  });

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    setStats({
      totalBooks: 142,
      totalUsers: 1284,
      totalOrders: 856,
      revenue: 12450.75,
    });
  }, []);

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: <FiBook className="text-indigo-400" />,
      change: '+12%',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FiUsers className="text-teal-400" />,
      change: '+8%',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <FiShoppingCart className="text-amber-400" />,
      change: '+5%',
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toFixed(2)}`,
      icon: <FiDollarSign className="text-emerald-400" />,
      change: '+15%',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="secondary">Generate Report</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="flex items-center">
                <div className="p-3 bg-gray-700 rounded-lg mr-4">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold mr-2">{stat.value}</p>
                    <span className="text-xs text-green-400">{stat.change}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between pb-4 border-b border-gray-700 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">Order #{1000 + item}</p>
                    <p className="text-gray-400 text-sm">3 items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(Math.random() * 100).toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card>
            <h2 className="text-xl font-bold mb-4">Top Books</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between pb-4 border-b border-gray-700 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="bg-gray-700 rounded-lg w-12 h-12 flex items-center justify-center mr-3">
                      <div className="text-lg">📚</div>
                    </div>
                    <div>
                      <p className="font-medium">Book Title {item}</p>
                      <p className="text-gray-400 text-sm">Author Name</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{Math.floor(Math.random() * 100)} sales</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}