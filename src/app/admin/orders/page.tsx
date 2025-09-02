// Orders management page
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FiShoppingCart, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';

interface Order {
  id: number;
  user_id: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  user_email: string;
  user_username: string;
  items: Array<{
    id: number;
    order_id: number;
    content_id: number;
    quantity: number;
    price: number;
    content_title: string;
  }>;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(`
          id,
          user_id,
          status,
          total_amount,
          currency,
          created_at,
          updated_at,
          profiles (username, email),
          order_items (
            id,
            order_id,
            content_id,
            quantity,
            price,
            content (title)
          )
        `)
        .order('created_at', { ascending: false });

      // Add search filter if term exists
      if (searchTerm) {
        query = query.or(`profiles.username.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%`);
      }

      // Add status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Add pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      // Transform data to match our interface
      const transformedData = data?.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        status: item.status,
        total_amount: item.total_amount,
        currency: item.currency,
        created_at: item.created_at,
        updated_at: item.updated_at,
        user_email: item.profiles?.email || '',
        user_username: item.profiles?.username || '',
        items: item.order_items?.map((oi: any) => ({
          id: oi.id,
          order_id: oi.order_id,
          content_id: oi.content_id,
          quantity: oi.quantity,
          price: oi.price,
          content_title: oi.content?.title || ''
        })) || []
      })) || [];

      setOrders(transformedData);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: 'bg-yellow-900/50 text-yellow-400',
      paid: 'bg-green-900/50 text-green-400',
      shipped: 'bg-blue-900/50 text-blue-400',
      delivered: 'bg-indigo-900/50 text-indigo-400',
      cancelled: 'bg-red-900/50 text-red-400'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[status] || 'bg-gray-700 text-gray-300'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="bg-gray-800/50 rounded-lg p-4 h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-gray-400">Manage all customer orders</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-40"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <Button variant="outline" onClick={fetchOrders}>
            <FiRefreshCw className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <FiShoppingCart className="text-4xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No orders found</h3>
          <p className="text-gray-400">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'No orders have been placed yet'}
          </p>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Order</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Items</th>
                    <th className="text-left py-3 px-4 font-medium">Total</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-800 last:border-0">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">#{order.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">
                            {order.user_username || 'Anonymous'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {order.user_email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          {order.items.map((item, index) => (
                            <p key={item.id} className="text-sm">
                              {item.content_title}{index < (order.items.length - 1) ? ',' : ''}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">
                          ${order.total_amount.toFixed(2)} {order.currency}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-400 text-sm">
                          {formatDate(order.created_at)}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
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