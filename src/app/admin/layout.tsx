// Admin dashboard layout
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiBook, FiUsers, FiShoppingCart, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: FiBarChart2 },
  { name: 'Content', href: '/admin/content', icon: FiBook },
  { name: 'Users', href: '/admin/users', icon: FiUsers },
  { name: 'Orders', href: '/admin/orders', icon: FiShoppingCart },
  { name: 'Settings', href: '/admin/settings', icon: FiSettings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700 z-30">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            LearnVow Admin
          </h1>
        </div>
        
        <nav className="mt-6 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={handleSignOut}
          >
            <FiLogOut className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="ml-64 flex flex-col">
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}