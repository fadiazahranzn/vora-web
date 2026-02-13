'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TaskFilterTabs, TaskFilter } from '@/components/task/TaskFilterTabs'
import { TaskSortDropdown, TaskSort } from '@/components/task/TaskSortDropdown'
import { TaskCard } from '@/components/task/TaskCard'
import { FAB } from '@/components/ui/FAB'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { TaskModal } from '@/components/features/tasks/TaskModal'
import { SyncStatusBadge } from '@/components/ui/SyncStatusBadge'
import { apiFetch } from '@/lib/api-client'
import { Task } from '@/types/task'
import styles from './page.module.css'

export default function TasksPage() {
    const queryClient = useQueryClient()
    const [filter, setFilter] = useState<TaskFilter>('active')
    const [sort, setSort] = useState<TaskSort>('dueDate')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)
    const [hasPostponed, setHasPostponed] = useState(false)

    React.useEffect(() => {
        // Run auto-postpone on page load (STORY-007)
        if (!hasPostponed) {
            apiFetch('/api/tasks/auto-postpone', { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                    if (data.postponedCount > 0) {
                        queryClient.invalidateQueries({ queryKey: ['tasks'] })
                    }
                    setHasPostponed(true)
                })
                .catch(err => console.error('Auto-postpone error:', err))
        }
    }, [queryClient, hasPostponed])

    const { data: tasks = [], isLoading } = useQuery<Task[]>({
        queryKey: ['tasks', filter, sort],
        queryFn: async () => {
            const res = await fetch(`/api/tasks?filter=${filter}&sort=${sort}&limit=100`)
            if (!res.ok) throw new Error('Failed to fetch tasks')
            const json = await res.json()
            return json.data ?? json // Support both paginated and legacy format
        },
    })

    // Toggle Completion Mutation
    const toggleMutation = useMutation({
        mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
            // Artificial delay to ensure 400ms animation is visible (BR-084)
            await new Promise(resolve => setTimeout(resolve, 450))
            const res = await apiFetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completedAt: completed ? new Date().toISOString() : null }),
            })
            if (!res.ok) throw new Error('Failed to update task')
            return res.json()
        },
        onMutate: async ({ id, completed }) => {
            await queryClient.cancelQueries({ queryKey: ['tasks', filter, sort] })
            const previousTasks = queryClient.getQueryData<Task[]>(['tasks', filter, sort])

            queryClient.setQueryData<Task[]>(['tasks', filter, sort], (old) => {
                if (!old) return []
                return old.map((t) => {
                    if (t.id === id) {
                        return {
                            ...t,
                            completedAt: completed ? new Date().toISOString() : null
                        }
                    }
                    return t
                })
                // Note: We are keeping the task in the list even if completed/active filter 
                // would normally exclude it, to allow for the user to see the change 
                // before the next refetch. 
            })

            return { previousTasks }
        },
        onError: (_err, _newTodo, context) => {
            queryClient.setQueryData(['tasks', filter, sort], context?.previousTasks)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
    })

    const handleToggle = (id: string, completed: boolean) => {
        toggleMutation.mutate({ id, completed })
    }

    const handleCreateTask = () => {
        setEditingTask(undefined)
        setIsModalOpen(true)
    }

    const handleEditTask = (id: string) => {
        const task = tasks.find((t) => t.id === id)
        if (task) {
            setEditingTask(task)
            setIsModalOpen(true)
        }
    }

    const handleModalSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>
                    Tasks
                    <SyncStatusBadge />
                </h1>
                <p className={styles.subtitle}>Streamline your productivity</p>
            </header>

            <TaskFilterTabs activeFilter={filter} onFilterChange={setFilter} />

            <div className={styles.controls}>
                <div className={styles.stats}>
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
                </div>
                <TaskSortDropdown activeSort={sort} onSortChange={setSort} />
            </div>

            <div className={styles.taskList}>
                {isLoading ? (
                    <div className={styles.loadingGrid}>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className={styles.skeletonCard} />
                        ))}
                    </div>
                ) : tasks.length === 0 ? (
                    <EmptyState
                        title={filter === 'overdue' ? 'No overdue tasks!' : 'Nothing on your plate!'}
                        description={
                            filter === 'overdue'
                                ? 'Great job keeping up with your schedule.'
                                : 'Start by adding a task to your list.'
                        }
                        actionLabel="Create Task"
                        onAction={handleCreateTask}
                        mascotEmoji={filter === 'overdue' ? '😊' : '😴'}
                    />
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggle={handleToggle}
                            onEdit={handleEditTask}
                        />
                    ))
                )}
            </div>

            <FAB onClick={handleCreateTask} />

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                taskToEdit={editingTask}
                onSuccess={handleModalSuccess}
            />
        </div>

    )
}
