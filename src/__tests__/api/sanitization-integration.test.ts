import { describe, it, expect, vi } from 'vitest'
import { POST } from '@/app/api/habits/route'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/lib/auth', () => ({
  requireAuth: vi.fn().mockResolvedValue({ userId: 'test-user-id' }),
  handleAuthError: vi.fn((error: Error) => {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
    })
  }),
}))

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    habit: {
      count: vi.fn().mockResolvedValue(0),
      create: vi.fn().mockImplementation((data: any) => ({
        ...data.data,
        id: 'test-habit-id',
        userId: 'test-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isActive: true,
        sortOrder: 0,
        category: {
          id: data.data.categoryId,
          name: 'Test Category',
          icon: '💪',
          defaultColor: '#FF0000',
        },
      })),
    },
    category: {
      findFirst: vi.fn().mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Category',
        userId: 'test-user-id',
        deletedAt: null,
      }),
    },
  },
}))

describe('API Input Sanitization', () => {
  describe('POST /api/habits', () => {
    it('should sanitize habit name with script tags', async () => {
      const request = new NextRequest('http://localhost:3000/api/habits', {
        method: 'POST',
        body: JSON.stringify({
          name: '<script>alert("xss")</script>Morning Run',
          categoryId: '123e4567-e89b-12d3-a456-426614174000',
          color: '#FF0000',
          frequency: 'DAILY',
          targetValue: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe('Morning Run')
      expect(data.name).not.toContain('<script>')
      expect(data.name).not.toContain('alert')
    })

    it('should sanitize habit name with HTML tags', async () => {
      const request = new NextRequest('http://localhost:3000/api/habits', {
        method: 'POST',
        body: JSON.stringify({
          name: '<b>Bold</b> Habit <i>Name</i>',
          categoryId: '123e4567-e89b-12d3-a456-426614174000',
          color: '#FF0000',
          frequency: 'DAILY',
          targetValue: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe('Bold Habit Name')
      expect(data.name).not.toContain('<b>')
      expect(data.name).not.toContain('<i>')
    })

    it('should sanitize targetUnit field', async () => {
      const request = new NextRequest('http://localhost:3000/api/habits', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Running',
          categoryId: '123e4567-e89b-12d3-a456-426614174000',
          color: '#FF0000',
          frequency: 'DAILY',
          targetValue: 5,
          targetUnit: '<script>alert("xss")</script>km',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.targetUnit).toBe('km')
      expect(data.targetUnit).not.toContain('<script>')
    })

    it('should preserve safe habit names', async () => {
      const request = new NextRequest('http://localhost:3000/api/habits', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Morning Meditation',
          categoryId: '123e4567-e89b-12d3-a456-426614174000',
          color: '#FF0000',
          frequency: 'DAILY',
          targetValue: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe('Morning Meditation')
    })

    it('should handle multiple XSS attempts', async () => {
      const request = new NextRequest('http://localhost:3000/api/habits', {
        method: 'POST',
        body: JSON.stringify({
          name: '<img src=x onerror="alert(1)"><script>alert(2)</script>Test',
          categoryId: '123e4567-e89b-12d3-a456-426614174000',
          color: '#FF0000',
          frequency: 'DAILY',
          targetValue: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe('Test')
      expect(data.name).not.toContain('onerror')
      expect(data.name).not.toContain('alert')
      expect(data.name).not.toContain('<script>')
      expect(data.name).not.toContain('<img>')
    })
  })
})
