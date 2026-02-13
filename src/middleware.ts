import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'
import { checkRateLimit, RateLimitType } from './lib/ratelimit'
import { requiresCsrfValidation } from './lib/csrf'

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const { nextUrl } = req
  const isAuthenticated = !!req.auth

  const isAuthRoute = ['/login', '/register'].includes(nextUrl.pathname)
  const isApiRoute = nextUrl.pathname.startsWith('/api')

  // Generate a random nonce for CSP
  const nonce = crypto.randomUUID()

  // Define Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob: https://lh3.googleusercontent.com https://avatars.githubusercontent.com;
    connect-src 'self' https://*.googleapis.com;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim()

  const setSecurityHeaders = (res: NextResponse) => {
    res.headers.set('Content-Security-Policy', cspHeader)
    res.headers.set('X-Frame-Options', 'DENY')
    res.headers.set('X-Content-Type-Options', 'nosniff')
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()'
    )
    if (process.env.NODE_ENV === 'production') {
      res.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains'
      )
    }
  }

  // Rate Limiting Logic for API Routes
  if (isApiRoute) {
    let rateLimitType: RateLimitType = 'global'
    let identifier = req.headers.get('x-forwarded-for') ?? '127.0.0.1'

    // Determine specific rate limit type
    if (nextUrl.pathname.startsWith('/api/auth')) {
      rateLimitType = 'auth'
    } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      rateLimitType = 'mutation'
      // Use user ID if available for mutation limits, fallback to IP
      if (req.auth?.user?.id) {
        identifier = req.auth.user.id
      }
    }

    const result = await checkRateLimit(identifier, rateLimitType)

    if (!result.success) {
      const response = new NextResponse(
        rateLimitType === 'auth'
          ? `Too many login attempts. Try again in ${Math.ceil((result.reset - Date.now()) / 1000)} seconds.`
          : 'Too Many Requests',
        { status: 429 }
      )

      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', result.limit.toString())
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
      response.headers.set('X-RateLimit-Reset', result.reset.toString())
      response.headers.set(
        'Retry-After',
        Math.ceil((result.reset - Date.now()) / 1000).toString()
      )

      setSecurityHeaders(response)
      return response
    }

    // Add rate limit headers to successful/passed request context to be added to response later?
    // Middleware can only return one response.
    // If we proceed, we need to modify the response returned by `NextResponse.next()`.
    // We'll do this by capturing the response object at the end.

    // Continue with normal flow
    // Store rate limit result to add headers later
    req.headers.set('x-ratelimit-limit', result.limit.toString())
    req.headers.set('x-ratelimit-remaining', result.remaining.toString())
    req.headers.set('x-ratelimit-reset', result.reset.toString())
  }

  // CSRF Protection for API Routes
  if (isApiRoute && requiresCsrfValidation(req.method)) {
    const csrfToken = req.headers.get('x-csrf-token')

    // Skip CSRF for auth routes (login/register) as they don't have tokens yet
    const isAuthEndpoint = nextUrl.pathname.startsWith('/api/auth')

    if (!isAuthEndpoint && !csrfToken) {
      const response = new NextResponse(
        JSON.stringify({ error: 'Invalid CSRF token' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      setSecurityHeaders(response)
      return response
    }
  }

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  let response: NextResponse

  if (isApiRoute) {
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } else if (isAuthenticated && isAuthRoute) {
    response = NextResponse.redirect(new URL('/', nextUrl))
  } else if (!isAuthenticated && !isAuthRoute) {
    response = NextResponse.redirect(new URL('/login', nextUrl))
  } else {
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  setSecurityHeaders(response)

  // Apply Rate Limit Headers if they exist on the request (from our check above)
  if (isApiRoute) {
    const limit = req.headers.get('x-ratelimit-limit')
    const remaining = req.headers.get('x-ratelimit-remaining')
    const reset = req.headers.get('x-ratelimit-reset')

    if (limit) response.headers.set('X-RateLimit-Limit', limit)
    if (remaining) response.headers.set('X-RateLimit-Remaining', remaining)
    if (reset) response.headers.set('X-RateLimit-Reset', reset)
  }

  return response
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
