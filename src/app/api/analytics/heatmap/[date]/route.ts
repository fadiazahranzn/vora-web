import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
    startOfDay,
    format,
    getDay,
    getDate,
    parseISO,
} from 'date-fns';

export async function GET(
    _req: NextRequest,
    { params }: { params: { date: string } }
) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const dateParam = params.date;
        const targetDate = startOfDay(parseISO(dateParam));

        // 1. Fetch habits active on this specific date
        const habits = await prisma.habit.findMany({
            where: {
                userId,
                createdAt: { lte: targetDate },
                deletedAt: undefined,
                OR: [
                    { deletedAt: null },
                    { deletedAt: { gte: targetDate } }
                ]
            }
        });

        // 2. Fetch completions for this date
        const completions = await prisma.habitCompletion.findMany({
            where: {
                userId,
                date: targetDate,
                deletedAt: null
            },
            select: {
                habitId: true
            }
        });

        const completedHabitIds = new Set(completions.map(c => c.habitId));

        const drillDownData = habits
            .filter(habit => {
                // Check Frequency
                if (habit.frequency === 'DAILY') return true;
                if (habit.frequency === 'WEEKLY') {
                    return habit.weeklyDays.includes(getDay(targetDate));
                }
                if (habit.frequency === 'MONTHLY') {
                    return habit.monthlyDates.includes(getDate(targetDate));
                }
                return false;
            })
            .map(habit => ({
                id: habit.id,
                name: habit.name,
                completed: completedHabitIds.has(habit.id),
                color: habit.color,
                emoji: null // Habit doesn't have emoji field in schema
            }));

        return NextResponse.json({
            date: dateParam,
            habits: drillDownData
        });

    } catch (error) {
        console.error('Heatmap Drill-Down API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
