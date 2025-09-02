// Audiobook player component
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiVolume2, 
  FiHeart,
  FiHeadphones,
  FiMaximize,
  FiMinimize
} from 'react-icons/fi';
import Button from '@/components/ui/Button';

interface AudiobookPlayerProps {
  bookId: number;
  title: string;
  author: string;
  coverUrl?: string;
  fileUrl: string;
  duration: number; // in seconds
}

export default function AudiobookPlayer({ 
  bookId, 
  title, 
  author, 
  coverUrl, 
  fileUrl,
  duration
}: AudiobookPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Simulate loading the audiobook
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading audiobook...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-gray-900 to-indigo-900 text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="container mx-auto px-4 py-6 h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-4"
        >
          <h1 className="text-2xl font-bold truncate max-w-md">{title}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FiHeart />
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <FiMinimize /> : <FiMaximize />}
            </Button>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col md:flex-row gap-6">
          {/* Player visualization */}
          <motion.div 
            className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 flex flex-col items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative w-64 h-64 mb-8">
              {coverUrl ? (
                <img 
                  src={coverUrl} 
                  alt={title} 
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 rounded-xl flex items-center justify-center">
                  <FiHeadphones className="text-6xl text-gray-500" />
                </div>
              )}
              <div className="absolute inset-0 rounded-xl border-4 border-indigo-500/30"></div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-400 mb-8">by {author}</p>
            
            {/* Progress bar */}
            <div className="w-full max-w-md mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Player controls */}
            <div className="flex items-center justify-center gap-6">
              <Button variant="outline" size="lg" className="rounded-full p-3">
                <FiSkipBack className="text-xl" />
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="rounded-full p-4 w-16 h-16"
                onClick={togglePlay}
              >
                {isPlaying ? <FiPause className="text-xl" /> : <FiPlay className="text-xl ml-1" />}
              </Button>
              <Button variant="outline" size="lg" className="rounded-full p-3">
                <FiSkipForward className="text-xl" />
              </Button>
            </div>
          </motion.div>

          {/* Book info sidebar */}
          <motion.div 
            className="w-full md:w-80 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 h-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-bold text-lg mb-4">Now Playing</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Progress</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-400 mt-1">
                  {Math.round((currentTime / duration) * 100)}%
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-2">Volume</p>
                <div className="flex items-center gap-3">
                  <FiVolume2 className="text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <h4 className="font-medium mb-2">Book Details</h4>
                <p className="text-sm text-gray-400">Duration: {formatTime(duration)}</p>
                <p className="text-sm text-gray-400">Author: {author}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}