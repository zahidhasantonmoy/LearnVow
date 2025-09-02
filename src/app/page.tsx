// Enhanced homepage with developer info section
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiBook, FiHeadphones, FiShoppingCart, FiUser } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import DeveloperInfo from '@/components/DeveloperInfo';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const features = [
    {
      icon: <FiBook className="text-3xl" />,
      title: "Ebooks",
      description: "Access thousands of ebooks across all genres in multiple formats"
    },
    {
      icon: <FiHeadphones className="text-3xl" />,
      title: "Audiobooks",
      description: "Listen to your favorite books anytime, anywhere with our audiobook library"
    },
    {
      icon: <FiShoppingCart className="text-3xl" />,
      title: "Easy Shopping",
      description: "Seamless purchasing experience with secure payment processing"
    },
    {
      icon: <FiUser className="text-3xl" />,
      title: "Personal Library",
      description: "Your personal collection synced across all your devices"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            LearnVow
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            The Future of Reading is Here
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/books">
              <Button className="px-8 py-3">
                Explore Library
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="px-8 py-3">
                Start Reading
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300 text-center"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-indigo-400 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Developer Info Section */}
      <DeveloperInfo />
    </main>
  );
}