import { requireAuth, handleAuthError } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { userId, session } = await requireAuth()

    return NextResponse.json({
      message: 'This is a protected route',
      userId,
      userEmail: session.user.email,
    })
  } catch (error) {
    return handleAuthError(error)
  }
}
