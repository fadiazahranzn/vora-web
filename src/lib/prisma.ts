import { env } from './env';
import { PrismaClient } from '@prisma/client';

const softDeleteModels = [
    'User',
    'Category',
    'Habit',
    'HabitCompletion',
    'MoodCheckin',
    'Task',
];


const camelCase = (str: string) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
};

const prismaClientSingleton = () => {
    const client = new PrismaClient({
        log: ['query'],
    });

    return client.$extends({
        name: 'soft-delete',
        query: {
            $allModels: {
                async delete({ model, args, query }) {
                    if (softDeleteModels.includes(model)) {
                        return (client as any)[camelCase(model)].update({
                            ...args,
                            data: { deletedAt: new Date() },
                        });
                    }
                    return query(args);
                },
                async deleteMany({ model, args, query }) {
                    if (softDeleteModels.includes(model)) {
                        return (client as any)[camelCase(model)].updateMany({
                            ...args,
                            data: { deletedAt: new Date() },
                        });
                    }
                    return query(args);
                },
                async findUnique({ model, args, query }) {
                    if (softDeleteModels.includes(model)) {
                        // Change to findFirst to allow filtering
                        // We must apply the filter manually because we are using the base client
                        return (client as any)[camelCase(model)].findFirst({
                            ...args,
                            where: { deletedAt: null, ...args.where }
                        });
                    }
                    return query(args);
                },
                async findFirst({ model, args, query }) {
                    if (softDeleteModels.includes(model)) {
                        args.where = { deletedAt: null, ...args.where };
                    }
                    return query(args);
                },
                async findMany({ model, args, query }) {
                    if (softDeleteModels.includes(model)) {
                        args.where = { deletedAt: null, ...args.where };
                    }
                    return query(args);
                },
                async count({ model, args, query }) {
                    if (softDeleteModels.includes(model)) {
                        args.where = { deletedAt: null, ...args.where };
                    }
                    return query(args);
                }
            },
        },
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = global as unknown as { prisma: PrismaClientSingleton };

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
