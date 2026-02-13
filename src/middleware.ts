import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isAuthenticated = !!req.auth

  const isAuthRoute = ['/login', '/register'].includes(nextUrl.pathname)
  const isApiRoute = nextUrl.pathname.startsWith('/api')

  // Generate a random nonce for CSP
  const nonce = crypto.randomUUID()

  // Define Content Security Policy
  // Note: Added unsafe-eval for dev mode support if needed, but strictly following requirements first.
  // Including configured image domains from next.config.ts in img-src
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

  // Set Security Headers
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  // HSTS only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    )
  }

  return response
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
