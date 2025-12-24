/* Cache management and invalidation */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

const cache = new Map<string, CacheEntry<any>>()

export class CacheManager {
  static set<T>(key: string, data: T, ttlSeconds = 300) {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    })
  }

  static get<T>(key: string): T | null {
    const entry = cache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      cache.delete(key)
      return null
    }

    return entry.data as T
  }

  static invalidate(pattern: string) {
    for (const [key] of cache) {
      if (key.includes(pattern)) cache.delete(key)
    }
  }

  static clear() {
    cache.clear()
  }

  static getStats() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys()),
    }
  }
}
