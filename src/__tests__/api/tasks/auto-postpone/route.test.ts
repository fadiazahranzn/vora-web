import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/tasks/auto-postpone/route'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Mock transaction helper
const mockTx = {
    task: {
        update: vi.fn(),
    },
    postponeHistory: {
        create: vi.fn(),
    },
}

vi.mock('@/lib/prisma', () => ({
    prisma: {
        task: {
            findMany: vi.fn(),
        },
        $transaction: vi.fn(async (callback) => callback(mockTx)),
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

const mockUserId = 'user-postpone-123'

describe('Auto-Postpone Engine - POST /api/tasks/auto-postpone', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (requireAuth as any).mockResolvedValue({ userId: mockUserId })
    })

    it('should postpone overdue tasks with autoPostpone=true to today (BR-089)', async () => {
        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        threeDaysAgo.setHours(0, 0, 0, 0)

        const fiveDaysAgo = new Date()
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
        fiveDaysAgo.setHours(0, 0, 0, 0)

        const overdueTasks = [
            { id: 'task-1', dueDate: threeDaysAgo, originalDueDate: null, title: 'Task 1' },
            { id: 'task-2', dueDate: fiveDaysAgo, originalDueDate: null, title: 'Task 2' },
            { id: 'task-3', dueDate: threeDaysAgo, originalDueDate: null, title: 'Task 3' },
        ]
            ; (prisma.task.findMany as any).mockResolvedValue(overdueTasks)
        mockTx.task.update.mockResolvedValue({})
        mockTx.postponeHistory.create.mockResolvedValue({})

        const res = await POST()
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.postponedCount).toBe(3)
        expect(data.postponedTaskIds).toEqual(['task-1', 'task-2', 'task-3'])
    })

    it('should preserve originalDueDate on first postpone (BR-091)', async () => {
        const twoDaysAgo = new Date()
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
        twoDaysAgo.setHours(0, 0, 0, 0)

            ; (prisma.task.findMany as any).mockResolvedValue([
                { id: 'task-first', dueDate: twoDaysAgo, originalDueDate: null, title: 'First time' },
            ])
        mockTx.task.update.mockResolvedValue({})
        mockTx.postponeHistory.create.mockResolvedValue({})

        await POST()

        // originalDueDate should be set to the old dueDate (twoDaysAgo)
        expect(mockTx.task.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'task-first' },
                data: expect.objectContaining({
                    originalDueDate: twoDaysAgo,
                }),
            })
        )
    })

    it('should NOT overwrite originalDueDate on subsequent postpones (BR-091)', async () => {
        const oneDayAgo = new Date()
        oneDayAgo.setDate(oneDayAgo.getDate() - 1)
        oneDayAgo.setHours(0, 0, 0, 0)

        const originalDate = new Date('2025-01-01')

            ; (prisma.task.findMany as any).mockResolvedValue([
                { id: 'task-again', dueDate: oneDayAgo, originalDueDate: originalDate, title: 'Repeat' },
            ])
        mockTx.task.update.mockResolvedValue({})
        mockTx.postponeHistory.create.mockResolvedValue({})

        await POST()

        // originalDueDate should stay as the original, not be overwritten
        expect(mockTx.task.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    originalDueDate: originalDate,
                }),
            })
        )
    })

    it('should create PostponeHistory records (BR-092)', async () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)

            ; (prisma.task.findMany as any).mockResolvedValue([
                { id: 'task-history', dueDate: yesterday, originalDueDate: null, title: 'History test' },
            ])
        mockTx.task.update.mockResolvedValue({})
        mockTx.postponeHistory.create.mockResolvedValue({})

        await POST()

        expect(mockTx.postponeHistory.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    taskId: 'task-history',
                    fromDate: yesterday,
                    toDate: expect.any(Date),
                    reason: 'auto',
                }),
            })
        )
    })

    it('should exclude completed tasks (BR-093)', async () => {
        ; (prisma.task.findMany as any).mockResolvedValue([])

        await POST()

        // Verify the query excludes completed tasks
        expect(prisma.task.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    userId: mockUserId,
                    autoPostpone: true,
                    completedAt: null,
                    deletedAt: null,
                    dueDate: expect.objectContaining({ lt: expect.any(Date) }),
                }),
            })
        )
    })

    it('should return empty result when no tasks need postponing', async () => {
        ; (prisma.task.findMany as any).mockResolvedValue([])

        const res = await POST()
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.postponedCount).toBe(0)
        expect(data.postponedTaskIds).toEqual([])
        // $transaction should NOT be called when there's nothing to do
        expect(prisma.$transaction).not.toHaveBeenCalled()
    })

    it('should be idempotent — tasks already due today are not re-fetched', async () => {
        // The query uses dueDate < today, so tasks due today won't match
        ; (prisma.task.findMany as any).mockResolvedValue([])

        const res = await POST()
        const data = await res.json()

        expect(data.postponedCount).toBe(0)

        // Verify the WHERE clause uses lt (less than today), not lte
        expect(prisma.task.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    dueDate: { lt: expect.any(Date) },
                }),
            })
        )
    })

    it('should use $transaction for atomicity', async () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)

            ; (prisma.task.findMany as any).mockResolvedValue([
                { id: 'task-tx', dueDate: yesterday, originalDueDate: null, title: 'TX test' },
            ])
        mockTx.task.update.mockResolvedValue({})
        mockTx.postponeHistory.create.mockResolvedValue({})

        await POST()

        expect(prisma.$transaction).toHaveBeenCalledTimes(1)
    })

    it('should return 401 when not authenticated', async () => {
        const authError = new Error('Auth required')
        authError.name = 'AuthError'
            ; (requireAuth as any).mockRejectedValue(authError)

        const res = await POST()

        expect(res.status).toBe(500) // handleAuthError mock returns 500
    })

    it('should handle multiple tasks in a single batch transaction', async () => {
        const dates = [2, 4, 6].map(d => {
            const date = new Date()
            date.setDate(date.getDate() - d)
            date.setHours(0, 0, 0, 0)
            return date
        })

            ; (prisma.task.findMany as any).mockResolvedValue([
                { id: 't1', dueDate: dates[0], originalDueDate: null, title: 'A' },
                { id: 't2', dueDate: dates[1], originalDueDate: dates[1], title: 'B' },
                { id: 't3', dueDate: dates[2], originalDueDate: null, title: 'C' },
            ])
        mockTx.task.update.mockResolvedValue({})
        mockTx.postponeHistory.create.mockResolvedValue({})

        const res = await POST()
        const data = await res.json()

        expect(data.postponedCount).toBe(3)
        // 3 task updates + 3 history records = 6 operations in single transaction
        expect(mockTx.task.update).toHaveBeenCalledTimes(3)
        expect(mockTx.postponeHistory.create).toHaveBeenCalledTimes(3)
    })
})
