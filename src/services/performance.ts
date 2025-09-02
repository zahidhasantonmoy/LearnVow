// Performance monitoring service
'use client';

class PerformanceMonitor {
  private metrics: any[] = [];
  private startTime: number = 0;

  // Start measuring performance
  startMeasurement(name: string): void {
    this.startTime = performance.now();
  }
  
  // End measuring performance and record metric
  endMeasurement(name: string): void {
    if (this.startTime === 0) return;
    
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    
    this.metrics.push({
      name,
      duration,
      timestamp: new Date().toISOString()
    });
    
    // Reset start time
    this.startTime = 0;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }
  }
  
  // Record a custom metric
  recordMetric(name: string, value: number): void {
    this.metrics.push({
      name,
      value,
      timestamp: new Date().toISOString()
    });
  }
  
  // Get all metrics
  getMetrics(): any[] {
    return this.metrics;
  }
  
  // Clear metrics
  clearMetrics(): void {
    this.metrics = [];
  }
  
  // Get average duration for a metric
  getAverageDuration(name: string): number {
    const metrics = this.metrics.filter(m => m.name === name && m.duration !== undefined);
    if (metrics.length === 0) return 0;
    
    const total = metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / metrics.length;
  }
  
  // Monitor page load performance
  monitorPageLoad(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as any;
          if (perfData) {
            this.recordMetric('page_load_time', perfData.loadEventEnd - perfData.loadEventStart);
            this.recordMetric('dom_content_loaded', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
            this.recordMetric('first_paint', perfData.responseStart - perfData.fetchStart);
          }
        }, 0);
      });
    }
  }
  
  // Monitor network requests
  monitorNetwork(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.entryType === 'resource') {
            this.recordMetric(`resource_load_${entry.name}`, entry.duration);
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Start monitoring automatically
if (typeof window !== 'undefined') {
  performanceMonitor.monitorPageLoad();
  performanceMonitor.monitorNetwork();
}

export default performanceMonitor;