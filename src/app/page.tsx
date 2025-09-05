// Enhanced homepage with improved mobile responsiveness
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiBook, FiHeadphones, FiShoppingCart, FiUser, FiStar, FiDownload, FiTrendingUp } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import DeveloperInfo from '@/components/DeveloperInfo';
import { useRecommendations } from '@/contexts/RecommendationsContext';
import Recommendations from '@/components/Recommendations';

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

  const stats = [
    { number: "10K+", label: "Books Available" },
    { number: "50K+", label: "Active Readers" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            LearnVow
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            The Future of Reading is Here. Discover, Read, and Listen to Your Favorite Books Anywhere.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Link href="/books" className="w-full sm:w-auto">
              <Button className="w-full px-8 py-4 text-lg">
                Explore Library
              </Button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full px-8 py-4 text-lg">
                Start Reading
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            >
              <p className="text-3xl font-bold text-indigo-400 mb-2">{stat.number}</p>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LearnVow?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300 text-center card-hover"
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
          </div>
        </motion.div>

        {/* Recommendations Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold flex items-center">
              <FiTrendingUp className="mr-3 text-indigo-500" />
              Recommended For You
            </h2>
            <Link 
              href="/dashboard/recommendations" 
              className="text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              View All
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          
          <Recommendations />
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: <FiBook className="text-4xl" />, step: "01", title: "Browse", description: "Explore our vast library of ebooks and audiobooks" },
              { icon: <FiDownload className="text-4xl" />, step: "02", title: "Purchase", description: "Buy your favorite books with one click" },
              { icon: <FiStar className="text-4xl" />, step: "03", title: "Enjoy", description: "Read or listen anytime, anywhere" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-600 rounded-full blur-xl opacity-30"></div>
                  <div className="relative bg-gray-800 border-2 border-indigo-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                    {item.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Developer Info Section */}
      <DeveloperInfo />
    </main>
  );
}