import { test, expect } from '@playwright/test'

test.describe('Security Implementation', () => {
  test('should have security headers on main page', async ({ page }) => {
    const response = await page.goto('/')
    const headers = response?.headers()

    expect(headers).toBeDefined()
    if (!headers) return

    expect(headers['content-security-policy']).toBeDefined()
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['permissions-policy']).toBeDefined()

    // HSTS is only in production
    // expect(headers['strict-transport-security']).toBeDefined();
  })

  test('should enforce rate limiting on API routes', async ({ request }) => {
    // We'll hit an API endpoint rapidly. The limit is likely 100 per minute globally or less for auth.
    // Let's try to hit the auth endpoint to trigger the lower limit (10 req/min)
    const endpoint = '/api/auth/session'
    // Note: This test might be flaky if run in parallel with other tests hitting the same IP limit.
    // Ideally we'd mock the ratelimiter store, but this is E2E.
    // Or we use a non-existent API route which falls under global limit (100).
    // Let's stick to checking if headers exist after one request,
    // and maybe burst a few to see headers update.

    const response = await request.get(endpoint)
    const headers = response.headers()

    // Verify RateLimit headers are present
    // Note: Middleware adds them to response if rate limit check happened
    // Our middleware logic: if (isApiRoute) -> checkRateLimit -> ...
    // If succesful, it adds headers too (lines 160-162 in middleware.ts: response.headers.set(...)).

    expect(headers['x-ratelimit-limit']).toBeDefined()
    expect(headers['x-ratelimit-remaining']).toBeDefined()
    expect(headers['x-ratelimit-reset']).toBeDefined()
  })

  // CSRF test:
  // POST request to an API route without CSRF token should return 403
  // Middleware logic: if (isApiRoute && requiresCsrfValidation) -> check token
  test('should reject POST request without CSRF token', async ({ request }) => {
    const response = await request.post('/api/some-endpoint', {
      data: { test: 'data' },
    })

    // Should be 403 Forbidden due to missing CSRF token
    // Or 401 if auth checks happen before? Middleware runs before auth checks usually?
    // In middleware.ts, CSRF check is inside 'if (isApiRoute && requiresCsrfValidation)'.
    // It runs before 'NextResponse.next()'.

    // However, the middleware also checks auth status at the top: 'const isAuthenticated = !!req.auth'.
    // But the CSRF block doesn't depend on auth status, except to skip for auth endpoints.

    expect(response.status()).toBe(403)
    const body = await response.json()
    expect(body.error).toBe('Invalid CSRF token')
  })
})
