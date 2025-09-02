// Admin navbar component
'use client';

import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { FiMenu, FiX, FiBell, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and mobile menu button */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <FiMenu 
                className="h-6 w-6 text-gray-400 lg:hidden cursor-pointer"
                onClick={() => setMobileMenuOpen(true)}
              />
              <Link href="/admin" className="ml-4 lg:ml-0 text-xl font-bold">
                LearnVow Admin
              </Link>
            </div>
          </div>

          {/* Right side - Notifications and user menu */}
          <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none mr-4">
              <FiBell className="h-6 w-6" />
            </button>

            <div className="relative">
              <div className="flex items-center">
                <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
                  <FiUser className="text-gray-300" />
                </div>
                <span className="ml-2 text-gray-300 hidden md:inline">
                  {user?.full_name || user?.email}
                </span>
              </div>

              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 border border-gray-700 ring-1 ring-black ring-opacity-5 hidden md:block">
                <Link 
                  href="/admin/profile" 
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <FiUser className="inline mr-2" />
                  Your Profile
                </Link>
                <Link 
                  href="/admin/settings" 
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <FiSettings className="inline mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <FiLogOut className="inline mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-gray-300">
                {user?.full_name || user?.email}
              </span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <FiX className="h-6 w-6 text-gray-400" />
              </button>
            </div>
            <div className="border-t border-gray-700 pt-2">
              <Link 
                href="/admin/profile" 
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUser className="inline mr-2" />
                Your Profile
              </Link>
              <Link 
                href="/admin/settings" 
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiSettings className="inline mr-2" />
                Settings
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
              >
                <FiLogOut className="inline mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}