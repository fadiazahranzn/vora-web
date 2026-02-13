import { describe, it, expect } from 'vitest'
import { createMoodCheckinSchema } from '@/lib/validations/mood'

describe('Mood Validation', () => {
    it('should validate a valid mood check-in', () => {
        const validData = {
            habitId: '123e4567-e89b-12d3-a456-426614174000',
            date: '2026-02-12',
            mood: 'HAPPY',
            reflectionText: 'Great day!',
            selectedActivity: 'SHORT_BREAK',
        }
        const result = createMoodCheckinSchema.safeParse(validData)
        expect(result.success).toBe(true)
    })

    it('should transform frontend activity IDs to backend enums', () => {
        const data = {
            habitId: '123e4567-e89b-12d3-a456-426614174000',
            date: '2026-02-12',
            mood: 'HAPPY',
            selectedActivity: 'hydrate', // Frontend ID
        }
        const result = createMoodCheckinSchema.safeParse(data)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.selectedActivity).toBe('STAY_HYDRATED')
        }
    })

    it('should accept null selectedActivity', () => {
        const data = {
            habitId: '123e4567-e89b-12d3-a456-426614174000',
            date: '2026-02-12',
            mood: 'SAD',
            selectedActivity: null,
        }
        const result = createMoodCheckinSchema.safeParse(data)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.selectedActivity).toBeNull()
        }
    })

    it('should fail with invalid mood', () => {
        const data = {
            habitId: '123e4567-e89b-12d3-a456-426614174000',
            date: '2026-02-12',
            mood: 'INVALID_MOOD',
        }
        const result = createMoodCheckinSchema.safeParse(data)
        expect(result.success).toBe(false)
    })

    it('should fail if reflection text is too long', () => {
        const data = {
            habitId: '123e4567-e89b-12d3-a456-426614174000',
            date: '2026-02-12',
            mood: 'HAPPY',
            reflectionText: 'a'.repeat(501),
        }
        const result = createMoodCheckinSchema.safeParse(data)
        expect(result.success).toBe(false)
    })
})
