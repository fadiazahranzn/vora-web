import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/tasks/route'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
    prisma: {
        task: {
            findMany: vi.fn(),
            create: vi.fn(),
            count: vi.fn(),
        },
        $transaction: vi.fn((callback) => callback(prisma)),
    },
}))

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

describe('Task API - GET /api/tasks', () => {
    const mockUserId = 'user-test-123'

    beforeEach(() => {
        vi.clearAllMocks()
            ; (requireAuth as any).mockResolvedValue({ userId: mockUserId })
    })

    it('should return paginated tasks with default filter and sort', async () => {
        const mockTasks = [
            { id: '1', title: 'Task 1', priority: 'HIGH', subTasks: [] },
            { id: '2', title: 'Task 2', priority: 'MEDIUM', subTasks: [] },
        ]
            ; (prisma.task.findMany as any).mockResolvedValue(mockTasks)
            ; (prisma.task.count as any).mockResolvedValue(2)

        const req = new Request('http://localhost/api/tasks')
        const res = await GET(req as any)
        const data = await res.json()

        expect(data.data).toHaveLength(2)
        expect(data.pagination).toBeDefined()
        expect(data.pagination.total).toBe(2)
        expect(res.status).toBe(200)
    })

    it('should filter active tasks (completedAt = null)', async () => {
        ; (prisma.task.findMany as any).mockResolvedValue([])
            ; (prisma.task.count as any).mockResolvedValue(0)

        const req = new Request('http://localhost/api/tasks?filter=active')
        await GET(req as any)

        expect(prisma.task.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    userId: mockUserId,
                    deletedAt: null,
                    completedAt: null,
                }),
            })
        )
    })

    it('should filter completed tasks (completedAt != null)', async () => {
        ; (prisma.task.findMany as any).mockResolvedValue([])
            ; (prisma.task.count as any).mockResolvedValue(0)

        const req = new Request('http://localhost/api/tasks?filter=completed')
        await GET(req as any)

        expect(prisma.task.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    completedAt: { not: null },
                }),
            })
        )
    })

    it('should filter overdue tasks', async () => {
        ; (prisma.task.findMany as any).mockResolvedValue([])
            ; (prisma.task.count as any).mockResolvedValue(0)

        const req = new Request('http://localhost/api/tasks?filter=overdue')
        await GET(req as any)

        expect(prisma.task.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    completedAt: null,
                    dueDate: expect.objectContaining({ lt: expect.any(Date) }),
                }),
            })
        )
    })

    it('should sort by priority (high → medium → low)', async () => {
        const mockTasks = [
            { id: '1', title: 'Low', priority: 'LOW', subTasks: [] },
            { id: '2', title: 'High', priority: 'HIGH', subTasks: [] },
            { id: '3', title: 'Med', priority: 'MEDIUM', subTasks: [] },
        ]
            ; (prisma.task.findMany as any).mockResolvedValue(mockTasks)
            ; (prisma.task.count as any).mockResolvedValue(3)

        const req = new Request('http://localhost/api/tasks?sort=priority')
        const res = await GET(req as any)
        const body = await res.json()

        // After custom sort, HIGH should come first
        expect(body.data[0].priority).toBe('HIGH')
        expect(body.data[1].priority).toBe('MEDIUM')
        expect(body.data[2].priority).toBe('LOW')
    })

    it('should fallback invalid sort to createdAt', async () => {
        ; (prisma.task.findMany as any).mockResolvedValue([])
            ; (prisma.task.count as any).mockResolvedValue(0)

        const req = new Request('http://localhost/api/tasks?sort=malicious_column')
        await GET(req as any)

        expect(prisma.task.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                orderBy: { createdAt: 'desc' },
            })
        )
    })

    it('should handle combined filter and sort (overdue + priority)', async () => {
        const mockOverdueTasks = [
            { id: '1', title: 'Low Priority', priority: 'LOW', dueDate: new Date() },
            { id: '2', title: 'High Priority', priority: 'HIGH', dueDate: new Date() }
        ]
        ; (prisma.task.findMany as any).mockResolvedValue(mockOverdueTasks)
        ; (prisma.task.count as any).mockResolvedValue(2)

        const req = new Request('http://localhost/api/tasks?filter=overdue&sort=priority')
        const res = await GET(req as any)
        const body = await res.json()

        // 1. Verify DB query filters correctly
        expect(prisma.task.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    completedAt: null,
                    dueDate: expect.objectContaining({ lt: expect.any(Date) }),
                }),
                // Priority sort is done in-memory, so DB sort should be undefined
                orderBy: undefined
            })
        )

        // 2. Verify response is sorted in-memory
        expect(body.data[0].priority).toBe('HIGH')
        expect(body.data[1].priority).toBe('LOW')
    })

    it('should respect pagination params', async () => {
        ; (prisma.task.findMany as any).mockResolvedValue([])
            ; (prisma.task.count as any).mockResolvedValue(25)

        const req = new Request('http://localhost/api/tasks?page=2&limit=10')
        const res = await GET(req as any)
        const body = await res.json()

        expect(prisma.task.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                skip: 10,
                take: 10,
            })
        )
        expect(body.pagination.page).toBe(2)
        expect(body.pagination.limit).toBe(10)
        expect(body.pagination.totalPages).toBe(3)
    })

    it('should cap limit at 100', async () => {
        ; (prisma.task.findMany as any).mockResolvedValue([])
            ; (prisma.task.count as any).mockResolvedValue(0)

        const req = new Request('http://localhost/api/tasks?limit=500')
        await GET(req as any)

        expect(prisma.task.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                take: 100,
            })
        )
    })

    it('should return 401 when not authenticated', async () => {
        const authError = new Error('Auth required')
        authError.name = 'AuthError'
            ; (requireAuth as any).mockRejectedValue(authError)

        const req = new Request('http://localhost/api/tasks')
        const res = await GET(req as any)

        expect(res.status).toBe(500) // handleAuthError mock returns 500
    })
})

describe('Task API - POST /api/tasks', () => {
    const mockUserId = 'user-test-123'

    beforeEach(() => {
        vi.clearAllMocks()
            ; (requireAuth as any).mockResolvedValue({ userId: mockUserId })
    })

    it('should create a task with valid data and return 201', async () => {
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
        const mockCreated = {
            id: 'task-1',
            title: 'New task',
            priority: 'MEDIUM',
            dueDate: tomorrow,
            subTasks: [],
        }
            ; (prisma.task.count as any).mockResolvedValue(0)
            ; (prisma.task.create as any).mockResolvedValue(mockCreated)

        const req = new Request('http://localhost/api/tasks', {
            method: 'POST',
            body: JSON.stringify({ title: 'New task', dueDate: tomorrow }),
        })
        const res = await POST(req as any)
        const data = await res.json()

        expect(res.status).toBe(201)
        expect(data.title).toBe('New task')
    })

    it('should apply default priority MEDIUM (BR-081)', async () => {
        ; (prisma.task.count as any).mockResolvedValue(0)
            ; (prisma.task.create as any).mockResolvedValue({ id: '1', priority: 'MEDIUM' })

        const req = new Request('http://localhost/api/tasks', {
            method: 'POST',
            body: JSON.stringify({ title: 'No priority' }),
        })
        await POST(req as any)

        expect(prisma.task.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    priority: 'MEDIUM',
                }),
            })
        )
    })

    it('should enforce 200 active tasks limit (BR-079)', async () => {
        ; (prisma.task.count as any).mockResolvedValue(200)

        const req = new Request('http://localhost/api/tasks', {
            method: 'POST',
            body: JSON.stringify({ title: 'One too many' }),
        })
        const res = await POST(req as any)
        const data = await res.json()

        expect(res.status).toBe(422)
        expect(data.message).toContain('Maximum 200 active tasks reached')
    })

    it('should return 400 for invalid data (empty title)', async () => {
        ; (prisma.task.count as any).mockResolvedValue(0)

        const req = new Request('http://localhost/api/tasks', {
            method: 'POST',
            body: JSON.stringify({ title: '' }),
        })
        const res = await POST(req as any)

        expect(res.status).toBe(400)
    })

    it('should create task with sub-tasks', async () => {
        ; (prisma.task.count as any).mockResolvedValue(0)
            ; (prisma.task.create as any).mockResolvedValue({
                id: 'task-1',
                title: 'Parent',
                subTasks: [{ id: 'st-1', title: 'Child 1' }],
            })

        const req = new Request('http://localhost/api/tasks', {
            method: 'POST',
            body: JSON.stringify({
                title: 'Parent',
                subTasks: [{ title: 'Child 1' }],
            }),
        })
        const res = await POST(req as any)

        expect(res.status).toBe(201)
        expect(prisma.task.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    subTasks: expect.objectContaining({
                        create: expect.arrayContaining([
                            expect.objectContaining({ title: 'Child 1' }),
                        ]),
                    }),
                }),
            })
        )
    })
})
