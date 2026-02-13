import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/analytics/heatmap/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { format, getDaysInMonth } from 'date-fns'

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

function makeReq(month?: string) {
    const url = month
        ? `http://localhost/api/analytics/heatmap?month=${month}`
        : 'http://localhost/api/analytics/heatmap'
    return new NextRequest(url)
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
        ...overrides,
    }
}

// ---------- Test Suite ----------

describe('GET /api/analytics/heatmap', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (auth as any).mockResolvedValue({ user: mockUser })
    })

    // ---- Auth ----

    it('returns 401 when not authenticated', async () => {
        ; (auth as any).mockResolvedValue(null)

        const res = await GET(makeReq('2025-06'))
        const body = await res.json()

        expect(res.status).toBe(401)
        expect(body.error).toBe('Unauthorized')
    })

    // ---- Missing month param ----

    it('returns 400 when month parameter is missing', async () => {
        const res = await GET(makeReq())
        const body = await res.json()

        expect(res.status).toBe(400)
        expect(body.error).toContain('Month')
    })

    // ---- Correct number of days ----

    it('returns one entry per day of the month', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq('2025-06'))
        const body = await res.json()

        // June has 30 days
        expect(body).toHaveLength(30)
    })

    it('returns 31 entries for January', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq('2025-01'))
        const body = await res.json()

        expect(body).toHaveLength(31)
    })

    it('returns 28 entries for Feb in a non-leap year', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq('2025-02'))
        const body = await res.json()

        expect(body).toHaveLength(28)
    })

    // ---- Each entry shape ----

    it('returns { date, rate, completed, scheduled } for each day', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq('2025-03'))
        const body = await res.json()

        body.forEach((day: any) => {
            expect(day).toHaveProperty('date')
            expect(day).toHaveProperty('rate')
            expect(day).toHaveProperty('completed')
            expect(day).toHaveProperty('scheduled')
        })
    })

    // ---- No habits → all rates 0, scheduled 0 ----

    it('returns rate 0 and scheduled 0 when no habits exist', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq('2025-05'))
        const body = await res.json()

        body.forEach((day: any) => {
            expect(day.rate).toBe(0)
            expect(day.scheduled).toBe(0)
        })
    })

    // ---- Color-coding boundary: rate calculation ----

    it('calculates correct rate for full completions (100%)', async () => {
        const habit = makeHabit({ createdAt: new Date('2025-01-01') })
        const targetDate = new Date('2025-06-15')
        targetDate.setHours(0, 0, 0, 0)

            ; (prisma.habit.findMany as any).mockResolvedValue([habit])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([
                { habitId: 'habit-1', date: targetDate, userId: mockUser.id, deletedAt: null },
            ])

        const res = await GET(makeReq('2025-06'))
        const body = await res.json()

        const june15 = body.find((d: any) => d.date === '2025-06-15')
        expect(june15).toBeDefined()
        expect(june15!.rate).toBe(100)
        expect(june15!.completed).toBe(1)
        expect(june15!.scheduled).toBe(1)
    })

    // ---- Rate = 0 for day with scheduled but no completions ----

    it('returns rate 0 for days with scheduled habits but no completions', async () => {
        const habit = makeHabit({ createdAt: new Date('2025-01-01') })

            ; (prisma.habit.findMany as any).mockResolvedValue([habit])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq('2025-06'))
        const body = await res.json()

        // All days should have rate 0 (daily habit, but 0 completions)
        body.forEach((day: any) => {
            expect(day.rate).toBe(0)
            expect(day.scheduled).toBe(1)
        })
    })

    // ---- Internal error ----

    it('returns 500 on unexpected error', async () => {
        ; (prisma.habit.findMany as any).mockRejectedValue(new Error('DB error'))

        const res = await GET(makeReq('2025-06'))
        const body = await res.json()

        expect(res.status).toBe(500)
        expect(body.error).toBe('Internal Server Error')
    })
})
