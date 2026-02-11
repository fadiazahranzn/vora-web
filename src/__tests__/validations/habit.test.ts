import { describe, it, expect } from 'vitest'
import { createHabitSchema } from '@/lib/validations/habit'

describe('Habit Validation Schema', () => {
  const validBaseHabit = {
    name: 'Valid Habit',
    categoryId: '3e3d4847-af03-46c0-bff7-5a109a13da94', // UUID
    color: 'red',
    reminderTime: undefined,
  }

  // --- DAILY ---
  it('should validate valid DAILY habit with targetValue', () => {
    const data = {
      ...validBaseHabit,
      frequency: 'DAILY',
      targetValue: 1, // Required
      targetUnit: 'times',
    }
    const result = createHabitSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should fail DAILY habit if targetValue is missing', () => {
    const data = {
      ...validBaseHabit,
      frequency: 'DAILY',
      targetValue: undefined,
    }
    const result = createHabitSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.targetValue).toBeDefined()
    }
  })

  // --- WEEKLY ---
  it('should validate valid WEEKLY habit with weeklyDays', () => {
    const data = {
      ...validBaseHabit,
      frequency: 'WEEKLY',
      weeklyDays: [0, 2, 4], // Mon, Wed, Fri
    }
    const result = createHabitSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should fail WEEKLY habit if no days selected', () => {
    const data = {
      ...validBaseHabit,
      frequency: 'WEEKLY',
      weeklyDays: [],
    }
    const result = createHabitSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.weeklyDays).toBeDefined()
    }
  })

  // --- MONTHLY ---
  it('should validate valid MONTHLY habit with monthlyDates', () => {
    const data = {
      ...validBaseHabit,
      frequency: 'MONTHLY',
      monthlyDates: [1, 15, 31],
    }
    const result = createHabitSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should fail MONTHLY habit if no dates selected', () => {
    const data = {
      ...validBaseHabit,
      frequency: 'MONTHLY',
      monthlyDates: [],
    }
    const result = createHabitSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.monthlyDates).toBeDefined()
    }
  })

  // --- General ---
  it('should fail if name is empty', () => {
    const data = {
      ...validBaseHabit,
      name: '',
      frequency: 'DAILY',
      targetValue: 1,
    }
    const result = createHabitSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('should fail if categoryId is invalid UUID', () => {
    const data = {
      ...validBaseHabit,
      categoryId: 'invalid-uuid',
      frequency: 'DAILY',
      targetValue: 1,
    }
    const result = createHabitSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})
