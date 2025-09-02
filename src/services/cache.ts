// Caching service for performance optimizations with fixed iteration
'use client';

interface CacheItem {
  data: any;
  expiry: number;
}

class CacheService {
  private cache: Map<string, CacheItem> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  // Get item from cache
  get(key: string): any {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  // Set item in cache
  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }
  
  // Remove item from cache
  remove(key: string): void {
    this.cache.delete(key);
  }
  
  // Clear expired items
  clearExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    // Collect keys to delete
    this.cache.forEach((item, key) => {
      if (now > item.expiry) {
        keysToDelete.push(key);
      }
    });
    
    // Delete collected keys
    keysToDelete.forEach(key => {
      this.cache.delete(key);
    });
  }
  
  // Clear all items
  clearAll(): void {
    this.cache.clear();
  }
  
  // Get cache size
  size(): number {
    return this.cache.size;
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Periodically clean up expired items
setInterval(() => {
  cacheService.clearExpired();
}, 60 * 1000); // Every minute

export default cacheService;