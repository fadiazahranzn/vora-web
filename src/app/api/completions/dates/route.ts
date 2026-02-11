import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function GET(req: Request) {
  try {
    const { userId } = await requireAuth()
    const { searchParams } = new URL(req.url)
    const month = searchParams.get('month') // YYYY-MM format

    if (!month) {
      return NextResponse.json(
        { error: 'Month parameter required (YYYY-MM)' },
        { status: 400 }
      )
    }

    const [year, monthNum] = month.split('-').map(Number)
    const date = new Date(year, monthNum - 1, 1)

    const start = startOfMonth(date)
    const end = endOfMonth(date)

    // Get all completion dates for the month
    const completions = await prisma.habitCompletion.findMany({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: start,
          lte: end,
        },
      },
      select: {
        date: true,
      },
      distinct: ['date'],
    })

    // Format dates as YYYY-MM-DD strings
    const completionDates = completions.map((c) => {
      const d = new Date(c.date)
      return d.toISOString().split('T')[0]
    })

    return NextResponse.json({ dates: completionDates })
  } catch (error) {
    return handleAuthError(error)
  }
}
