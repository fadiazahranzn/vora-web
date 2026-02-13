import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export type RateLimitType = 'global' | 'auth' | 'mutation'

const LIMITS: Record<
  RateLimitType,
  {
    limit: number
    window: `${number} s` | `${number} m` | `${number} h` | `${number} d`
  }
> = {
  global: { limit: 100, window: '1 m' },
  auth: { limit: 10, window: '1 m' },
  mutation: { limit: 30, window: '1 m' },
}

// In-memory store for development/fallback
const memoryStore = new Map<string, { count: number; reset: number }>()

// Helper to clear expired entries periodically to prevent memory leaks in dev
if (process.env.NODE_ENV !== 'production') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of memoryStore.entries()) {
      if (now > value.reset) {
        memoryStore.delete(key)
      }
    }
  }, 60000) // Cleanup every minute
}

export async function checkRateLimit(identifier: string, type: RateLimitType) {
  // Check for Redis environment variables
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const { limit, window } = LIMITS[type]

    // Create a new Ratelimit instance for this specific limit configuration
    // In a real app, we might cache these instances
    const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(limit, window),
      analytics: true,
      prefix: `@upstash/ratelimit/${type}`,
    })

    return ratelimit.limit(identifier)
  }

  // Fallback: In-memory implementation
  const { limit } = LIMITS[type]
  const windowMs = 60 * 1000 // All windows are 1 minute in this config
  const key = `${type}:${identifier}`
  const now = Date.now()
  const record = memoryStore.get(key)

  if (!record || now > record.reset) {
    const reset = now + windowMs
    memoryStore.set(key, { count: 1, reset })
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset,
      pending: Promise.resolve(),
    }
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.reset,
      pending: Promise.resolve(),
    }
  }

  record.count += 1
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.reset,
    pending: Promise.resolve(),
  }
}
