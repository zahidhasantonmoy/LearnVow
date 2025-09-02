// BookCard component for displaying book information
'use client';

import { motion } from 'framer-motion';
import { FiBook, FiHeadphones } from 'react-icons/fi';
import Button from '@/components/ui/Button';

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  coverUrl?: string;
  contentType: 'ebook' | 'audiobook';
  price: number;
  onAddToCart?: () => void;
}

export default function BookCard({
  id,
  title,
  author,
  coverUrl,
  contentType,
  price,
  onAddToCart
}: BookCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-300"
    >
      <div className="relative">
        {coverUrl ? (
          <img 
            src={coverUrl} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="bg-gray-700 w-full h-48 flex items-center justify-center">
            <div className="text-4xl text-gray-500">
              {contentType === 'ebook' ? <FiBook /> : <FiHeadphones />}
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
          {contentType === 'ebook' ? 'Ebook' : 'Audiobook'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{title}</h3>
        <p className="text-gray-400 text-sm mb-3">by {author}</p>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-indigo-400">${price.toFixed(2)}</span>
          <Button size="sm" onClick={onAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}