import { describe, it, expect } from 'vitest'
import { createTaskSchema, updateTaskSchema } from '@/lib/validations/task'

describe('Task Validation Schemas', () => {
    // ========== createTaskSchema ==========
    describe('createTaskSchema', () => {
        const validTask = {
            title: 'Buy groceries',
            description: 'Get milk and eggs',
            priority: 'MEDIUM',
            dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
            recurrence: 'NONE',
            autoPostpone: false,
        }

        // --- BR-077: Title required, max 200 chars ---
        it('should accept a valid task', () => {
            const result = createTaskSchema.safeParse(validTask)
            expect(result.success).toBe(true)
        })

        it('should reject empty title (BR-077)', () => {
            const result = createTaskSchema.safeParse({ ...validTask, title: '' })
            expect(result.success).toBe(false)
        })

        it('should reject whitespace-only title (BR-077)', () => {
            const result = createTaskSchema.safeParse({ ...validTask, title: '   ' })
            expect(result.success).toBe(false)
        })

        it('should reject title exceeding 200 characters (BR-077)', () => {
            const result = createTaskSchema.safeParse({ ...validTask, title: 'x'.repeat(201) })
            expect(result.success).toBe(false)
        })

        it('should accept title at exactly 200 characters (BR-077)', () => {
            const result = createTaskSchema.safeParse({ ...validTask, title: 'x'.repeat(200) })
            expect(result.success).toBe(true)
        })

        // --- BR-078: Description max 2000 chars ---
        it('should accept description up to 2000 chars (BR-078)', () => {
            const result = createTaskSchema.safeParse({ ...validTask, description: 'x'.repeat(2000) })
            expect(result.success).toBe(true)
        })

        it('should reject description exceeding 2000 chars (BR-078)', () => {
            const result = createTaskSchema.safeParse({ ...validTask, description: 'x'.repeat(2001) })
            expect(result.success).toBe(false)
        })

        it('should accept task without description', () => {
            const { description, ...noDesc } = validTask
            const result = createTaskSchema.safeParse(noDesc)
            expect(result.success).toBe(true)
        })

        // --- BR-080: Due date >= today on create ---
        it('should reject due date in the past (BR-080)', () => {
            const result = createTaskSchema.safeParse({
                ...validTask,
                dueDate: '2020-01-01',
            })
            expect(result.success).toBe(false)
        })

        it('should accept due date today (BR-080)', () => {
            const today = new Date()
            today.setHours(12, 0, 0, 0) // noon today
            const result = createTaskSchema.safeParse({
                ...validTask,
                dueDate: today.toISOString(),
            })
            expect(result.success).toBe(true)
        })

        it('should accept task without due date', () => {
            const { dueDate, ...noDue } = validTask
            const result = createTaskSchema.safeParse(noDue)
            expect(result.success).toBe(true)
        })

        it('should accept null due date', () => {
            const result = createTaskSchema.safeParse({ ...validTask, dueDate: null })
            expect(result.success).toBe(true)
        })

        // --- BR-081: Priority defaults to "medium" ---
        it('should default priority to MEDIUM (BR-081)', () => {
            const { priority, ...noPriority } = validTask
            const result = createTaskSchema.safeParse(noPriority)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.priority).toBe('MEDIUM')
            }
        })

        it('should accept HIGH priority', () => {
            const result = createTaskSchema.safeParse({ ...validTask, priority: 'HIGH' })
            expect(result.success).toBe(true)
        })

        it('should accept LOW priority', () => {
            const result = createTaskSchema.safeParse({ ...validTask, priority: 'LOW' })
            expect(result.success).toBe(true)
        })

        it('should reject invalid priority value', () => {
            const result = createTaskSchema.safeParse({ ...validTask, priority: 'URGENT' })
            expect(result.success).toBe(false)
        })

        // --- Recurrence ---
        it('should default recurrence to NONE', () => {
            const { recurrence, ...noRecurrence } = validTask
            const result = createTaskSchema.safeParse(noRecurrence)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.recurrence).toBe('NONE')
            }
        })

        it('should accept DAILY recurrence', () => {
            const result = createTaskSchema.safeParse({ ...validTask, recurrence: 'DAILY' })
            expect(result.success).toBe(true)
        })

        it('should accept WEEKLY recurrence', () => {
            const result = createTaskSchema.safeParse({ ...validTask, recurrence: 'WEEKLY' })
            expect(result.success).toBe(true)
        })

        // --- AutoPostpone ---
        it('should default autoPostpone to false', () => {
            const { autoPostpone, ...noAP } = validTask
            const result = createTaskSchema.safeParse(noAP)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.autoPostpone).toBe(false)
            }
        })

        // --- Sub-tasks (max 20) ---
        it('should accept up to 20 sub-tasks', () => {
            const subTasks = Array.from({ length: 20 }, (_, i) => ({ title: `Sub ${i + 1}` }))
            const result = createTaskSchema.safeParse({ ...validTask, subTasks })
            expect(result.success).toBe(true)
        })

        it('should reject more than 20 sub-tasks', () => {
            const subTasks = Array.from({ length: 21 }, (_, i) => ({ title: `Sub ${i + 1}` }))
            const result = createTaskSchema.safeParse({ ...validTask, subTasks })
            expect(result.success).toBe(false)
        })

        it('should reject sub-task with empty title', () => {
            const result = createTaskSchema.safeParse({
                ...validTask,
                subTasks: [{ title: '' }],
            })
            expect(result.success).toBe(false)
        })

        // --- Minimal valid task ---
        it('should accept minimal task with only title', () => {
            const result = createTaskSchema.safeParse({ title: 'Minimal' })
            expect(result.success).toBe(true)
        })
    })

    // ========== updateTaskSchema ==========
    describe('updateTaskSchema', () => {
        it('should accept partial update with only title', () => {
            const result = updateTaskSchema.safeParse({ title: 'Updated Title' })
            expect(result.success).toBe(true)
        })

        it('should accept partial update with only priority', () => {
            const result = updateTaskSchema.safeParse({ priority: 'HIGH' })
            expect(result.success).toBe(true)
        })

        it('should accept completedAt as ISO string', () => {
            const result = updateTaskSchema.safeParse({ completedAt: new Date().toISOString() })
            expect(result.success).toBe(true)
        })

        it('should accept null completedAt (uncomplete)', () => {
            const result = updateTaskSchema.safeParse({ completedAt: null })
            expect(result.success).toBe(true)
        })

        it('should accept sortOrder as number', () => {
            const result = updateTaskSchema.safeParse({ sortOrder: 5 })
            expect(result.success).toBe(true)
        })

        it('should accept null dueDate (remove due date)', () => {
            const result = updateTaskSchema.safeParse({ dueDate: null })
            expect(result.success).toBe(true)
        })

        it('should accept past dueDate in update (no future restriction on update)', () => {
            const result = updateTaskSchema.safeParse({ dueDate: '2020-01-01' })
            expect(result.success).toBe(true)
        })

        it('should accept empty object (no-op update)', () => {
            const result = updateTaskSchema.safeParse({})
            expect(result.success).toBe(true)
        })

        it('should reject title exceeding 200 characters', () => {
            const result = updateTaskSchema.safeParse({ title: 'x'.repeat(201) })
            expect(result.success).toBe(false)
        })

        it('should reject description exceeding 2000 characters', () => {
            const result = updateTaskSchema.safeParse({ description: 'x'.repeat(2001) })
            expect(result.success).toBe(false)
        })

        it('should accept sub-tasks array in update', () => {
            const result = updateTaskSchema.safeParse({
                subTasks: [
                    { id: 'abc-123', title: 'Existing', completedAt: null },
                    { title: 'New sub-task' },
                ],
            })
            expect(result.success).toBe(true)
        })
    })
})
