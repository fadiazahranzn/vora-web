import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, handleAuthError } from "@/lib/auth";

/**
 * POST /api/tasks/auto-postpone
 *
 * Auto-postpone engine: finds all overdue tasks with autoPostpone=true
 * and moves their dueDate to today. Preserves originalDueDate and
 * creates PostponeHistory records.
 *
 * Business Rules:
 * - BR-089: Moves overdue task due date to current date
 * - BR-091: originalDueDate preserved on first postpone
 * - BR-092: PostponeHistory tracks each postponement
 * - BR-093: Completed tasks excluded
 *
 * Idempotent: tasks already due today are not re-postponed.
 */
export async function POST() {
    try {
        const { userId } = await requireAuth();

        // Today at midnight (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find all eligible tasks for auto-postpone
        // WHERE: autoPostpone = true, dueDate < today, not completed, not deleted
        const overdueTasks = await prisma.task.findMany({
            where: {
                userId,
                autoPostpone: true,
                dueDate: { lt: today },
                completedAt: null,
                deletedAt: null,
            },
            select: {
                id: true,
                dueDate: true,
                originalDueDate: true,
                title: true,
            },
        });

        if (overdueTasks.length === 0) {
            return NextResponse.json({
                postponedCount: 0,
                postponedTaskIds: [],
                message: "No tasks to postpone",
            });
        }

        // Batch update using $transaction for atomicity
        const result = await prisma.$transaction(async (tx) => {
            const postponedIds: string[] = [];

            for (const task of overdueTasks) {
                const fromDate = task.dueDate!; // We know dueDate exists (it's < today)

                // Update task: set dueDate to today, preserve originalDueDate (BR-091)
                await tx.task.update({
                    where: { id: task.id },
                    data: {
                        dueDate: today,
                        // Only set originalDueDate on first postpone
                        originalDueDate: task.originalDueDate ?? fromDate,
                    },
                });

                // Create PostponeHistory record (BR-092)
                await tx.postponeHistory.create({
                    data: {
                        taskId: task.id,
                        fromDate,
                        toDate: today,
                        reason: "auto",
                    },
                });

                postponedIds.push(task.id);
            }

            return postponedIds;
        });

        return NextResponse.json({
            postponedCount: result.length,
            postponedTaskIds: result,
            message: `${result.length} task(s) postponed to today`,
        });
    } catch (error) {
        return handleAuthError(error);
    }
}
