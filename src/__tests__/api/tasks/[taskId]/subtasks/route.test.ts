import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/tasks/[taskId]/subtasks/route'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
    prisma: {
        task: {
            findFirst: vi.fn(),
        },
        subTask: {
            findMany: vi.fn(),
            findFirst: vi.fn(),
            create: vi.fn(),
            count: vi.fn(),
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

const mockUserId = 'user-sub-123'
const mockTaskId = 'task-parent-456'
const mockParams = { params: Promise.resolve({ taskId: mockTaskId }) }

describe('Sub-task API - GET /api/tasks/:taskId/subtasks', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (requireAuth as any).mockResolvedValue({ userId: mockUserId })
    })

    it('should return sub-tasks ordered by sortOrder', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({ id: mockTaskId, userId: mockUserId })
            ; (prisma.subTask.findMany as any).mockResolvedValue([
                { id: 'st-1', title: 'First', sortOrder: 0 },
                { id: 'st-2', title: 'Second', sortOrder: 1 },
            ])

        const req = new Request(`http://localhost/api/tasks/${mockTaskId}/subtasks`)
        const res = await GET(req as any, mockParams as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data).toHaveLength(2)
        expect(prisma.subTask.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { taskId: mockTaskId },
                orderBy: { sortOrder: 'asc' },
            })
        )
    })

    it('should return 404 if task not found (row-level security)', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue(null)

        const req = new Request(`http://localhost/api/tasks/${mockTaskId}/subtasks`)
        const res = await GET(req as any, mockParams as any)

        expect(res.status).toBe(404)
    })
})

describe('Sub-task API - POST /api/tasks/:taskId/subtasks', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (requireAuth as any).mockResolvedValue({ userId: mockUserId })
    })

    it('should create a sub-task with auto-assigned sortOrder', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({ id: mockTaskId, userId: mockUserId })
            ; (prisma.subTask.count as any).mockResolvedValue(2)
            ; (prisma.subTask.findFirst as any).mockResolvedValue({ sortOrder: 1 })
            ; (prisma.subTask.create as any).mockResolvedValue({
                id: 'st-new',
                title: 'New sub-task',
                sortOrder: 2,
            })

        const req = new Request(`http://localhost/api/tasks/${mockTaskId}/subtasks`, {
            method: 'POST',
            body: JSON.stringify({ title: 'New sub-task' }),
        })
        const res = await POST(req as any, mockParams as any)
        const data = await res.json()

        expect(res.status).toBe(201)
        expect(data.title).toBe('New sub-task')
        expect(prisma.subTask.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    taskId: mockTaskId,
                    title: 'New sub-task',
                    sortOrder: 2,
                }),
            })
        )
    })

    it('should enforce 20 sub-task limit (BR-090)', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({ id: mockTaskId, userId: mockUserId })
            ; (prisma.subTask.count as any).mockResolvedValue(20)

        const req = new Request(`http://localhost/api/tasks/${mockTaskId}/subtasks`, {
            method: 'POST',
            body: JSON.stringify({ title: 'One too many' }),
        })
        const res = await POST(req as any, mockParams as any)
        const data = await res.json()

        expect(res.status).toBe(422)
        expect(data.message).toContain('Maximum 20 sub-tasks')
    })

    it('should return 404 if parent task not found', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue(null)

        const req = new Request(`http://localhost/api/tasks/${mockTaskId}/subtasks`, {
            method: 'POST',
            body: JSON.stringify({ title: 'Orphan' }),
        })
        const res = await POST(req as any, mockParams as any)

        expect(res.status).toBe(404)
    })

    it('should return 400 for empty title', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({ id: mockTaskId, userId: mockUserId })

        const req = new Request(`http://localhost/api/tasks/${mockTaskId}/subtasks`, {
            method: 'POST',
            body: JSON.stringify({ title: '' }),
        })
        const res = await POST(req as any, mockParams as any)

        expect(res.status).toBe(400)
    })

    it('should return 400 for whitespace-only title', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({ id: mockTaskId, userId: mockUserId })

        const req = new Request(`http://localhost/api/tasks/${mockTaskId}/subtasks`, {
            method: 'POST',
            body: JSON.stringify({ title: '   ' }),
        })
        const res = await POST(req as any, mockParams as any)

        expect(res.status).toBe(400)
    })

    it('should assign sortOrder 0 for first sub-task', async () => {
        ; (prisma.task.findFirst as any).mockResolvedValue({ id: mockTaskId, userId: mockUserId })
            ; (prisma.subTask.count as any).mockResolvedValue(0)
            ; (prisma.subTask.findFirst as any).mockResolvedValue(null) // no existing
            ; (prisma.subTask.create as any).mockResolvedValue({ id: 'st-1', sortOrder: 0 })

        const req = new Request(`http://localhost/api/tasks/${mockTaskId}/subtasks`, {
            method: 'POST',
            body: JSON.stringify({ title: 'First one' }),
        })
        await POST(req as any, mockParams as any)

        expect(prisma.subTask.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ sortOrder: 0 }),
            })
        )
    })
})
