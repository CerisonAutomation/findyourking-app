/**
 * Rate limiting for API endpoints
 * Uses Upstash Redis for distributed rate limiting
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Rate limiters for different use cases
export const limiters = {
  // 100 requests per hour per IP
  api: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(100, '1 h'),
  }),

  // 5 login attempts per 15 minutes
  login: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
  }),

  // 10 password reset attempts per hour
  passwordReset: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
  }),

  // 50 messages per hour per user
  messages: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(50, '1 h'),
  }),
}

export async function checkRateLimit(
  limiter: Ratelimit,
  key: string,
): Promise<{ success: boolean; remaining: number; reset: number }> {
  try {
    const result = await limiter.limit(key)
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.resetInSeconds,
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // Fail open - allow request if Redis is down
    return { success: true, remaining: 0, reset: 0 }
  }
}

export async function withRateLimit(
  request: NextRequest,
  limiter: Ratelimit,
  key?: string,
) {
  const ip = request.ip || 'unknown'
  const limitKey = key || ip

  const result = await checkRateLimit(limiter, limitKey)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': result.reset.toString(),
        },
      },
    )
  }

  return null
}
