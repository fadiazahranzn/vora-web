import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/analytics/stats/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { format, subDays, startOfDay } from 'date-fns'

// ---------- Mocks ----------

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
    prisma: {
        habit: {
            findMany: vi.fn(),
            findFirst: vi.fn(),
        },
        habitCompletion: {
            findFirst: vi.fn(),
            findMany: vi.fn(),
        },
    },
}))

const { auth } = await import('@/auth')

// ---------- Helpers ----------

const mockUser = { id: 'user-1', email: 'test@test.com' }
const today = startOfDay(new Date())

function makeHabit(overrides: Record<string, unknown> = {}) {
    return {
        id: 'habit-1',
        userId: mockUser.id,
        name: 'Read',
        frequency: 'DAILY',
        weeklyDays: [],
        monthlyDates: [],
        createdAt: new Date('2025-01-01'),
        deletedAt: null,
        ...overrides,
    }
}

function makeCompletion(date: Date, overrides: Record<string, unknown> = {}) {
    return {
        id: 'comp-1',
        habitId: 'habit-1',
        userId: mockUser.id,
        date,
        deletedAt: null,
        ...overrides,
    }
}

function makeReq() {
    return new NextRequest('http://localhost/api/analytics/stats')
}

// ---------- Test Suite ----------

describe('GET /api/analytics/stats', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (auth as any).mockResolvedValue({ user: mockUser })
    })

    // ---- Auth ----

    it('returns 401 when not authenticated', async () => {
        ; (auth as any).mockResolvedValue(null)

        const res = await GET(makeReq())
        const body = await res.json()

        expect(res.status).toBe(401)
        expect(body.error).toBe('Unauthorized')
    })

    // ---- No habits ----

    it('returns all-zero stats when user has no habits', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq())
        const body = await res.json()

        expect(res.status).toBe(200)
        expect(body).toEqual({
            currentStreak: 0,
            longestStreak: 0,
            perfectDays: 0,
            activeDays: 0,
        })
    })

    // ---- Habits exist but no completions ----

    it('returns all-zero streaks when there are habits but no completions', async () => {
        const habit = makeHabit({ createdAt: subDays(today, 5) })
            ; (prisma.habit.findMany as any).mockResolvedValue([habit])
            ; (prisma.habit.findFirst as any).mockResolvedValue(habit)
            ; (prisma.habitCompletion.findFirst as any).mockResolvedValue(null)
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq())
        const body = await res.json()

        expect(body.currentStreak).toBe(0)
        expect(body.longestStreak).toBe(0)
        expect(body.perfectDays).toBe(0)
        expect(body.activeDays).toBe(0)
    })

    // ---- Single-day perfect streak ----

    it('returns streak of 1 when only today is completed', async () => {
        const habit = makeHabit({ createdAt: subDays(today, 1) })
        const completion = makeCompletion(today)

            ; (prisma.habit.findMany as any).mockResolvedValue([habit])
            ; (prisma.habit.findFirst as any).mockResolvedValue(habit)
            ; (prisma.habitCompletion.findFirst as any).mockResolvedValue(completion)
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([completion])

        const res = await GET(makeReq())
        const body = await res.json()

        // Yesterday was not completed → streak = 1 (today)
        // Today is always considered "in progress", so the streak continues
        expect(body.currentStreak).toBeGreaterThanOrEqual(1)
        expect(body.activeDays).toBe(1)
    })

    // ---- Multi-day streak ----

    it('calculates current streak for consecutive perfect days', async () => {
        const habit = makeHabit({ createdAt: subDays(today, 5) })
        // 3 consecutive days of completions: today, yesterday, day-before-yesterday
        const completions = [
            makeCompletion(today, { id: 'c1' }),
            makeCompletion(subDays(today, 1), { id: 'c2' }),
            makeCompletion(subDays(today, 2), { id: 'c3' }),
        ]

            ; (prisma.habit.findMany as any).mockResolvedValue([habit])
            ; (prisma.habit.findFirst as any).mockResolvedValue(habit)
            ; (prisma.habitCompletion.findFirst as any).mockResolvedValue(completions[2])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue(completions)

        const res = await GET(makeReq())
        const body = await res.json()

        expect(body.currentStreak).toBeGreaterThanOrEqual(3)
        expect(body.activeDays).toBe(3)
        expect(body.perfectDays).toBeGreaterThanOrEqual(3)
    })

    // ---- Gap in streak ----

    it('resets streak when there is a gap', async () => {
        const habit = makeHabit({ createdAt: subDays(today, 5) })
        // Completions on today and 3 days ago, but NOT yesterday/day-before
        const completions = [
            makeCompletion(today, { id: 'c1' }),
            makeCompletion(subDays(today, 3), { id: 'c2' }),
        ]

            ; (prisma.habit.findMany as any).mockResolvedValue([habit])
            ; (prisma.habit.findFirst as any).mockResolvedValue(habit)
            ; (prisma.habitCompletion.findFirst as any).mockResolvedValue(completions[1])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue(completions)

        const res = await GET(makeReq())
        const body = await res.json()

        // Current streak should be reset because yesterday was missed
        // Today is included because "today" is tolerated (might not be done yet)
        expect(body.currentStreak).toBeLessThanOrEqual(1)
        expect(body.activeDays).toBe(2)
    })

    // ---- Internal error ----

    it('returns 500 on unexpected error', async () => {
        ; (prisma.habit.findMany as any).mockRejectedValue(new Error('DB error'))

        const res = await GET(makeReq())
        const body = await res.json()

        expect(res.status).toBe(500)
        expect(body.error).toBe('Internal Server Error')
    })
})
