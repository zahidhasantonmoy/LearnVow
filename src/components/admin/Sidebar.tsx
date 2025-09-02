// Admin sidebar component
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiBook, 
  FiUser, 
  FiTag, 
  FiUsers, 
  FiDollarSign, 
  FiSettings, 
  FiBarChart2, 
  FiGift, 
  FiMessageSquare 
} from 'react-icons/fi';

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Content', href: '/admin/content', icon: FiBook },
    { name: 'Authors', href: '/admin/authors', icon: FiUser },
    { name: 'Categories', href: '/admin/categories', icon: FiTag },
    { name: 'Publishers', href: '/admin/publishers', icon: FiUsers },
    { name: 'Orders', href: '/admin/orders', icon: FiDollarSign },
    { name: 'Reviews', href: '/admin/reviews', icon: FiMessageSquare },
    { name: 'Gift Cards', href: '/admin/gift-cards', icon: FiGift },
    { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart2 },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-gray-800 border-r border-gray-700 z-40">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
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
        </div>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="text-center text-gray-500 text-sm">
          <p>LearnVow Admin v1.0</p>
          <p className="mt-1">© {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}