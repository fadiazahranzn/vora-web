
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/mood-checkins/route'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
    prisma: {
        moodCheckin: {
            findMany: vi.fn(),
            upsert: vi.fn(),
            findFirst: vi.fn(),
        },
        habitCompletion: {
            findFirst: vi.fn(),
        },
        $transaction: vi.fn((callback) => callback(prisma)),
    },
}))

vi.mock('@/lib/auth', () => ({
    requireAuth: vi.fn(),
    handleAuthError: vi.fn((error) => {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }),
}))

// Mock NextResponse
vi.mock('next/server', async (importOriginal) => {
    const actual = await importOriginal<typeof import('next/server')>()
    return {
        ...actual,
        NextResponse: {
            json: vi.fn((body, init) => ({
                json: async () => body,
                status: init?.status || 200,
            })),
        },
    }
})

describe('Mood Check-in API', () => {
    const mockUserId = 'user-123'
    const mockHabitId = '123e4567-e89b-12d3-a456-426614174000'
    const mockCompletionId = '123e4567-e89b-12d3-a456-426614174001'

    beforeEach(() => {
        vi.clearAllMocks()
            ; (requireAuth as any).mockResolvedValue({ userId: mockUserId })
    })

    describe('POST /api/mood-checkins', () => {
        const validPayload = {
            habitId: mockHabitId,
            date: '2023-10-27',
            mood: 'HAPPY',
            reflectionText: 'Felt great!',
            selectedActivity: 'hydrate',
        }

        it('should create a mood check-in when valid data is provided', async () => {
            const completion = { id: mockCompletionId }
                ; (prisma.habitCompletion.findFirst as any).mockResolvedValue(completion)
                ; (prisma.moodCheckin.upsert as any).mockResolvedValue({
                    id: 'mood-123',
                    ...validPayload,
                    mood: 'HAPPY',
                    selectedActivity: 'STAY_HYDRATED',
                    isPositive: true,
                })

            const req = new Request('http://localhost/api/mood-checkins', {
                method: 'POST',
                body: JSON.stringify(validPayload),
            })

            const res = await POST(req)
            const data = await res.json()

            expect(prisma.habitCompletion.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        habitId: mockHabitId,
                        userId: mockUserId,
                    }),
                })
            )

            expect(prisma.moodCheckin.upsert).toHaveBeenCalledWith(
                expect.objectContaining({
                    create: expect.objectContaining({
                        mood: 'HAPPY',
                        isPositive: true,
                    }),
                })
            )

            expect(res.status).toBe(200)
        })

        const moodsToTest = [
            { mood: 'HAPPY', expected: true },
            { mood: 'PROUD', expected: true },
            { mood: 'WORRIED', expected: false },
            { mood: 'ANNOYED', expected: false },
            { mood: 'SAD', expected: false },
            { mood: 'ANGRY', expected: false },
        ]

        it.each(moodsToTest)('should calculate isPositive correctly for mood: $mood', async ({ mood, expected }) => {
            const payload = { ...validPayload, mood }
            const completion = { id: mockCompletionId }
                ; (prisma.habitCompletion.findFirst as any).mockResolvedValue(completion)
                ; (prisma.moodCheckin.upsert as any).mockResolvedValue({})

            const req = new Request('http://localhost/api/mood-checkins', {
                method: 'POST',
                body: JSON.stringify(payload),
            })

            await POST(req)

            expect(prisma.moodCheckin.upsert).toHaveBeenCalledWith(
                expect.objectContaining({
                    create: expect.objectContaining({
                        mood,
                        isPositive: expected,
                    }),
                })
            )
        })

        it('should return 422 if habit is not completed for that date', async () => {
            ; (prisma.habitCompletion.findFirst as any).mockResolvedValue(null)

            const req = new Request('http://localhost/api/mood-checkins', {
                method: 'POST',
                body: JSON.stringify(validPayload),
            })

            const res = await POST(req)
            expect(res.status).toBe(422)
        })
    })

    describe('GET /api/mood-checkins', () => {
        it('should return mood check-ins for a date range', async () => {
            const mockCheckins = [
                { id: '1', mood: 'HAPPY', date: new Date('2023-10-27') },
            ]

                ; (prisma.moodCheckin.findMany as any).mockResolvedValue(mockCheckins)

            const url = 'http://localhost/api/mood-checkins?from=2023-10-27&to=2023-10-28'
            const req = new Request(url)

            const res = await GET(req)
            await res.json()

            expect(prisma.moodCheckin.findMany).toHaveBeenCalled()
            expect(res.status).toBe(200)
        })
    })
})
