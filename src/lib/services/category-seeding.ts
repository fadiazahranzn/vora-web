import { Prisma } from '@prisma/client'

export const DEFAULT_CATEGORIES = [
  {
    name: 'Health',
    icon: '💪',
    defaultColor: '#22C55E',
    isDefault: false,
    sortOrder: 0,
  },
  {
    name: 'Work',
    icon: '💼',
    defaultColor: '#3B82F6',
    isDefault: false,
    sortOrder: 1,
  },
  {
    name: 'Personal',
    icon: '🏠',
    defaultColor: '#A855F7',
    isDefault: true,
    sortOrder: 2,
  },
  {
    name: 'Learning',
    icon: '📚',
    defaultColor: '#F97316',
    isDefault: false,
    sortOrder: 3,
  },
]

export async function seedDefaultCategories(
  userId: string,
  tx: Prisma.TransactionClient
) {
  // Check if categories already exist to prevent duplicate seeding (idempotency)
  const existingCount = await tx.category.count({
    where: { userId },
  })

  if (existingCount > 0) return

  return tx.category.createMany({
    data: DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      userId,
    })),
  })
}
