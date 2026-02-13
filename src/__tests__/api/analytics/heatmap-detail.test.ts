import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/analytics/heatmap/[date]/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { parseISO, startOfDay, getDay } from 'date-fns'

// ---------- Mocks ----------

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
    prisma: {
        habit: { findMany: vi.fn() },
        habitCompletion: { findMany: vi.fn() },
    },
}))

const { auth } = await import('@/auth')

// ---------- Helpers ----------

const mockUser = { id: 'user-1', email: 'test@test.com' }

function makeReq() {
    return new NextRequest('http://localhost/api/analytics/heatmap/2025-06-15')
}

function makeParams(date = '2025-06-15') {
    return { params: { date } }
}

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
        color: '#6C63FF',
        ...overrides,
    }
}

// ---------- Test Suite ----------

describe('GET /api/analytics/heatmap/[date]', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (auth as any).mockResolvedValue({ user: mockUser })
    })

    // ---- Auth ----

    it('returns 401 when not authenticated', async () => {
        ; (auth as any).mockResolvedValue(null)

        const res = await GET(makeReq(), makeParams())
        const body = await res.json()

        expect(res.status).toBe(401)
        expect(body.error).toBe('Unauthorized')
    })

    // ---- No habits on that date ----

    it('returns empty habits array when no habits are scheduled', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq(), makeParams())
        const body = await res.json()

        expect(res.status).toBe(200)
        expect(body.date).toBe('2025-06-15')
        expect(body.habits).toEqual([])
    })

    // ---- Per-habit completion status ----

    it('returns correct per-habit completion status', async () => {
        const habit1 = makeHabit({ id: 'h1', name: 'Read' })
        const habit2 = makeHabit({ id: 'h2', name: 'Exercise' })

            ; (prisma.habit.findMany as any).mockResolvedValue([habit1, habit2])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([
                { habitId: 'h1' }, // Only habit1 completed
            ])

        const res = await GET(makeReq(), makeParams())
        const body = await res.json()

        expect(body.habits).toHaveLength(2)

        const h1 = body.habits.find((h: any) => h.id === 'h1')
        const h2 = body.habits.find((h: any) => h.id === 'h2')

        expect(h1.completed).toBe(true)
        expect(h1.name).toBe('Read')
        expect(h2.completed).toBe(false)
        expect(h2.name).toBe('Exercise')
    })

    // ---- All completed ----

    it('marks all habits as completed when all have completions', async () => {
        const habit1 = makeHabit({ id: 'h1' })
        const habit2 = makeHabit({ id: 'h2' })

            ; (prisma.habit.findMany as any).mockResolvedValue([habit1, habit2])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([
                { habitId: 'h1' },
                { habitId: 'h2' },
            ])

        const res = await GET(makeReq(), makeParams())
        const body = await res.json()

        body.habits.forEach((h: any) => {
            expect(h.completed).toBe(true)
        })
    })

    // ---- None completed ----

    it('marks all habits as not completed when none have completions', async () => {
        const habit1 = makeHabit({ id: 'h1' })
        const habit2 = makeHabit({ id: 'h2' })

            ; (prisma.habit.findMany as any).mockResolvedValue([habit1, habit2])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq(), makeParams())
        const body = await res.json()

        body.habits.forEach((h: any) => {
            expect(h.completed).toBe(false)
        })
    })

    // ---- Weekly habit excluded if not due on this date ----

    it('excludes weekly habits not scheduled on the target date', async () => {
        const targetDate = startOfDay(parseISO('2025-06-15'))
        const targetDow = getDay(targetDate) // e.g., 0 (Sun)
        const otherDow = (targetDow + 1) % 7

        const dailyHabit = makeHabit({ id: 'h1', frequency: 'DAILY' })
        const weeklyHabit = makeHabit({
            id: 'h2',
            frequency: 'WEEKLY',
            weeklyDays: [otherDow], // Not scheduled on June 15
        })

            ; (prisma.habit.findMany as any).mockResolvedValue([dailyHabit, weeklyHabit])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq(), makeParams('2025-06-15'))
        const body = await res.json()

        // Only the daily habit should appear
        expect(body.habits).toHaveLength(1)
        expect(body.habits[0].id).toBe('h1')
    })

    // ---- Response includes color field ----

    it('includes habit color in drill-down data', async () => {
        const habit = makeHabit({ id: 'h1', color: '#FF5733' })

            ; (prisma.habit.findMany as any).mockResolvedValue([habit])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq(), makeParams())
        const body = await res.json()

        expect(body.habits[0].color).toBe('#FF5733')
    })

    // ---- Internal error ----

    it('returns 500 on unexpected error', async () => {
        ; (prisma.habit.findMany as any).mockRejectedValue(new Error('DB error'))

        const res = await GET(makeReq(), makeParams())
        const body = await res.json()

        expect(res.status).toBe(500)
        expect(body.error).toBe('Internal Server Error')
    })
})
