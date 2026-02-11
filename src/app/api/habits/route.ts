import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth'
import { createHabitSchema } from '@/lib/validations/habit'
import { Frequency } from '@prisma/client'

export async function GET(req: Request) {
  try {
    const { userId } = await requireAuth()
    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get('date')

    // If date is provided, implementation STORY-009 logic (Habits by date)
    if (dateStr) {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        )
      }

      // Use UTC methods to avoid timezone shifts since dateStr is parsed as UTC midnight
      // Standard getUTCDay() is 0=Sun, 1=Mon... 6=Sat.
      const dayOfWeek = date.getUTCDay()
      // BR-023: Weekly habits appear on selected days only (0=Mon, 6=Sun)
      const brDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      const dayOfMonth = date.getUTCDate()

      const habits = await prisma.habit.findMany({
        where: {
          userId,
          deletedAt: null,
          isActive: true,
          OR: [
            { frequency: 'DAILY' },
            {
              frequency: 'WEEKLY',
              weeklyDays: { has: brDayOfWeek },
            },
            {
              frequency: 'MONTHLY',
              monthlyDates: { has: dayOfMonth },
            },
          ],
        },
        include: {
          category: true,
          completions: {
            where: {
              date: {
                equals: date,
              },
              deletedAt: null,
            },
          },
        },
        orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
      })

      // Flatten isCompleted status
      const formattedHabits = habits.map((habit) => {
        const { completions, ...rest } = habit
        return {
          ...rest,
          isCompleted: completions.length > 0,
        }
      })

      return NextResponse.json(formattedHabits)
    }

    // Default: Get all habits (STORY-007)
    const habits = await prisma.habit.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        category: true,
      },
      orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    })

    return NextResponse.json(habits)
  } catch (error) {
    return handleAuthError(error)
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await requireAuth()
    const body = await req.json()

    const validatedData = createHabitSchema.parse(body)

    // Check 50 habit limit
    const activeCount = await prisma.habit.count({
      where: {
        userId,
        deletedAt: null,
        isActive: true,
      },
    })

    if (activeCount >= 50) {
      return NextResponse.json(
        { error: 'Maximum 50 active habits reached' },
        { status: 422 }
      )
    }

    // Check category ownership
    const category = await prisma.category.findFirst({
      where: {
        id: validatedData.categoryId,
        userId,
        deletedAt: null,
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 422 })
    }

    // Create habit
    const habit = await prisma.habit.create({
      data: {
        ...validatedData,
        userId,
        frequency: validatedData.frequency as Frequency,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(habit, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      // Extract first error message
      const firstError = (error as any).issues[0]
      return NextResponse.json({ error: firstError.message }, { status: 422 })
    }
    return handleAuthError(error)
  }
}
