// —— CacheServiceProtocol.ts ——
// Abstraction for in-memory caching to ensure read-heavy search results return under 2.0 seconds

export interface CacheServiceProtocol {
  // Retrieves cached data to safely bypass heavy main database queries [1]
  get(key: string): any;

  // Stores search query results in the cache with a Time-To-Live (TTL) limit [1]
  set(key: string, value: any, ttl: number): void;

  // Removes a specific cached item when its underlying database record changes [1]
  invalidate(key: string): void;

  // Clears multiple related cached items matching a prefix to maintain data freshness [1]
  invalidatePattern(prefix: string): void;
}
