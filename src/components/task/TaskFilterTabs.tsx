'use client'

import React from 'react'
import { clsx } from 'clsx'
import styles from './TaskFilterTabs.module.css'

export type TaskFilter = 'all' | 'active' | 'completed' | 'overdue'

interface TaskFilterTabsProps {
    activeFilter: TaskFilter
    onFilterChange: (filter: TaskFilter) => void
}

export const TaskFilterTabs: React.FC<TaskFilterTabsProps> = ({
    activeFilter,
    onFilterChange
}) => {
    const filters: { id: TaskFilter; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'completed', label: 'Completed' },
        { id: 'overdue', label: 'Overdue' },
    ]

    return (
        <div className={styles.scrollContainer}>
            <div className={styles.tabs}>
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        className={clsx(
                            styles.tab,
                            activeFilter === filter.id && styles.tabActive
                        )}
                        onClick={() => onFilterChange(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
