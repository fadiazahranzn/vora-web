import { z } from 'zod'
import { sanitizeOptionalInput } from '@/lib/sanitize'

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
  'STAY_HYDRATED',
])

const activityMap: Record<string, z.infer<typeof activityEnum>> = {
  break: 'SHORT_BREAK',
  breathe: 'DEEP_BREATHING',
  music: 'CALMING_MUSIC',
  talk: 'TALK_TO_SOMEONE',
  walk: 'GO_FOR_WALK',
  hydrate: 'STAY_HYDRATED',
}

export const createMoodCheckinSchema = z.object({
  habitId: z.string().uuid(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  mood: moodEnum,
  reflectionText: z
    .string()
    .max(500, 'Reflection text must be 500 characters or less')
    .optional()
    .transform(sanitizeOptionalInput),
  selectedActivity: z
    .preprocess((val) => {
      if (typeof val === 'string' && activityMap[val]) {
        return activityMap[val]
      }
      return val
    }, activityEnum.optional().nullable())
    .optional(),
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
