import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { startOfDay, getDay, getDate } from 'date-fns';

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const today = startOfDay(new Date());

        // 1. Fetch habits active today
        const habits = await prisma.habit.findMany({
            where: {
                userId,
                createdAt: { lte: today },
                OR: [
                    { deletedAt: null },
                    { deletedAt: { gte: today } }
                ]
            }
        });

        // 2. Identify habits due today
        const habitsDueToday = habits.filter(habit => {
            // Check Frequency
            if (habit.frequency === 'DAILY') return true;
            if (habit.frequency === 'WEEKLY') {
                return habit.weeklyDays.includes(getDay(today));
            }
            if (habit.frequency === 'MONTHLY') {
                return habit.monthlyDates.includes(getDate(today));
            }
            return false;
        });

        const scheduled = habitsDueToday.length;

        // 3. Fetch completions for today
        const completedCount = await prisma.habitCompletion.count({
            where: {
                userId,
                date: today,
                deletedAt: null
            }
        });

        const rate = scheduled > 0 ? Math.round((completedCount / scheduled) * 100) : 0;

        return NextResponse.json({
            rate,
            completed: completedCount,
            scheduled
        });

    } catch (error) {
        console.error('Completion Rate API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
