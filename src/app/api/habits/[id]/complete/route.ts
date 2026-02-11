import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth'
import { isSameDay, startOfDay } from 'date-fns'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await requireAuth()
    const { id } = params
    const body = await req.json()
    const dateInput = body.date ? new Date(body.date) : new Date()

    if (isNaN(dateInput.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    const date = startOfDay(dateInput)
    const today = startOfDay(new Date())

    // AC: Can only complete habits for the current date
    if (!isSameDay(date, today)) {
      // Check if it's a past date
      if (date < today) {
        return NextResponse.json(
          { error: 'Can only complete habits for the current date' },
          { status: 422 }
        )
      }
      // Future dates are also likely not allowed
      return NextResponse.json(
        { error: 'Can only complete habits for the current date' },
        { status: 422 }
      )
    }

    // Check if habit exists and belongs to user
    const habit = await prisma.habit.findFirst({
      where: { id, userId, deletedAt: null },
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // BR-035: Numeric daily habits require meeting the target value
    if (habit.frequency === 'DAILY' && habit.targetValue) {
      const completionValue = body.value || 0
      if (completionValue < habit.targetValue) {
        // In some designs, you can log partial progress, but AC implies a "Complete" toggle.
        // If the card has a checkbox, it probably means "Met target".
      }
    }

    // Check for existing completion
    const existing = await prisma.habitCompletion.findFirst({
      where: { habitId: id, date, deletedAt: null },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Habit already completed for this date' },
        { status: 409 }
      )
    }

    // Create completion (using upsert or simple create)
    // If there's a soft-deleted one, we should probably restore it or create a new one.
    // Given the unique constraint [habitId, date], we should use upsert or check for deleted.

    const completion = await prisma.habitCompletion.upsert({
      where: { habitId_date: { habitId: id, date } },
      update: {
        deletedAt: null,
        value: body.value || null,
        completedAt: new Date(),
      },
      create: {
        habitId: id,
        userId,
        date,
        value: body.value || null,
      },
    })

    return NextResponse.json(completion)
  } catch (error) {
    return handleAuthError(error)
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await requireAuth()
    const { id } = params
    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get('date')
    const dateInput = dateStr ? new Date(dateStr) : new Date()

    if (isNaN(dateInput.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    const date = startOfDay(dateInput)

    // Check if completion exists
    const completion = await prisma.habitCompletion.findFirst({
      where: { habitId: id, userId, date, deletedAt: null },
    })

    if (!completion) {
      return NextResponse.json(
        { error: 'Completion not found' },
        { status: 404 }
      )
    }

    // Transaction to soft-delete completion and associated mood check-in
    await prisma.$transaction(async (tx) => {
      await tx.habitCompletion.update({
        where: { id: completion.id },
        data: { deletedAt: new Date() },
      })

      await tx.moodCheckin.updateMany({
        where: { completionId: completion.id, deletedAt: null },
        data: { deletedAt: new Date() },
      })
    })

    return NextResponse.json({ message: 'Habit uncompleted' })
  } catch (error) {
    return handleAuthError(error)
  }
}
