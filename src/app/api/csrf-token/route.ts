import { NextResponse } from 'next/server'
import { generateCsrfToken } from '@/lib/csrf'

/**
 * GET /api/csrf-token
 * Returns a CSRF token for the client to use in mutation requests
 */
export async function GET() {
  try {
    // Generate token (will create cookie if it doesn't exist)
    const token = generateCsrfToken()

    return NextResponse.json({ token })
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
