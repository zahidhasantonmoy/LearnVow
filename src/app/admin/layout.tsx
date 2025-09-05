// Simplified Admin layout with authentication
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import { FiLoader } from 'react-icons/fi';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      console.log('Checking admin auth in layout...');
      // Check for existing admin session
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);
      
      const sessionId = cookies.admin_session;
      console.log('Session ID from cookie in layout:', sessionId);
      
      if (sessionId) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [pathname]);

  // Redirect to login if not authenticated and not on login page
  useEffect(() => {
    if (!loading && !isAuthenticated && !pathname.includes('/admin/login')) {
      console.log('Redirecting to login from layout');
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, pathname, router]);

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

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !pathname.includes('/admin/login')) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If we get here, user is authenticated or on login page
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