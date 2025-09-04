// About page
'use client';

import { FiBook, FiUsers, FiTarget, FiAward } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          About LearnVow
        </h1>
        <p className="text-xl text-gray-300 text-center mb-12">
          Revolutionizing the way you read and learn with our modern platform
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FiBook className="mr-3 text-indigo-400" />
              Our Mission
            </h2>
            <p className="text-gray-300">
              At LearnVow, we believe that knowledge should be accessible to everyone, anywhere, anytime. 
              Our mission is to provide a seamless platform where readers can discover, access, and enjoy 
              a vast collection of ebooks and audiobooks in a modern, intuitive interface.
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FiTarget className="mr-3 text-indigo-400" />
              Our Vision
            </h2>
            <p className="text-gray-300">
              We envision a world where learning is effortless and enjoyable. By combining cutting-edge 
              technology with a user-centric approach, we aim to create the most engaging and accessible 
              reading experience possible.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
            <FiUsers className="mr-3 text-indigo-400" />
            Our Story
          </h2>
          <div className="space-y-4 text-gray-300">
            <p>
              LearnVow was founded in 2023 by a group of passionate readers and technologists who saw 
              the need for a better reading experience in the digital age. We noticed that existing 
              platforms were either too cluttered, too limited, or didn't offer the flexibility that 
              modern readers demand.
            </p>
            <p>
              Starting with a small team and a big vision, we set out to create a platform that would 
              combine the best of both worlds: the convenience of digital reading with the immersive 
              experience of traditional books.
            </p>
            <p>
              Today, LearnVow serves thousands of readers worldwide, offering a carefully curated 
              collection of books across all genres, from timeless classics to contemporary bestsellers.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
            <FiAward className="text-4xl text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Quality Content</h3>
            <p className="text-gray-400">
              Curated collection of high-quality ebooks and audiobooks
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
            <FiBook className="text-4xl text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Modern Interface</h3>
            <p className="text-gray-400">
              Clean, intuitive design that enhances your reading experience
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
            <FiUsers className="text-4xl text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Community Focused</h3>
            <p className="text-gray-400">
              Connect with other readers and share your literary journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}