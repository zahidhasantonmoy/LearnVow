// Simplified Admin layout with authentication
'use client';

import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import { FiLoader } from 'react-icons/fi';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAdmin();
  const router = useRouter();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show a simple login button instead of redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-gray-400 mb-6">Please log in to access the admin panel</p>
          <button 
            onClick={() => router.push('/admin/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If we get here, user is authenticated
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}