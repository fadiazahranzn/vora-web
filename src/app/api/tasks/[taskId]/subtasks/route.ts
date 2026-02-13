import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, handleAuthError } from "@/lib/auth";
import { z } from "zod";

const createSubTaskSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
});

// ─── GET /api/tasks/:taskId/subtasks ────────────────────────────────
export async function GET(
    _req: NextRequest,
    { params }: { params: { taskId: string } }
) {
    try {
        const { userId } = await requireAuth();
        const { taskId } = await params;

        // Verify task ownership (row-level security)
        const task = await prisma.task.findFirst({
            where: { id: taskId, userId, deletedAt: null },
        });

        if (!task) {
            return NextResponse.json(
                { error: "Not Found", message: "Task not found" },
                { status: 404 }
            );
        }

        const subTasks = await prisma.subTask.findMany({
            where: { taskId },
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json(subTasks);
    } catch (error) {
        return handleAuthError(error);
    }
}

// ─── POST /api/tasks/:taskId/subtasks ───────────────────────────────
export async function POST(
    req: NextRequest,
    { params }: { params: { taskId: string } }
) {
    try {
        const { userId } = await requireAuth();
        const { taskId } = await params;
        const body = await req.json();

        const validatedData = createSubTaskSchema.parse(body);

        // Verify task ownership (row-level security)
        const task = await prisma.task.findFirst({
            where: { id: taskId, userId, deletedAt: null },
        });

        if (!task) {
            return NextResponse.json(
                { error: "Not Found", message: "Task not found" },
                { status: 404 }
            );
        }

        // Check 20 sub-task limit (BR-090)
        const currentCount = await prisma.subTask.count({
            where: { taskId },
        });

        if (currentCount >= 20) {
            return NextResponse.json(
                { error: "Unprocessable Entity", message: "Maximum 20 sub-tasks per task" },
                { status: 422 }
            );
        }

        // Determine next sortOrder
        const lastSubTask = await prisma.subTask.findFirst({
            where: { taskId },
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
        });
        const nextSortOrder = (lastSubTask?.sortOrder ?? -1) + 1;

        const subTask = await prisma.subTask.create({
            data: {
                taskId,
                title: validatedData.title,
                sortOrder: nextSortOrder,
            },
        });

        return NextResponse.json(subTask, { status: 201 });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation Error", details: error.errors },
                { status: 400 }
            );
        }
        return handleAuthError(error);
    }
}
