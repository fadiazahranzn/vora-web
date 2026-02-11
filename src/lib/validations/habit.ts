import { z } from 'zod'

export const habitFrequencySchema = z.enum(['DAILY', 'WEEKLY', 'MONTHLY'])

export const createHabitSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name max 100 characters'),
    categoryId: z.string().uuid('Invalid category'),
    color: z.string().min(1, 'Color is required'),
    frequency: habitFrequencySchema,
    targetValue: z.number().int().positive().optional(),
    targetUnit: z.string().optional(),
    weeklyDays: z.array(z.number().int().min(0).max(6)).optional(),
    monthlyDates: z.array(z.number().int().min(1).max(31)).optional(),
    reminderTime: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.frequency === 'DAILY') {
      if (data.targetValue === undefined || data.targetValue === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Target value is required for daily habits',
          path: ['targetValue'],
        })
      }
    }

    if (data.frequency === 'WEEKLY') {
      if (!data.weeklyDays || data.weeklyDays.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one day must be selected',
          path: ['weeklyDays'],
        })
      }
    }

    if (data.frequency === 'MONTHLY') {
      if (!data.monthlyDates || data.monthlyDates.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one date must be selected',
          path: ['monthlyDates'],
        })
      }
    }
  })

export const updateHabitSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name max 100 characters')
    .optional(),
  categoryId: z.string().uuid('Invalid category').optional(),
  color: z.string().min(1, 'Color is required').optional(),
  targetValue: z.number().int().positive().optional(),
  targetUnit: z.string().optional(),
  weeklyDays: z.array(z.number().int().min(0).max(6)).optional(),
  monthlyDates: z.array(z.number().int().min(1).max(31)).optional(),
  reminderTime: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})
