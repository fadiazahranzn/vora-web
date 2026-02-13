import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PATCH, DELETE } from '@/app/api/tasks/[id]/route'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Mock dependencies
vi.mock('@/lib/prisma', () => {
    const mockTx = {
        task: {
            update: vi.fn(),
            findUnique: vi.fn(),
        },
        subTask: {
            deleteMany: vi.fn(),
            update: vi.fn(),
            create: vi.fn(),
        },
    }
    return {
        prisma: {
            task: {
                findFirst: vi.fn(),
                update: vi.fn(),
                findUnique: vi.fn(),
            },
            subTask: {
                deleteMany: vi.fn(),
                update: vi.fn(),
                create: vi.fn(),
            },
            $transaction: vi.fn(async (callback) => callback(mockTx)),
            _mockTx: mockTx,
        },
    }
})

vi.mock('@/lib/auth', () => ({
    requireAuth: vi.fn(),
    handleAuthError: vi.fn((_error) => {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }),
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

vi.mock('@/lib/services/recurrence', () => ({
    processTaskRecurrence: vi.fn(),
}))

const mockUserId = 'user-test-456'
const mockTaskId = 'task-abc-123'

function createRequest(method: string, body?: any) {
    return new Request(`http://localhost/api/tasks/${mockTaskId}`, {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
    })
}

const mockParams = { params: Promise.resolve({ id: mockTaskId }) }

describe('Task API - GET /api/tasks/:id', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (requireAuth as any).mockResolvedValue({ userId: mockUserId })
    })

    it('should return a single task with sub-tasks', async () => {
        const mockTask = {
            id: mockTaskId,
            userId: mockUserId,
            title: 'Test Task',
            priority: 'HIGH',
            subTasks: [{ id: 'st-1', title: 'Sub 1' }],
        }
            ; (prisma.task.findFirst as any).mockResolvedValue(mockTask)

        const req = createRequest('GET')
        const res = await GET(req as any, mockParams as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.title).toBe('Test Task')
        expect(data.subTasks).toHaveLength(1)
    })

    it('should return 404 for non-existent task', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue(null)

        const req = createRequest('GET')
        const res = await GET(req as any, mockParams as any)

        expect(res.status).toBe(404)
    })

    it('should return 404 for another user\'s task (row-level security)', async () => {
        // findFirst with userId filter returns null for other user's tasks
        ; (prisma.task.findFirst as any).mockResolvedValue(null)

        const req = createRequest('GET')
        const res = await GET(req as any, mockParams as any)

        expect(res.status).toBe(404)
        expect(prisma.task.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    id: mockTaskId,
                    userId: mockUserId,
                    deletedAt: null,
                }),
            })
        )
    })

    it('should not return soft-deleted tasks', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue(null)

        const req = createRequest('GET')
        await GET(req as any, mockParams as any)

        expect(prisma.task.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    deletedAt: null,
                }),
            })
        )
    })
})

describe('Task API - PATCH /api/tasks/:id', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (requireAuth as any).mockResolvedValue({ userId: mockUserId })
    })

    it('should update task title', async () => {
        const existing = { id: mockTaskId, userId: mockUserId, title: 'Old' }
            ; (prisma.task.findFirst as any).mockResolvedValue(existing)

        const mockTx = (prisma as any)._mockTx
        mockTx.task.update.mockResolvedValue({})
        mockTx.task.findUnique.mockResolvedValue({ ...existing, title: 'Updated' })

        const req = createRequest('PATCH', { title: 'Updated' })
        const res = await PATCH(req as any, mockParams as any)

        expect(res.status).toBe(200)
    })

    it('should return 404 for non-existent task on update', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue(null)

        const req = createRequest('PATCH', { title: 'Updated' })
        const res = await PATCH(req as any, mockParams as any)

        expect(res.status).toBe(404)
    })

    it('should mark task as completed via PATCH', async () => {
        const existing = { id: mockTaskId, userId: mockUserId, completedAt: null }
            ; (prisma.task.findFirst as any).mockResolvedValue(existing)

        const mockTx = (prisma as any)._mockTx
        mockTx.task.update.mockResolvedValue({})
        mockTx.task.findUnique.mockResolvedValue({ ...existing, completedAt: new Date() })

        const completedAt = new Date().toISOString()
        const req = createRequest('PATCH', { completedAt })
        const res = await PATCH(req as any, mockParams as any)

        expect(res.status).toBe(200)
    })

    it('should uncomplete task by sending null completedAt', async () => {
        const existing = { id: mockTaskId, userId: mockUserId, completedAt: new Date() }
            ; (prisma.task.findFirst as any).mockResolvedValue(existing)

        const mockTx = (prisma as any)._mockTx
        mockTx.task.update.mockResolvedValue({})
        mockTx.task.findUnique.mockResolvedValue({ ...existing, completedAt: null })

        const req = createRequest('PATCH', { completedAt: null })
        const res = await PATCH(req as any, mockParams as any)

        expect(res.status).toBe(200)
    })

    it('should return 400 for invalid data on update', async () => {
        const existing = { id: mockTaskId, userId: mockUserId }
            ; (prisma.task.findFirst as any).mockResolvedValue(existing)

        const req = createRequest('PATCH', { title: 'x'.repeat(201) })
        const res = await PATCH(req as any, mockParams as any)

        expect(res.status).toBe(400)
    })

    it('should handle sub-task operations in transaction', async () => {
        const existing = { id: mockTaskId, userId: mockUserId, title: 'Task' }
            ; (prisma.task.findFirst as any).mockResolvedValue(existing)

        const mockTx = (prisma as any)._mockTx
        mockTx.task.update.mockResolvedValue({})
        mockTx.subTask.deleteMany.mockResolvedValue({ count: 0 })
        mockTx.subTask.create.mockResolvedValue({})
        mockTx.task.findUnique.mockResolvedValue({
            ...existing,
            subTasks: [{ id: 'new-st', title: 'New Sub' }],
        })

        const req = createRequest('PATCH', {
            subTasks: [{ title: 'New Sub' }],
        })
        const res = await PATCH(req as any, mockParams as any)

        expect(res.status).toBe(200)
        expect(prisma.$transaction).toHaveBeenCalled()
    })

    it('should trigger recurrence logic when task is marked as completed', async () => {
        const existing = { id: mockTaskId, userId: mockUserId, completedAt: null }
            ; (prisma.task.findFirst as any).mockResolvedValue(existing)

        const mockTx = (prisma as any)._mockTx
        mockTx.task.update.mockResolvedValue({})
        mockTx.task.findUnique.mockResolvedValue({ ...existing, completedAt: new Date() })

        const req = createRequest('PATCH', { completedAt: new Date().toISOString() })
        await PATCH(req as any, mockParams as any)

        const { processTaskRecurrence } = await import('@/lib/services/recurrence')
        expect(processTaskRecurrence).toHaveBeenCalledWith(mockTaskId, mockTx)
    })
})

describe('Task API - DELETE /api/tasks/:id (Soft Delete)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (requireAuth as any).mockResolvedValue({ userId: mockUserId })
    })

    it('should soft-delete a task (BR-102)', async () => {
        const existing = { id: mockTaskId, userId: mockUserId, deletedAt: null }
            ; (prisma.task.findFirst as any).mockResolvedValue(existing)
            ; (prisma.task.update as any).mockResolvedValue({ ...existing, deletedAt: new Date() })

        const req = createRequest('DELETE')
        const res = await DELETE(req as any, mockParams as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.message).toContain('deleted')
        expect(prisma.task.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: mockTaskId },
                data: expect.objectContaining({
                    deletedAt: expect.any(Date),
                }),
            })
        )
    })

    it('should return 404 for non-existent task on delete', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue(null)

        const req = createRequest('DELETE')
        const res = await DELETE(req as any, mockParams as any)

        expect(res.status).toBe(404)
    })

    it('should return 404 for already soft-deleted task', async () => {
        // findFirst with deletedAt: null will return null for already deleted tasks
        ; (prisma.task.findFirst as any).mockResolvedValue(null)

        const req = createRequest('DELETE')
        const res = await DELETE(req as any, mockParams as any)

        expect(res.status).toBe(404)
    })

    it('should enforce row-level security on delete', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue(null)

        const req = createRequest('DELETE')
        await DELETE(req as any, mockParams as any)

        expect(prisma.task.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    id: mockTaskId,
                    userId: mockUserId,
                    deletedAt: null,
                }),
            })
        )
    })
})
