import { z } from 'zod'
import { sanitizeTransform } from '@/lib/sanitize'

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters')
    .transform(sanitizeTransform),
  icon: z.string().emoji('Must be an emoji'),
  defaultColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
})

export const updateCategorySchema = createCategorySchema.partial()

export const reorderCategoriesSchema = z.object({
  orderedIds: z.array(z.string().uuid()),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type ReorderCategoriesInput = z.infer<typeof reorderCategoriesSchema>
