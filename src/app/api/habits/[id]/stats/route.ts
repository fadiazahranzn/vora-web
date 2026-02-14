import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth'
import { calculateStreaks } from '@/lib/services/streak'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth()
    const { id } = await params

    // Fetch habit and its completions
    const habit = await prisma.habit.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        completions: {
          where: { deletedAt: null },
          orderBy: { date: 'desc' },
        },
      },
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Calculate streaks
    const stats = calculateStreaks(habit, habit.completions)

    return NextResponse.json(stats)
  } catch (error) {
    return handleAuthError(error)
  }
}
