import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth'
import { reorderCategoriesSchema } from '@/lib/validations/category'
import { z } from 'zod'

/**
 * PATCH /api/categories/reorder
 * Atomic sort_order updates for a list of categories.
 */
export async function PATCH(req: Request) {
  try {
    const { userId } = await requireAuth()
    const body = await req.json()

    // 1. Validate Input
    const { orderedIds } = reorderCategoriesSchema.parse(body)

    // 2. Atomic update in transaction
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.category.update({
          where: { id, userId },
          data: { sortOrder: index },
        })
      )
    )

    return NextResponse.json({ message: 'Sort order updated' })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    return handleAuthError(error)
  }
}
