import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth'

/**
 * GET /api/categories
 * Returns a list of categories for the authenticated user with habit counts.
 */
export async function GET() {
  try {
    const { userId } = await requireAuth()

    const categories = await prisma.category.findMany({
      where: {
        userId,
        // Soft delete is handled by prisma middleware/extension if implemented,
        // but adding here explicitly if middleware is not fully trusted/ready
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            habits: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
    })

    // Formatting response to include habitCount
    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      defaultColor: cat.defaultColor,
      isDefault: cat.isDefault,
      sortOrder: cat.sortOrder,
      habitCount: cat._count.habits,
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    return handleAuthError(error)
  }
}
