// Gift cards management page
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FiGift, FiSearch, FiFilter, FiRefreshCw, FiPlus, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

interface GiftCard {
  id: number;
  code: string;
  balance: number;
  initial_balance: number;
  recipient_email: string;
  sender_name: string;
  message: string;
  expires_at: string;
  is_redeemed: boolean;
  redeemed_by: string;
  redeemed_at: string;
  created_at: string;
}

export default function GiftCardsManagement() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchGiftCards();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchGiftCards = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('gift_cards')
        .select('*')
        .order('created_at', { ascending: false });

      // Add search filter if term exists
      if (searchTerm) {
        query = query.or(`code.ilike.%${searchTerm}%,recipient_email.ilike.%${searchTerm}%`);
      }

      // Add status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'active') {
          query = query.eq('is_redeemed', false).gt('expires_at', new Date().toISOString());
        } else if (statusFilter === 'redeemed') {
          query = query.eq('is_redeemed', true);
        } else if (statusFilter === 'expired') {
          query = query.eq('is_redeemed', false).lt('expires_at', new Date().toISOString());
        }
      }

      // Add pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      setGiftCards(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching gift cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGiftCard = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gift card? This cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('gift_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh gift cards list
      fetchGiftCards();
    } catch (error) {
      console.error('Error deleting gift card:', error);
      alert('Error deleting gift card');
    }
  };

  const getStatusBadge = (giftCard: GiftCard) => {
    if (giftCard.is_redeemed) {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-green-900/50 text-green-400">
          Redeemed
        </span>
      );
    }
    
    if (new Date(giftCard.expires_at) < new Date()) {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-red-900/50 text-red-400">
          Expired
        </span>
      );
    }
    
    return (
      <span className="px-2 py-1 rounded-full text-xs bg-blue-900/50 text-blue-400">
        Active
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
          <h1 className="text-2xl font-bold">Gift Cards Management</h1>
          <p className="text-gray-400">Manage all gift cards and vouchers</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search gift cards..."
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
              <option value="active">Active</option>
              <option value="redeemed">Redeemed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          
          <Button variant="outline" onClick={fetchGiftCards}>
            <FiRefreshCw className="mr-2" />
            Refresh
          </Button>
          
          <Link href="/admin/gift-cards/create">
            <Button>
              <FiPlus className="mr-2" />
              Create Gift Card
            </Button>
          </Link>
        </div>
      </div>

      {giftCards.length === 0 ? (
        <Card className="text-center py-12">
          <FiGift className="text-4xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No gift cards found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by creating your first gift card'}
          </p>
          <Link href="/admin/gift-cards/create">
            <Button>
              <FiPlus className="mr-2" />
              Create Gift Card
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Code</th>
                    <th className="text-left py-3 px-4 font-medium">Balance</th>
                    <th className="text-left py-3 px-4 font-medium">Recipient</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Expires</th>
                    <th className="text-left py-3 px-4 font-medium">Created</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {giftCards.map((giftCard) => (
                    <tr key={giftCard.id} className="border-b border-gray-800 last:border-0">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium font-mono">{giftCard.code}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">
                            ${giftCard.balance.toFixed(2)} / ${giftCard.initial_balance.toFixed(2)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          {giftCard.recipient_email && (
                            <p className="font-medium">{giftCard.recipient_email}</p>
                          )}
                          {giftCard.sender_name && (
                            <p className="text-gray-400 text-sm">From: {giftCard.sender_name}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(giftCard)}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-400 text-sm">
                          {formatDate(giftCard.expires_at)}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-400 text-sm">
                          {formatDate(giftCard.created_at)}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteGiftCard(giftCard.id)}
                          >
                            <FiTrash2 />
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