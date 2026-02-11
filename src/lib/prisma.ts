import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const softDeleteModels = [
  'User',
  'Category',
  'Habit',
  'HabitCompletion',
  'MoodCheckin',
  'Task',
]

const camelCase = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

// Prisma v7 requires a driver adapter for the default "client" engine.
const prismaClientSingleton = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  const adapter = new PrismaPg(pool)

  const client = new PrismaClient({
    adapter,
  })

  return client.$extends({
    name: 'soft-delete',
    query: {
      $allModels: {
        async delete({ model, args, query }) {
          if (softDeleteModels.includes(model)) {
            return (client as any)[camelCase(model)].update({
              ...args,
              data: { deletedAt: new Date() },
            })
          }
          return query(args)
        },
        async deleteMany({ model, args, query }) {
          if (softDeleteModels.includes(model)) {
            return (client as any)[camelCase(model)].updateMany({
              ...args,
              data: { deletedAt: new Date() },
            })
          }
          return query(args)
        },
        async findUnique({ model, args, query }) {
          if (softDeleteModels.includes(model)) {
            return (client as any)[camelCase(model)].findFirst({
              ...args,
              where: { deletedAt: null, ...args.where },
            })
          }
          return query(args)
        },
        async findFirst({ model, args, query }) {
          if (softDeleteModels.includes(model)) {
            args.where = { deletedAt: null, ...args.where }
          }
          return query(args)
        },
        async findMany({ model, args, query }) {
          if (softDeleteModels.includes(model)) {
            args.where = { deletedAt: null, ...args.where }
          }
          return query(args)
        },
        async count({ model, args, query }) {
          if (softDeleteModels.includes(model)) {
            args.where = { deletedAt: null, ...args.where }
          }
          return query(args)
        },
      },
    },
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = global as unknown as { prisma: PrismaClientSingleton }

export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
