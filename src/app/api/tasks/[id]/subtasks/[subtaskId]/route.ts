import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth'
import { z } from 'zod'
import { processTaskRecurrence } from '@/lib/services/recurrence'

const updateSubTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  completedAt: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
})

// ─── PATCH /api/tasks/:taskId/subtasks/:id ──────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  try {
    const { userId } = await requireAuth()
    const { id: taskId, subtaskId: id } = await params
    const body = await req.json()

    const validatedData = updateSubTaskSchema.parse(body)

    // Verify task ownership (row-level security)
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId, deletedAt: null },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Task not found' },
        { status: 404 }
      )
    }

    // Verify sub-task exists and belongs to this task
    const existingSubTask = await prisma.subTask.findFirst({
      where: { id, taskId },
    })

    if (!existingSubTask) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Sub-task not found' },
        { status: 404 }
      )
    }

    // Determine if this is a completion state change
    const isCompletingSubTask =
      validatedData.completedAt !== undefined &&
      validatedData.completedAt !== null &&
      !existingSubTask.completedAt
    const isUncompletingSubTask =
      validatedData.completedAt === null && !!existingSubTask.completedAt

    // Use transaction for auto-complete logic (BR-086)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update the sub-task
      const updatedSubTask = await tx.subTask.update({
        where: { id },
        data: {
          ...(validatedData.title !== undefined && {
            title: validatedData.title,
          }),
          ...(validatedData.completedAt !== undefined && {
            completedAt: validatedData.completedAt
              ? new Date(validatedData.completedAt)
              : null,
          }),
          ...(validatedData.sortOrder !== undefined && {
            sortOrder: validatedData.sortOrder,
          }),
        },
      })

      // 2. Auto-complete parent logic
      if (isCompletingSubTask) {
        // Check if ALL sub-tasks (including the one just updated) are now complete
        const incompleteCount = await tx.subTask.count({
          where: {
            taskId,
            completedAt: null,
          },
        })

        if (incompleteCount === 0) {
          // All sub-tasks complete → auto-complete parent (BR-086)
          await tx.task.update({
            where: { id: taskId },
            data: { completedAt: new Date() },
          })

          // Trigger recurrence (BR-097)
          await processTaskRecurrence(taskId, tx)
        }
      } else if (isUncompletingSubTask) {
        // If parent was completed and a sub-task is being unchecked → revert parent
        if (task.completedAt) {
          await tx.task.update({
            where: { id: taskId },
            data: { completedAt: null },
          })
        }
      }

      // 3. Fetch updated state
      const updatedTask = await tx.task.findUnique({
        where: { id: taskId },
        select: { completedAt: true },
      })

      return {
        subTask: updatedSubTask,
        parentCompletedAt: updatedTask?.completedAt ?? null,
      }
    })

    return NextResponse.json(result)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      )
    }
    return handleAuthError(error)
  }
}

// ─── DELETE /api/tasks/:taskId/subtasks/:id ─────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  try {
    const { userId } = await requireAuth()
    const { id: taskId, subtaskId: id } = await params

    // Verify task ownership (row-level security)
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId, deletedAt: null },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Task not found' },
        { status: 404 }
      )
    }

    // Verify sub-task exists
    const existingSubTask = await prisma.subTask.findFirst({
      where: { id, taskId },
    })

    if (!existingSubTask) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Sub-task not found' },
        { status: 404 }
      )
    }

    // Delete and check for auto-complete implications
    await prisma.$transaction(async (tx) => {
      await tx.subTask.delete({ where: { id } })

      // After deletion, check if remaining sub-tasks are all completed
      // If yes and parent wasn't already completed, auto-complete parent
      const remainingSubTasks = await tx.subTask.findMany({
        where: { taskId },
        select: { completedAt: true },
      })

      if (remainingSubTasks.length > 0) {
        const allComplete = remainingSubTasks.every((st) => !!st.completedAt)
        if (allComplete && !task.completedAt) {
          await tx.task.update({
            where: { id: taskId },
            data: { completedAt: new Date() },
          })

          // Trigger recurrence (BR-097)
          await processTaskRecurrence(taskId, tx)
        }
      }
    })

    return NextResponse.json({ message: 'Sub-task deleted successfully' })
  } catch (error) {
    return handleAuthError(error)
  }
}
