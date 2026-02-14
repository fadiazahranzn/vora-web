import { NextRequest } from 'next/server'

export const CSRF_COOKIE_NAME = 'csrf_token'
export const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * Generates a new CSRF token
 * Returns the token string. The caller is responsible for setting it in a cookie.
 */
export function generateToken(): string {
  return crypto.randomUUID()
}

/**
 * Validates CSRF token from request
 * checks if the header token matches the cookie token
 */
export function validateCsrfToken(req: NextRequest): boolean {
  const headerToken = req.headers.get(CSRF_HEADER_NAME)
  const cookieToken = req.cookies.get(CSRF_COOKIE_NAME)?.value

  return !!headerToken && !!cookieToken && headerToken === cookieToken
}

/**
 * Checks if a request method requires CSRF validation
 */
export function requiresCsrfValidation(method: string): boolean {
  const mutationMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
  return mutationMethods.includes(method.toUpperCase())
}
