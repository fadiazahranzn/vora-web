import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export class AuthError extends Error {
  constructor(
    public message: string = 'Authentication required',
    public status: number = 401
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * requireAuth()
 *
 * A reusable utility for API routes to protect endpoints and access
 * the authenticated user's ID.
 *
 * @returns {Promise<{ userId: string; session: any }>}
 * @throws {AuthError} if session is missing or invalid
 */
export async function requireAuth() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new AuthError('Authentication required')
  }

  return {
    userId: session.user.id,
    session,
  }
}

/**
 * handleAuthError()
 *
 * Standardized error response for authentication failures.
 */
export function handleAuthError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: 'Unauthorized', message: error.message },
      { status: error.status }
    )
  }

  console.error('Auth Guard Error:', error)
  return NextResponse.json(
    { error: 'Internal Server Error', message: 'An unexpected error occurred' },
    { status: 500 }
  )
}
