import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth'

/**
 * GET /api/tasks/:taskId/postpone-history
 *
 * Returns the postpone history for a specific task, ordered chronologically.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth()
    const { id: taskId } = await params

    // Verify task ownership (row-level security)
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId, deletedAt: null },
      select: { id: true },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Task not found' },
        { status: 404 }
      )
    }

    const history = await prisma.postponeHistory.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(history)
  } catch (error) {
    return handleAuthError(error)
  }
}
