'use client'

import React from 'react'
import { Check, Calendar, AlertCircle, Repeat } from 'lucide-react'
import { clsx } from 'clsx'
import { format, isPast, isToday, differenceInDays } from 'date-fns'
import { Task } from '@/types/task'
import styles from './TaskCard.module.css'

interface TaskCardProps {
    task: Task
    onToggle?: (id: string, completed: boolean) => void
    onEdit?: (id: string) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit }) => {
    const isCompleted = !!task.completedAt
    const hasDueDate = !!task.dueDate
    const dueDate = hasDueDate ? new Date(task.dueDate!) : null
    const isOverdue = hasDueDate && !isCompleted && isPast(dueDate!) && !isToday(dueDate!)

    const subTasksCount = task.subTasks?.length || 0
    const completedSubTasksCount = task.subTasks?.filter(st => !!st.completedAt).length || 0
    const progressPercent = subTasksCount > 0 ? (completedSubTasksCount / subTasksCount) * 100 : 0

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onToggle) {
            if (!isCompleted) {
                // Dispatch event for analytics/tracking as per BR-088
                const event = new CustomEvent('task_completed', {
                    detail: { taskId: task.id, title: task.title }
                })
                window.dispatchEvent(event)
            }
            onToggle(task.id, !isCompleted)
        }
    }

    const handleCardClick = () => {
        if (onEdit) {
            onEdit(task.id)
        }
    }

    const getOverdueText = () => {
        if (!dueDate) return ''
        const days = differenceInDays(new Date(), dueDate)
        return `${days} ${days === 1 ? 'day' : 'days'} overdue`
    }

    return (
        <div
            className={clsx(styles.cardWrapper, isCompleted && styles.completed)}
            onClick={handleCardClick}
        >
            <div className={styles.card}>
                {/* Checkbox */}
                <div
                    role="checkbox"
                    aria-checked={isCompleted}
                    className={clsx(styles.checkbox, isCompleted && styles.checkboxChecked)}
                    onClick={handleToggle}
                >
                    {isCompleted && <Check size={14} strokeWidth={3} />}
                </div>

                <div className={styles.content}>
                    <div className={styles.header}>
                        <span className={clsx(styles.title, isCompleted && styles.titleCompleted)}>
                            {task.title}
                        </span>
                        <div className={clsx(styles.priorityBadge, styles[task.priority.toLowerCase()])}>
                            {task.priority}
                        </div>
                    </div>

                    <div className={styles.meta}>
                        {hasDueDate && (
                            <div className={clsx(styles.metaItem, isOverdue && styles.overdueText)}>
                                <Calendar size={12} />
                                <span>{isToday(dueDate!) ? 'Today' : format(dueDate!, 'MMM d')}</span>
                            </div>
                        )}

                        {task.recurrence !== 'NONE' && (
                            <div className={styles.metaItem} title={`Repeats: ${task.recurrence}`}>
                                <Repeat size={12} />
                            </div>
                        )}

                        {subTasksCount > 0 && (
                            <div className={styles.metaItem}>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <span className={styles.progressText}>
                                    {completedSubTasksCount}/{subTasksCount}
                                </span>
                            </div>
                        )}
                    </div>

                    {isOverdue && (
                        <div className={styles.overdueBadge}>
                            <AlertCircle size={10} />
                            <span>{getOverdueText()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
