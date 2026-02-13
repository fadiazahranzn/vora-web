import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/analytics/chart/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

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

function makeReq(view?: string) {
    const url = view
        ? `http://localhost/api/analytics/chart?view=${view}`
        : 'http://localhost/api/analytics/chart'
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

describe('GET /api/analytics/chart', () => {
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

    // ---- Weekly view – 7 data points ----

    it('returns 7 data points for weekly view (default)', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq())
        const body = await res.json()

        expect(res.status).toBe(200)
        expect(body).toHaveLength(7)
    })

    it('returns 7 data points when view=weekly explicitly', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq('weekly'))
        const body = await res.json()

        expect(body).toHaveLength(7)
    })

    // ---- Monthly view – 30 data points ----

    it('returns 30 data points for monthly view', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq('monthly'))
        const body = await res.json()

        expect(body).toHaveLength(30)
    })

    // ---- Yearly view – 12 data points ----

    it('returns 12 data points for yearly view', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq('yearly'))
        const body = await res.json()

        expect(body).toHaveLength(12)
    })

    // ---- Each data point has { date, rate } ----

    it('returns { date, rate } shape for each data point', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq('weekly'))
        const body = await res.json()

        body.forEach((point: any) => {
            expect(point).toHaveProperty('date')
            expect(point).toHaveProperty('rate')
            expect(typeof point.rate).toBe('number')
        })
    })

    // ---- Empty habits → all rates 0 ----

    it('returns rate 0 for all points when no habits exist', async () => {
        ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([])

        const res = await GET(makeReq('weekly'))
        const body = await res.json()

        body.forEach((p: any) => expect(p.rate).toBe(0))
    })

    // ---- Correct rate calculation ----

    it('calculates correct rate when completions exist', async () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const habit = makeHabit({ createdAt: new Date('2024-01-01') })

            ; (prisma.habit.findMany as any).mockResolvedValue([habit])
            // Simulate completion on today only
            ; (prisma.habitCompletion.findMany as any).mockResolvedValue([
                { habitId: 'habit-1', date: today, userId: mockUser.id, deletedAt: null },
            ])

        const res = await GET(makeReq('weekly'))
        const body = await res.json()

        // The last data point (today) should have rate 100%
        const lastPoint = body[body.length - 1]
        expect(lastPoint.rate).toBe(100)
    })

    // ---- Internal error ----

    it('returns 500 on unexpected error', async () => {
        ; (prisma.habit.findMany as any).mockRejectedValue(new Error('DB crash'))

        const res = await GET(makeReq())
        const body = await res.json()

        expect(res.status).toBe(500)
        expect(body.error).toBe('Internal Server Error')
    })
})
