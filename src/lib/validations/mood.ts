import { z } from 'zod'

export const moodEnum = z.enum([
  'HAPPY',
  'PROUD',
  'WORRIED',
  'ANNOYED',
  'SAD',
  'ANGRY',
])
export const activityEnum = z.enum([
  'SHORT_BREAK',
  'DEEP_BREATHING',
  'CALMING_MUSIC',
  'TALK_TO_SOMEONE',
  'GO_FOR_WALK',
])

export const createMoodCheckinSchema = z.object({
  habitId: z.string().uuid(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  mood: moodEnum,
  reflectionText: z
    .string()
    .max(500, 'Reflection text must be 500 characters or less')
    .optional(),
  selectedActivity: activityEnum.optional().nullable(),
})

export const moodQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
})
