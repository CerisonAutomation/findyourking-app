/* Data fetching with caching and error handling */

interface FetchOptions extends RequestInit {
  cacheTime?: number
  retries?: number
  timeout?: number
}

const cache = new Map<string, { data: any; timestamp: number }>()

export async function fetchWithCache(
  url: string,
  options: FetchOptions = {}
) {
  const { cacheTime = 5 * 60 * 1000, retries = 3, timeout = 10000, ...fetchOpts } = options

  // Check cache
  const cached = cache.get(url)
  if (cached && Date.now() - cached.timestamp < cacheTime) {
    return cached.data
  }

  // Fetch with retries
  let lastError: Error | null = null
  for (let i = 0; i < retries; i++) {
    try {
      const response = await Promise.race([
        fetch(url, fetchOpts),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
      ]) as Response

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      cache.set(url, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      lastError = error as Error
      if (i < retries - 1) await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }

  throw lastError
}

export function clearCache(pattern?: string) {
  if (!pattern) {
    cache.clear()
    return
  }
  for (const [key] of cache) {
    if (key.includes(pattern)) cache.delete(key)
  }
}
