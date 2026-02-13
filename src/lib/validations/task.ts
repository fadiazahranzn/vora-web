import { z } from "zod";
import { Priority, Recurrence } from "@prisma/client";

const subTaskSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required").max(200),
    completedAt: z.string().nullable().optional(),
});

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
    priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
    dueDate: z.union([z.string(), z.date()])
        .optional()
        .nullable()
        .refine((val) => {
            if (!val) return true;
            const date = new Date(val);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
        }, "Due date must be today or in the future"),
    recurrence: z.nativeEnum(Recurrence).default(Recurrence.NONE),
    recurrenceRule: z.any().optional(),
    autoPostpone: z.boolean().default(false),
    parentTaskId: z.string().uuid().optional(),
    subTasks: z.array(subTaskSchema).max(20, "Maximum 20 sub-tasks allowed").optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").optional(),
    description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
    priority: z.nativeEnum(Priority).optional(),
    dueDate: z.union([z.string(), z.date()]).optional().nullable(),
    recurrence: z.nativeEnum(Recurrence).optional(),
    recurrenceRule: z.any().optional(),
    autoPostpone: z.boolean().optional(),
    completedAt: z.string().optional().nullable(),
    sortOrder: z.number().optional(),
    subTasks: z.array(subTaskSchema).max(20, "Maximum 20 sub-tasks allowed").optional(),
});
