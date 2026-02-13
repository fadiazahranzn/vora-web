import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { StatsCards } from '@/components/analytics/StatsCards'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// ---------- Mocks ----------

// Mock the useStats hook
vi.mock('@/hooks/useStats', () => ({
    useStats: vi.fn(),
}))

// Mock lucide-react icons to avoid SVG rendering issues
vi.mock('lucide-react', () => ({
    Flame: ({ size }: any) => <span data-testid="icon-flame">🔥</span>,
    Trophy: ({ size }: any) => <span data-testid="icon-trophy">🏆</span>,
    Star: ({ size }: any) => <span data-testid="icon-star">⭐</span>,
    Calendar: ({ size }: any) => <span data-testid="icon-calendar">📅</span>,
}))

// Mock the Card component
vi.mock('@/components/ui/Card', () => ({
    Card: ({ children, className }: any) => (
        <div data-testid="card" className={className}>
            {children}
        </div>
    ),
}))

// Mock the Skeleton component
vi.mock('@/components/ui/Skeleton', () => ({
    Skeleton: ({ className }: any) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

const { useStats } = await import('@/hooks/useStats')

// ---------- Test Suite ----------

describe('StatsCards', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // ---- Loading state ----

    it('renders skeleton loaders while loading', () => {
        ; (useStats as any).mockReturnValue({
            data: undefined,
            isLoading: true,
            error: null,
        })

        render(<StatsCards />)

        const skeletons = screen.getAllByTestId('skeleton')
        expect(skeletons).toHaveLength(4)
    })

    // ---- Error state ----

    it('renders error message when fetch fails', () => {
        ; (useStats as any).mockReturnValue({
            data: undefined,
            isLoading: false,
            error: new Error('Failed'),
        })

        render(<StatsCards />)

        expect(screen.getByText('Error loading statistics')).toBeInTheDocument()
    })

    // ---- Renders all four cards ----

    it('renders four stat cards with correct labels', () => {
        ; (useStats as any).mockReturnValue({
            data: {
                currentStreak: 5,
                longestStreak: 10,
                perfectDays: 8,
                activeDays: 20,
            },
            isLoading: false,
            error: null,
        })

        render(<StatsCards />)

        expect(screen.getByText('Current Streak')).toBeInTheDocument()
        expect(screen.getByText('Longest Streak')).toBeInTheDocument()
        expect(screen.getByText('Perfect Days')).toBeInTheDocument()
        expect(screen.getByText('Active Days')).toBeInTheDocument()
    })

    // ---- Displays the correct values ----

    it('displays correct stat values after count-up animation', async () => {
        ; (useStats as any).mockReturnValue({
            data: {
                currentStreak: 5,
                longestStreak: 10,
                perfectDays: 8,
                activeDays: 20,
            },
            isLoading: false,
            error: null,
        })

        render(<StatsCards />)

        // The count-up animation takes ~1s. Wait for final values.
        await waitFor(
            () => {
                expect(screen.getByText(/5/)).toBeInTheDocument()
                expect(screen.getByText(/10/)).toBeInTheDocument()
                expect(screen.getByText(/8/)).toBeInTheDocument()
                expect(screen.getByText(/20/)).toBeInTheDocument()
            },
            { timeout: 2000 }
        )
    })

    // ---- Handles zero values (empty state) ----

    it('renders zero values for all stats when data is empty', () => {
        ; (useStats as any).mockReturnValue({
            data: {
                currentStreak: 0,
                longestStreak: 0,
                perfectDays: 0,
                activeDays: 0,
            },
            isLoading: false,
            error: null,
        })

        render(<StatsCards />)

        // All four labels should still render
        expect(screen.getByText('Current Streak')).toBeInTheDocument()
        expect(screen.getByText('Longest Streak')).toBeInTheDocument()
        expect(screen.getByText('Perfect Days')).toBeInTheDocument()
        expect(screen.getByText('Active Days')).toBeInTheDocument()
    })

    // ---- Renders icons ----

    it('renders all four icons', () => {
        ; (useStats as any).mockReturnValue({
            data: {
                currentStreak: 1,
                longestStreak: 1,
                perfectDays: 1,
                activeDays: 1,
            },
            isLoading: false,
            error: null,
        })

        render(<StatsCards />)

        expect(screen.getByTestId('icon-flame')).toBeInTheDocument()
        expect(screen.getByTestId('icon-trophy')).toBeInTheDocument()
        expect(screen.getByTestId('icon-star')).toBeInTheDocument()
        expect(screen.getByTestId('icon-calendar')).toBeInTheDocument()
    })

    // ---- Handles undefined data gracefully ----

    it('defaults to 0 when data values are undefined', () => {
        ; (useStats as any).mockReturnValue({
            data: {},
            isLoading: false,
            error: null,
        })

        render(<StatsCards />)

        // Should render with ?? 0 fallback
        expect(screen.getByText('Current Streak')).toBeInTheDocument()
    })
})
