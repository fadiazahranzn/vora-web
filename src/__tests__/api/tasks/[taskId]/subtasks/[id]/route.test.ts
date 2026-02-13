import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PATCH, DELETE } from '@/app/api/tasks/[taskId]/subtasks/[id]/route'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

vi.mock('@/lib/services/recurrence', () => ({
    processTaskRecurrence: vi.fn(),
}))

// Mock transaction helper
const mockTx = {
    task: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
    },
    subTask: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
    },
}

vi.mock('@/lib/prisma', () => ({
    prisma: {
        task: {
            findFirst: vi.fn(),
        },
        subTask: {
            findFirst: vi.fn(),
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

const mockUserId = 'user-sub-456'
const mockTaskId = 'task-parent-789'
const mockSubTaskId = 'subtask-abc'
const mockParams = {
    params: Promise.resolve({ taskId: mockTaskId, id: mockSubTaskId }),
}

describe('Sub-task API - PATCH /api/tasks/:taskId/subtasks/:id', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (requireAuth as any).mockResolvedValue({ userId: mockUserId })
    })

    it('should update sub-task title', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({
            id: mockTaskId,
            userId: mockUserId,
            completedAt: null,
        })
            ; (prisma.subTask.findFirst as any).mockResolvedValue({
                id: mockSubTaskId,
                taskId: mockTaskId,
                completedAt: null,
            })

        mockTx.subTask.update.mockResolvedValue({
            id: mockSubTaskId,
            title: 'Updated',
        })
        mockTx.task.findUnique.mockResolvedValue({ completedAt: null })

        const req = new Request(
            `http://localhost/api/tasks/${mockTaskId}/subtasks/${mockSubTaskId}`,
            { method: 'PATCH', body: JSON.stringify({ title: 'Updated' }) }
        )
        const res = await PATCH(req as any, mockParams as any)

        expect(res.status).toBe(200)
    })

    it('should auto-complete parent when last sub-task is completed (BR-086)', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({
            id: mockTaskId,
            userId: mockUserId,
            completedAt: null, // parent not completed yet
        })
            ; (prisma.subTask.findFirst as any).mockResolvedValue({
                id: mockSubTaskId,
                taskId: mockTaskId,
                completedAt: null, // this sub-task is not yet complete
            })

        mockTx.subTask.update.mockResolvedValue({
            id: mockSubTaskId,
            completedAt: new Date(),
        })
        // After completing this sub-task, no incomplete sub-tasks remain
        mockTx.subTask.count.mockResolvedValue(0)
        mockTx.task.update.mockResolvedValue({})
        mockTx.task.findUnique.mockResolvedValue({
            completedAt: new Date(),
        })

        const req = new Request(
            `http://localhost/api/tasks/${mockTaskId}/subtasks/${mockSubTaskId}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ completedAt: new Date().toISOString() }),
            }
        )
        const res = await PATCH(req as any, mockParams as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        // Parent should have been auto-completed
        expect(mockTx.task.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: mockTaskId },
                data: expect.objectContaining({
                    completedAt: expect.any(Date),
                }),
            })
        )
        expect(data.parentCompletedAt).toBeTruthy()

        const { processTaskRecurrence } = await import('@/lib/services/recurrence')
        expect(processTaskRecurrence).toHaveBeenCalledWith(mockTaskId, mockTx)
    })

    it('should NOT auto-complete parent if other sub-tasks are still incomplete', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({
            id: mockTaskId,
            userId: mockUserId,
            completedAt: null,
        })
            ; (prisma.subTask.findFirst as any).mockResolvedValue({
                id: mockSubTaskId,
                taskId: mockTaskId,
                completedAt: null,
            })

        mockTx.subTask.update.mockResolvedValue({
            id: mockSubTaskId,
            completedAt: new Date(),
        })
        // 2 other sub-tasks are still incomplete
        mockTx.subTask.count.mockResolvedValue(2)
        mockTx.task.findUnique.mockResolvedValue({ completedAt: null })

        const req = new Request(
            `http://localhost/api/tasks/${mockTaskId}/subtasks/${mockSubTaskId}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ completedAt: new Date().toISOString() }),
            }
        )
        const res = await PATCH(req as any, mockParams as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(mockTx.task.update).not.toHaveBeenCalled()
        expect(data.parentCompletedAt).toBeNull()
    })

    it('should revert parent completion when sub-task is uncompleted', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({
            id: mockTaskId,
            userId: mockUserId,
            completedAt: new Date(), // parent was auto-completed
        })
            ; (prisma.subTask.findFirst as any).mockResolvedValue({
                id: mockSubTaskId,
                taskId: mockTaskId,
                completedAt: new Date(), // sub-task was completed
            })

        mockTx.subTask.update.mockResolvedValue({
            id: mockSubTaskId,
            completedAt: null,
        })
        mockTx.task.update.mockResolvedValue({})
        mockTx.task.findUnique.mockResolvedValue({ completedAt: null })

        const req = new Request(
            `http://localhost/api/tasks/${mockTaskId}/subtasks/${mockSubTaskId}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ completedAt: null }),
            }
        )
        const res = await PATCH(req as any, mockParams as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        // Parent should have been reverted
        expect(mockTx.task.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: mockTaskId },
                data: { completedAt: null },
            })
        )
        expect(data.parentCompletedAt).toBeNull()
    })

    it('should return 404 if parent task not found (row-level security)', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue(null)

        const req = new Request(
            `http://localhost/api/tasks/${mockTaskId}/subtasks/${mockSubTaskId}`,
            { method: 'PATCH', body: JSON.stringify({ title: 'X' }) }
        )
        const res = await PATCH(req as any, mockParams as any)

        expect(res.status).toBe(404)
    })

    it('should return 404 if sub-task not found', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({
            id: mockTaskId,
            userId: mockUserId,
        })
            ; (prisma.subTask.findFirst as any).mockResolvedValue(null)

        const req = new Request(
            `http://localhost/api/tasks/${mockTaskId}/subtasks/${mockSubTaskId}`,
            { method: 'PATCH', body: JSON.stringify({ title: 'X' }) }
        )
        const res = await PATCH(req as any, mockParams as any)

        expect(res.status).toBe(404)
    })

    it('should NOT cascade completion to sub-tasks when parent is manually completed (BR-087)', async () => {
        // This test verifies the PATCH endpoint only modifies the specified sub-task
        // and does NOT auto-complete other sub-tasks when parent is completed
        ; (prisma.task.findFirst as any).mockResolvedValue({
            id: mockTaskId,
            userId: mockUserId,
            completedAt: null,
        })
            ; (prisma.subTask.findFirst as any).mockResolvedValue({
                id: mockSubTaskId,
                taskId: mockTaskId,
                completedAt: null,
            })

        mockTx.subTask.update.mockResolvedValue({ id: mockSubTaskId, title: 'Renamed' })
        mockTx.task.findUnique.mockResolvedValue({ completedAt: null })

        const req = new Request(
            `http://localhost/api/tasks/${mockTaskId}/subtasks/${mockSubTaskId}`,
            { method: 'PATCH', body: JSON.stringify({ title: 'Renamed' }) }
        )
        await PATCH(req as any, mockParams as any)

        // Should NOT have updated any other sub-tasks
        expect(mockTx.subTask.update).toHaveBeenCalledTimes(1)
        expect(mockTx.subTask.update).toHaveBeenCalledWith(
            expect.objectContaining({ where: { id: mockSubTaskId } })
        )
    })
})

describe('Sub-task API - DELETE /api/tasks/:taskId/subtasks/:id', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (requireAuth as any).mockResolvedValue({ userId: mockUserId })
    })

    it('should delete a sub-task', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({
            id: mockTaskId,
            userId: mockUserId,
            completedAt: null,
        })
            ; (prisma.subTask.findFirst as any).mockResolvedValue({
                id: mockSubTaskId,
                taskId: mockTaskId,
            })

        mockTx.subTask.delete.mockResolvedValue({})
        mockTx.subTask.findMany.mockResolvedValue([])

        const req = new Request(
            `http://localhost/api/tasks/${mockTaskId}/subtasks/${mockSubTaskId}`,
            { method: 'DELETE' }
        )
        const res = await DELETE(req as any, mockParams as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.message).toContain('deleted')
    })

    it('should auto-complete parent if remaining sub-tasks are all completed after delete', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({
            id: mockTaskId,
            userId: mockUserId,
            completedAt: null, // parent not completed
        })
            ; (prisma.subTask.findFirst as any).mockResolvedValue({
                id: mockSubTaskId,
                taskId: mockTaskId,
                completedAt: null, // deleting an incomplete one
            })

        mockTx.subTask.delete.mockResolvedValue({})
        // After delete, remaining sub-tasks are all completed
        mockTx.subTask.findMany.mockResolvedValue([
            { completedAt: new Date() },
            { completedAt: new Date() },
        ])
        mockTx.task.update.mockResolvedValue({})

        const req = new Request(
            `http://localhost/api/tasks/${mockTaskId}/subtasks/${mockSubTaskId}`,
            { method: 'DELETE' }
        )
        await DELETE(req as any, mockParams as any)

        expect(mockTx.task.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: mockTaskId },
                data: expect.objectContaining({
                    completedAt: expect.any(Date),
                }),
            })
        )

        const { processTaskRecurrence } = await import('@/lib/services/recurrence')
        expect(processTaskRecurrence).toHaveBeenCalledWith(mockTaskId, mockTx)
    })

    it('should return 404 if parent task not found', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue(null)

        const req = new Request(
            `http://localhost/api/tasks/${mockTaskId}/subtasks/${mockSubTaskId}`,
            { method: 'DELETE' }
        )
        const res = await DELETE(req as any, mockParams as any)

        expect(res.status).toBe(404)
    })

    it('should return 404 if sub-task not found', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({
            id: mockTaskId,
            userId: mockUserId,
        })
            ; (prisma.subTask.findFirst as any).mockResolvedValue(null)

        const req = new Request(
            `http://localhost/api/tasks/${mockTaskId}/subtasks/${mockSubTaskId}`,
            { method: 'DELETE' }
        )
        const res = await DELETE(req as any, mockParams as any)

        expect(res.status).toBe(404)
    })
})
