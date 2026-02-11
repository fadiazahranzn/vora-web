import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations/auth'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 1. Validate input
    const validatedData = registerSchema.parse(body)
    const { name, email, password } = validatedData

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // 3. Hash password
    const passwordHash = await hash(password, 12)

    // 4. Create user and seed default categories in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      })

      // Seed default categories (BR-041)
      const defaultCategories = [
        {
          name: 'Health',
          icon: '💪',
          defaultColor: '#4ADE80',
          isDefault: true,
          sortOrder: 0,
        },
        {
          name: 'Work',
          icon: '💼',
          defaultColor: '#60A5FA',
          isDefault: true,
          sortOrder: 1,
        },
        {
          name: 'Personal',
          icon: '🏠',
          defaultColor: '#F472B6',
          isDefault: true,
          sortOrder: 2,
        },
        {
          name: 'Learning',
          icon: '📚',
          defaultColor: '#FBBF24',
          isDefault: true,
          sortOrder: 3,
        },
      ]

      await tx.category.createMany({
        data: defaultCategories.map((cat) => ({
          ...cat,
          userId: newUser.id,
        })),
      })

      return newUser
    })

    // 5. Return success response (excluding password hash)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation failed', errors: error.issues },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred during registration' },
      { status: 500 }
    )
  }
}
