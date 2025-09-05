// Statistic card component
'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  className?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  change,
  className = ''
}: StatCardProps) {
  return (
    <div className={`bg-gray-800/50 rounded-xl p-6 border border-gray-700 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className="text-sm text-green-500 mt-1">{change}</p>
          )}
        </div>
        <div className="p-3 bg-gray-700 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}