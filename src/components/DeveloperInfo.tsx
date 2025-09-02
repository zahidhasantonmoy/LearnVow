// Developer info section with modern styling and animations
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiGlobe, FiFacebook } from 'react-icons/fi';
import Card from '@/components/ui/Card';

export default function DeveloperInfo() {
  const [isHovered, setIsHovered] = useState(false);
  
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/zahidhasantonmoy',
      icon: <FiGithub />,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/zahidhasantonmoy/',
      icon: <FiLinkedin />,
    },
    {
      name: 'Portfolio',
      url: 'https://zahidhasantonmoy.vercel.app',
      icon: <FiGlobe />,
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/zahidhasantonmoybd',
      icon: <FiFacebook />,
    },
  ];

  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Developer Information</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          This platform was built with modern web technologies and best practices
        </p>
      </motion.div>
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-600/10 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center">
              <motion.div 
                className="mb-6 md:mb-0 md:mr-8"
                animate={{ 
                  y: isHovered ? -10 : 0,
                  rotate: isHovered ? 5 : 0
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-gradient-to-br from-indigo-500 to-teal-500 rounded-full w-32 h-32 flex items-center justify-center text-4xl">
                  ZH
                </div>
              </motion.div>
              
              <div className="text-center md:text-left flex-1">
                <motion.h3 
                  className="text-2xl font-bold mb-2"
                  animate={{ 
                    color: isHovered ? "#60A5FA" : "#FFFFFF"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Zahid Hasan Tonmoy
                </motion.h3>
                <p className="text-gray-400 mb-4">
                  Full Stack Developer & UI/UX Designer
                </p>
                <p className="mb-6 max-w-2xl">
                  Passionate about creating beautiful, functional web experiences with modern technologies.
                  Specializing in React, Next.js, and cloud platforms like Supabase.
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-2">{link.icon}</span>
                      {link.name}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}