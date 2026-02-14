import { NextResponse } from 'next/server'
import { generateToken, CSRF_COOKIE_NAME } from '@/lib/csrf'

/**
 * GET /api/csrf-token
 * Returns a CSRF token for the client to use in mutation requests
 */
export async function GET() {
  try {
    const token = generateToken()

    const response = NextResponse.json({ token })

    response.cookies.set(CSRF_COOKIE_NAME, token, {
      httpOnly: false, // Allow client to read if needed, or keeping it HttpOnly and returning token in body is better.
      // Wait, if I return token in body, Client accesses body. Cookie should be arguably HttpOnly?
      // Double Submit: Cookie is usually NOT HttpOnly if client reads it from cookie.
      // But here we return it in JSON. So Cookie can be HttpOnly.
      // Let's make it HttpOnly for better security (XSS can't read cookie), but XSS can read JSON response if they trigger it?
      // Standard: Cookie HttpOnly, Header from JSON response.
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
