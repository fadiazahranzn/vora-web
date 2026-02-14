import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ActivityLineChart } from './ActivityLineChart'
import { useQuery } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock useQuery
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}))

// Mock ResizeObserver for Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock Lazy Loaded Component to avoid actual Recharts render issues in test and async complexity
vi.mock('./ActivityChartImpl', () => ({
  default: ({ data, view }: any) => (
    <div data-testid="mock-chart">
      Chart View: {view}, Data Points: {data.length}
    </div>
  ),
}))

describe('ActivityLineChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: true,
      data: undefined,
      error: null,
    })

    render(<ActivityLineChart />)
    expect(screen.getByText('Loading chart...')).toBeInTheDocument()
  })

  it('renders error state', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      data: undefined,
      error: new Error('Failed'),
    })

    render(<ActivityLineChart />)
    expect(screen.getByText('Error loading data')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      data: [],
      error: null,
    })

    render(<ActivityLineChart />)
    expect(screen.getByText(/No activity recorded/i)).toBeInTheDocument()
  })

  it('renders chart and toggles view', async () => {
    const mockData = [{ date: 'Mon', value: 50 }]
    ;(useQuery as any).mockReturnValue({
      isLoading: false,
      data: mockData,
      error: null,
    })

    render(<ActivityLineChart />)

    // Check header
    expect(screen.getByText('Activity')).toBeInTheDocument()

    // Check Toggles
    const weeklyBtn = screen.getByText('Weekly')
    const monthlyBtn = screen.getByText('Monthly')
    const _yearlyBtn = screen.getByText('Yearly')

    expect(weeklyBtn).toHaveAttribute('aria-pressed', 'true')
    expect(monthlyBtn).toHaveAttribute('aria-pressed', 'false')

    // Check Data Render (via mock)
    // Wait for Suspense if needed, though mock implies direct render in test usually if React.lazy is mocked?
    // Actually React.lazy mocks require the import to return a promise or component.
    // Our vi.mock('./ActivityChartImpl') returns a component directly.
    // But React.lazy expects a thenable.
    // With vi.mock returning a direct component, React.lazy might fail or we need to mock import differently?
    // Actually, since we mocked the file module, the *dynamic import* inside React.lazy inside ActivityLineChart
    // will return our mock.
    // Wait, ActivityLineChart calls: `const LazyChart = React.lazy(() => import('./ActivityChartImpl'));`
    // `import()` returns a Promise that resolves to the module.
    // `vi.mock` makes `import` return the mocked module.
    // So `import('./ActivityChartImpl')` returns a Promise that resolves to `{ default: MockComponent }`.
    // Yes, this should work.

    await waitFor(() => {
      expect(screen.getByTestId('mock-chart')).toBeInTheDocument()
    })

    expect(
      screen.getByText('Chart View: weekly, Data Points: 1')
    ).toBeInTheDocument()

    // Interaction
    fireEvent.click(monthlyBtn)

    // Since state update triggers re-render, useQuery will be called with new view key
    // We expect the mock to be called again or the component to update local view state.
    // The component passes 'view' prop to LazyChart.
    await waitFor(() => {
      expect(
        screen.getByText('Chart View: monthly, Data Points: 1')
      ).toBeInTheDocument()
    })

    expect(monthlyBtn).toHaveAttribute('aria-pressed', 'true')
    expect(weeklyBtn).toHaveAttribute('aria-pressed', 'false')
  })
})
