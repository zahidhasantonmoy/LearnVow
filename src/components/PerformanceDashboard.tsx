// Performance dashboard component
'use client';

import { useState, useEffect } from 'react';
import performanceMonitor from '@/services/performance';
import Card from '@/components/ui/Card';

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  useEffect(() => {
    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics([...performanceMonitor.getMetrics()]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getMetricStats = () => {
    const loadTimes = metrics.filter(m => m.name === 'page_load_time');
    const resourceLoads = metrics.filter(m => m.name.startsWith('resource_load_'));
    
    return {
      totalMetrics: metrics.length,
      avgLoadTime: loadTimes.length > 0 
        ? (loadTimes.reduce((sum, m) => sum + m.value, 0) / loadTimes.length).toFixed(2)
        : '0',
      resourceCount: resourceLoads.length,
      slowestResource: resourceLoads.length > 0
        ? resourceLoads.reduce((slowest, current) => 
            current.value > slowest.value ? current : slowest
          ).name.split('_').pop()
        : 'None'
    };
  };

  const stats = getMetricStats();

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Performance Dashboard</h3>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-lg text-sm ${
              activeTab === 'overview' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-sm ${
              activeTab === 'details' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
        </div>
      </div>
      
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-indigo-400">{stats.totalMetrics}</p>
            <p className="text-gray-400 text-sm">Metrics Collected</p>
          </Card>
          
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-indigo-400">
              {stats.avgLoadTime}ms
            </p>
            <p className="text-gray-400 text-sm">Avg Load Time</p>
          </Card>
          
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-indigo-400">{stats.resourceCount}</p>
            <p className="text-gray-400 text-sm">Resources</p>
          </Card>
          
          <Card className="p-4 text-center">
            <p className="text-sm text-gray-400 truncate">{stats.slowestResource}</p>
            <p className="text-gray-400 text-sm">Slowest Resource</p>
          </Card>
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Metric</th>
                <th className="text-left py-2">Value</th>
                <th className="text-left py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {metrics.slice(-10).map((metric, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td className="py-2">{metric.name}</td>
                  <td className="py-2">
                    {metric.duration 
                      ? `${metric.duration.toFixed(2)}ms` 
                      : metric.value}
                  </td>
                  <td className="py-2 text-gray-400">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={() => performanceMonitor.clearMetrics()}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
        >
          Clear Metrics
        </button>
        <button
          onClick={() => {
            console.log('Performance Metrics:', performanceMonitor.getMetrics());
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
        >
          Log to Console
        </button>
      </div>
    </Card>
  );
}