'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './TaskSortDropdown.module.css'

export type TaskSort = 'priority' | 'dueDate' | 'createdAt'

interface TaskSortDropdownProps {
    activeSort: TaskSort
    onSortChange: (sort: TaskSort) => void
}

export const TaskSortDropdown: React.FC<TaskSortDropdownProps> = ({
    activeSort,
    onSortChange,
}) => {
    const options: { id: TaskSort; label: string }[] = [
        { id: 'dueDate', label: 'Due Date' },
        { id: 'priority', label: 'Priority' },
        { id: 'createdAt', label: 'Recently Added' },
    ]

    return (
        <div className={styles.container}>
            <label htmlFor="task-sort" className={styles.label}>Sort by:</label>
            <div className={styles.selectWrapper}>
                <select
                    id="task-sort"
                    className={styles.select}
                    value={activeSort}
                    onChange={(e) => onSortChange(e.target.value as TaskSort)}
                >
                    {options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className={styles.icon}>
                    <ChevronDown size={14} />
                </div>
            </div>
        </div>
    )
}
