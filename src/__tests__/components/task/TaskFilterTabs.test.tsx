import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TaskFilterTabs } from '@/components/task/TaskFilterTabs'

import styles from '@/components/task/TaskFilterTabs.module.css'

describe('TaskFilterTabs', () => {
    it('renders all filter options', () => {
        render(<TaskFilterTabs activeFilter="all" onFilterChange={() => { }} />)
        expect(screen.getByText('All')).toBeInTheDocument()
        expect(screen.getByText('Active')).toBeInTheDocument()
        expect(screen.getByText('Completed')).toBeInTheDocument()
        expect(screen.getByText('Overdue')).toBeInTheDocument()
    })

    it('highlights the active filter', () => {
        render(<TaskFilterTabs activeFilter="completed" onFilterChange={() => { }} />)
        const completedTab = screen.getByText('Completed')
        expect(completedTab).toHaveClass(styles.tabActive)

        const activeTab = screen.getByText('Active')
        expect(activeTab).not.toHaveClass(styles.tabActive)
    })

    it('calls onFilterChange when a tab is clicked', () => {
        const onFilterChange = vi.fn()
        render(<TaskFilterTabs activeFilter="all" onFilterChange={onFilterChange} />)

        fireEvent.click(screen.getByText('Overdue'))
        expect(onFilterChange).toHaveBeenCalledWith('overdue')
    })
})
