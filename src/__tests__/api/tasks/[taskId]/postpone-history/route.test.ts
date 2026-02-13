import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/tasks/[taskId]/postpone-history/route'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

vi.mock('@/lib/prisma', () => ({
    prisma: {
        task: {
            findFirst: vi.fn(),
        },
        postponeHistory: {
            findMany: vi.fn(),
        },
    },
}))

vi.mock('@/lib/auth', () => ({
    requireAuth: vi.fn(),
    handleAuthError: vi.fn((_error) =>
        NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    ),
}))

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

const mockUserId = 'user-history-123'
const mockTaskId = 'task-history-456'
const mockParams = { params: Promise.resolve({ taskId: mockTaskId }) }

describe('Postpone History - GET /api/tasks/:taskId/postpone-history', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (requireAuth as any).mockResolvedValue({ userId: mockUserId })
    })

    it('should return postpone history ordered chronologically', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({ id: mockTaskId })

        const mockHistory = [
            { id: 'h1', fromDate: new Date('2025-01-01'), toDate: new Date('2025-01-02'), reason: 'auto' },
            { id: 'h2', fromDate: new Date('2025-01-02'), toDate: new Date('2025-01-03'), reason: 'auto' },
            { id: 'h3', fromDate: new Date('2025-01-03'), toDate: new Date('2025-01-05'), reason: 'auto' },
        ]
            ; (prisma.postponeHistory.findMany as any).mockResolvedValue(mockHistory)

        const req = new Request(`http://localhost/api/tasks/${mockTaskId}/postpone-history`)
        const res = await GET(req as any, mockParams as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data).toHaveLength(3)
        expect(prisma.postponeHistory.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { taskId: mockTaskId },
                orderBy: { createdAt: 'asc' },
            })
        )
    })

    it('should return empty array if no postponements', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({ id: mockTaskId })
            ; (prisma.postponeHistory.findMany as any).mockResolvedValue([])

        const req = new Request(`http://localhost/api/tasks/${mockTaskId}/postpone-history`)
        const res = await GET(req as any, mockParams as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data).toEqual([])
    })

    it('should return 404 for non-existent task (row-level security)', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue(null)

        const req = new Request(`http://localhost/api/tasks/${mockTaskId}/postpone-history`)
        const res = await GET(req as any, mockParams as any)

        expect(res.status).toBe(404)
    })
})
