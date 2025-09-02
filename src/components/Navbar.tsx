// Responsive navigation component
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { FiMenu, FiX, FiBook, FiHeadphones, FiShoppingCart, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Books', href: '/books' },
    { name: 'Ebooks', href: '/books?filter=ebook' },
    { name: 'Audiobooks', href: '/books?filter=audiobook' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <FiBook className="text-indigo-500 text-2xl mr-2" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
              LearnVow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-gray-300 hover:text-white transition-colors ${
                  pathname === link.href ? 'text-white font-medium' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white">
              <FiShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-300 hover:text-white">
                  <FiUser className="text-xl" />
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <FiLogOut className="mr-1" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    <FiLogIn className="mr-1" /> Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-gray-300 hover:text-white transition-colors ${
                    pathname === link.href ? 'text-white font-medium' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-800 flex flex-col space-y-3">
                <Link 
                  href="/cart" 
                  className="flex items-center text-gray-300 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiShoppingCart className="mr-2" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                
                {user ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="flex items-center text-gray-300 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="mr-2" />
                      Dashboard
                    </Link>
                    <button 
                      className="flex items-center text-gray-300 hover:text-white"
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      <FiLogOut className="mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="flex items-center text-gray-300 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiLogIn className="mr-2" />
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      className="flex items-center text-gray-300 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="mr-2" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}