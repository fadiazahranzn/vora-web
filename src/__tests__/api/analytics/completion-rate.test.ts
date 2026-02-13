import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/analytics/completion-rate/route'
import { prisma } from '@/lib/prisma'
import { startOfDay, getDay, getDate } from 'date-fns'

// ---------- Mocks ----------

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
    prisma: {
        habit: { findMany: vi.fn() },
        habitCompletion: { count: vi.fn() },
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

// ---------- Test Suite ----------

describe('GET /api/analytics/completion-rate', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // ---- Auth ----

    it('returns 401 when not authenticated', async () => {
        ; (auth as any).mockResolvedValue(null)

        const res = await GET()
        const body = await res.json()

        expect(res.status).toBe(401)
        expect(body.error).toBe('Unauthorized')
    })

    it('returns 401 when session has no user', async () => {
        ; (auth as any).mockResolvedValue({ user: null })

        const res = await GET()
        expect(res.status).toBe(401)
    })

    // ---- No habits scheduled today ----

    it('returns rate 0 when no habits exist', async () => {
        ; (auth as any).mockResolvedValue({ user: mockUser })
            ; (prisma.habit.findMany as any).mockResolvedValue([])
            ; (prisma.habitCompletion.count as any).mockResolvedValue(0)

        const res = await GET()
        const body = await res.json()

        expect(res.status).toBe(200)
        expect(body).toEqual({ rate: 0, completed: 0, scheduled: 0 })
    })

    // ---- 100 % completion ----

    it('returns 100 % when all daily habits completed', async () => {
        ; (auth as any).mockResolvedValue({ user: mockUser })
            ; (prisma.habit.findMany as any).mockResolvedValue([
                makeHabit({ id: 'h1' }),
                makeHabit({ id: 'h2' }),
            ])
            ; (prisma.habitCompletion.count as any).mockResolvedValue(2)

        const res = await GET()
        const body = await res.json()

        expect(body.rate).toBe(100)
        expect(body.completed).toBe(2)
        expect(body.scheduled).toBe(2)
    })

    // ---- Partial completion ----

    it('returns correct percentage for partial completion', async () => {
        ; (auth as any).mockResolvedValue({ user: mockUser })
            ; (prisma.habit.findMany as any).mockResolvedValue([
                makeHabit({ id: 'h1' }),
                makeHabit({ id: 'h2' }),
                makeHabit({ id: 'h3' }),
            ])
            ; (prisma.habitCompletion.count as any).mockResolvedValue(1)

        const res = await GET()
        const body = await res.json()

        // 1/3 = 33.33… → rounds to 33
        expect(body.rate).toBe(33)
        expect(body.completed).toBe(1)
        expect(body.scheduled).toBe(3)
    })

    // ---- Weekly habit scheduled today ----

    it('includes weekly habit if today matches weeklyDays', async () => {
        const todayDow = getDay(today) // 0-6
            ; (auth as any).mockResolvedValue({ user: mockUser })
            ; (prisma.habit.findMany as any).mockResolvedValue([
                makeHabit({ id: 'w1', frequency: 'WEEKLY', weeklyDays: [todayDow] }),
            ])
            ; (prisma.habitCompletion.count as any).mockResolvedValue(1)

        const res = await GET()
        const body = await res.json()

        expect(body.scheduled).toBe(1)
        expect(body.rate).toBe(100)
    })

    // ---- Weekly habit NOT scheduled today ----

    it('excludes weekly habit if today does not match weeklyDays', async () => {
        const notToday = (getDay(today) + 1) % 7
            ; (auth as any).mockResolvedValue({ user: mockUser })
            ; (prisma.habit.findMany as any).mockResolvedValue([
                makeHabit({ id: 'w1', frequency: 'WEEKLY', weeklyDays: [notToday] }),
            ])
            ; (prisma.habitCompletion.count as any).mockResolvedValue(0)

        const res = await GET()
        const body = await res.json()

        expect(body.scheduled).toBe(0)
        expect(body.rate).toBe(0)
    })

    // ---- Monthly habit scheduled today ----

    it('includes monthly habit if today matches monthlyDates', async () => {
        const todayDate = getDate(today)
            ; (auth as any).mockResolvedValue({ user: mockUser })
            ; (prisma.habit.findMany as any).mockResolvedValue([
                makeHabit({ id: 'm1', frequency: 'MONTHLY', monthlyDates: [todayDate] }),
            ])
            ; (prisma.habitCompletion.count as any).mockResolvedValue(0)

        const res = await GET()
        const body = await res.json()

        expect(body.scheduled).toBe(1)
        expect(body.rate).toBe(0)
    })

    // ---- Monthly habit NOT scheduled today ----

    it('excludes monthly habit if today does not match monthlyDates', async () => {
        const otherDate = getDate(today) === 15 ? 20 : 15
            ; (auth as any).mockResolvedValue({ user: mockUser })
            ; (prisma.habit.findMany as any).mockResolvedValue([
                makeHabit({ id: 'm1', frequency: 'MONTHLY', monthlyDates: [otherDate] }),
            ])
            ; (prisma.habitCompletion.count as any).mockResolvedValue(0)

        const res = await GET()
        const body = await res.json()

        expect(body.scheduled).toBe(0)
    })

    // ---- Internal server error ----

    it('returns 500 when an unexpected error occurs', async () => {
        ; (auth as any).mockRejectedValue(new Error('DB down'))

        const res = await GET()
        const body = await res.json()

        expect(res.status).toBe(500)
        expect(body.error).toBe('Internal Server Error')
    })
})
