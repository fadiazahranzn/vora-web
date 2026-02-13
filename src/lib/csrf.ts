import { doubleCsrf } from 'csrf-csrf'

const CSRF_SECRET =
  process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production'

if (!process.env.CSRF_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  CSRF_SECRET not set in production environment!')
}

// Initialize CSRF protection
const doubleCsrfUtilities = doubleCsrf({
  getSecret: () => CSRF_SECRET,
  cookieName: '__Host-csrf-token',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getSessionIdentifier: (req: any) => {
    // Use IP address as session identifier
    return req.headers?.get?.('x-forwarded-for') || 'anonymous'
  },
})

/**
 * Generates a new CSRF token
 * Should be called when rendering pages that will make mutation requests
 *
 * @param req - Optional request object
 * @param res - Optional response object
 * @returns CSRF token string
 */
export function generateCsrfToken(req?: any, res?: any): string {
  return doubleCsrfUtilities.generateCsrfToken(req, res)
}

/**
 * Validates CSRF token from request
 * Should be called in middleware for mutation requests (POST, PATCH, DELETE, PUT)
 *
 * @param req - The incoming request
 * @param res - The response object
 * @param next - The next function
 * @returns true if valid, false otherwise
 */
export function validateCsrfToken(req: any, res: any, next: any): boolean {
  try {
    doubleCsrfUtilities.doubleCsrfProtection(req, res, next)
    return true
  } catch (error) {
    console.error('CSRF validation failed:', error)
    return false
  }
}

/**
 * Checks if a request method requires CSRF validation
 */
export function requiresCsrfValidation(method: string): boolean {
  const mutationMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
  return mutationMethods.includes(method.toUpperCase())
}

/**
 * Export the full utilities for advanced usage
 */
export const csrfProtection = doubleCsrfUtilities
