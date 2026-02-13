import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Home from '@/app/(app)/page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock useSession
vi.mock('next-auth/react', async () => {
  const actual = await vi.importActual('next-auth/react')
  return {
    ...actual,
    useSession: vi.fn(),
  }
})

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn(() => 'all') }),
  usePathname: () => '/',
}))

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

vi.mock('@/components/mascot/Mascot', () => ({
  Mascot: () => <div data-testid="mascot">Mascot</div>,
}))
vi.mock('@/components/ui/DatePicker', () => ({
  DatePicker: () => <div>DatePicker</div>,
}))

vi.mock('@/components/layout/CategorySidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}))

vi.mock('@/components/habit/EditHabitModal', () => ({
  EditHabitModal: () => <div data-testid="edit-modal">EditModal</div>,
}))
vi.mock('@/components/habit/HabitWizard', () => ({
  HabitWizard: () => <div data-testid="wizard">Wizard</div>,
}))

// Mock MoodCheckinModal to verify it opens
vi.mock('@/components/mood/MoodCheckinModal', () => ({
  MoodCheckinModal: ({ isOpen, onSelect }: any) =>
    isOpen ? (
      <div data-testid="mood-modal">
        Mood Modal Open
        <button onClick={() => onSelect('HAPPY')}>Select Happy</button>
      </div>
    ) : null,
  MoodType: {},
}))

import { useSession } from 'next-auth/react'

describe('Habit Integration Flow', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
    ;(useSession as any).mockReturnValue({
      data: { user: { name: 'Test User', email: 'test@example.com' } },
      status: 'authenticated',
    })

    mockFetch.mockImplementation((url) => {
      if (url.includes('/api/habits?date=')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              id: 'habit-1',
              name: 'Drink Water',
              color: '#4287f5',
              isCompleted: false,
              categoryId: 'cat-1',
              category: {
                id: 'cat-1',
                name: 'Health',
                icon: '💧',
                sortOrder: 1,
              },
            },
          ],
        })
      }
      if (url.includes('/api/categories')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            { id: 'cat-1', name: 'Health', icon: '💧', sortOrder: 1 },
          ],
        })
      }
      if (url.includes('/api/completions/dates'))
        return Promise.resolve({ ok: true, json: async () => ({ dates: [] }) })
      if (url.includes('/complete'))
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        })
      if (url.includes('/api/mood-checkins'))
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        })
      return Promise.resolve({ ok: true, json: async () => ({}) })
    })
  })

  const renderHome = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    )
  }

  it('should open mood modal when completing a habit', async () => {
    renderHome()

    // Wait for habits to load
    await waitFor(
      () => {
        expect(screen.getByText('Drink Water')).toBeInTheDocument()
      },
      { timeout: 4000 }
    )

    // Find the checkbox by role
    const checkboxes = screen.getAllByRole('checkbox')
    // HabitCard now has role="checkbox"
    fireEvent.click(checkboxes[0])

    await waitFor(
      () => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/habits/habit-1/complete'),
          expect.objectContaining({ method: 'POST' })
        )
      },
      { timeout: 5000 }
    )

    // Verify Mood Modal Opens (Home.tsx has 500ms delay)
    await waitFor(
      () => {
        expect(screen.getByTestId('mood-modal')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    // Select Mood
    fireEvent.click(screen.getByText('Select Happy'))

    await waitFor(
      () => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/mood-checkins'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('HAPPY'),
          })
        )
      },
      { timeout: 3000 }
    )
  })
})
