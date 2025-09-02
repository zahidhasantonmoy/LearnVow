// Navbar component for main site
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { FiMenu, FiX, FiBook, FiHeadphones, FiShoppingCart, FiUser, FiLogIn, FiLogOut, FiHome } from 'react-icons/fi';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();

  const navLinks = [
    { name: 'Home', href: '/', icon: <FiHome /> },
    { name: 'Books', href: '/books', icon: <FiBook /> },
    { name: 'Library', href: '/dashboard', icon: <FiHeadphones /> },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 py-3 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <FiBook className="text-indigo-500 text-2xl mr-2" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
              LearnVow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-gray-300 hover:text-white transition-colors flex items-center ${
                  pathname === link.href ? 'text-white bg-gray-800' : ''
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <FiShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
                >
                  <FiUser className="mr-2" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center"
                >
                  <FiLogOut className="mr-1" /> 
                  <span className="hidden lg:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <FiLogIn className="mr-1" /> 
                    <span className="hidden lg:inline">Login</span>
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white mr-2">
              <FiShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="touch-target"
            >
              <FiMenu className="text-xl" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div 
          className="mobile-menu-overlay slide-in"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex justify-between items-center mb-8">
            <Link 
              href="/" 
              className="flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiBook className="text-indigo-500 text-2xl mr-2" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                LearnVow
              </span>
            </Link>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="touch-target"
            >
              <FiX className="text-xl" />
            </Button>
          </div>
          
          <div className="flex-1 flex flex-col space-y-2 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-4 py-3 text-lg rounded-lg transition-colors ${
                  pathname === link.href 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-3 text-xl">{link.icon}</span>
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-700 mt-4 pt-4">
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center px-4 py-3 text-lg text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="mr-3 text-xl" />
                    Dashboard
                  </Link>
                  <button 
                    className="flex items-center px-4 py-3 text-lg text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full text-left"
                    onClick={handleSignOut}
                  >
                    <FiLogOut className="mr-3 text-xl" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="flex items-center px-4 py-3 text-lg text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiLogIn className="mr-3 text-xl" />
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="flex items-center px-4 py-3 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="mr-3 text-xl" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-700 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} LearnVow. All rights reserved.
          </div>
        </div>
      )}
    </nav>
  );
}