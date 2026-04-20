// Simple localStorage wrapper for caching that doesn't use modern ESM
const CACHE_PREFIX = 'blueocean_cache_';

export const cacheData = (key: string, data: any, ttlHours: number = 1) => {
  if (typeof window === 'undefined') return;
  
  const cacheEntry = {
    timestamp: Date.now(),
    expiry: Date.now() + (ttlHours * 60 * 60 * 1000),
    data: data
  };
  
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheEntry));
  } catch (e) {
    console.error('Cache write failed:', e);
  }
};

export const getCachedData = (key: string) => {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    
    const entry = JSON.parse(raw);
    if (Date.now() > entry.expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    
    return entry.data;
  } catch (e) {
    return null;
  }
};
