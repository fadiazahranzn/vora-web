import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { MoodCheckinModal } from '@/components/mood/MoodCheckinModal'

// Mock dependencies
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

// Mock Mascot
vi.mock('@/components/mascot/Mascot', () => ({
  Mascot: ({ expression }: { expression: string }) => (
    <div data-testid="mascot" data-expression={expression}>
      Mascot: {expression}
    </div>
  ),
  MascotExpression: {},
}))

// Mock Modal
vi.mock('@/components/ui/Modal', () => ({
  Modal: ({ children, isOpen, title }: any) =>
    isOpen ? (
      <div role="dialog" aria-label={title}>
        <h1>{title}</h1>
        {children}
      </div>
    ) : null,
}))

describe('MoodCheckinModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSelect = vi.fn()
  const mockOnDetailsSubmit = vi.fn()
  const mockOnSkip = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Default to fake timers but tests can override
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders correctly when open', () => {
    render(
      <MoodCheckinModal
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        onSkip={mockOnSkip}
      />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('How do you feel?')).toBeInTheDocument()
  })

  it('should handle Positive Path (Happy)', async () => {
    // Switch to real timers for this test to handle dynamic import smoothly
    vi.useRealTimers()

    render(
      <MoodCheckinModal
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        onSkip={mockOnSkip}
      />
    )

    fireEvent.click(screen.getByText('Happy'))

    // mascot celebrates immediately (sync)
    expect(screen.getByTestId('mascot')).toHaveAttribute(
      'data-expression',
      'celebrating'
    )

    // wait for the 400ms delay and the view transition
    await waitFor(
      () => {
        expect(mockOnSelect).toHaveBeenCalledWith('HAPPY')
        expect(screen.getByText('Great Job!')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )

    // auto close after 2 seconds
    await waitFor(
      () => {
        expect(mockOnSkip).toHaveBeenCalled()
      },
      { timeout: 3000 }
    )
  })

  it('should handle Negative Path (Sad) -> Reflection -> Activities -> Support', async () => {
    // Keep fake timers here as it doesn't involve dynamic imports and is deterministic
    render(
      <MoodCheckinModal
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        onDetailsSubmit={mockOnDetailsSubmit}
        onSkip={mockOnSkip}
      />
    )

    // 1. Sad
    fireEvent.click(screen.getByText('Sad'))
    expect(screen.getByTestId('mascot')).toHaveAttribute(
      'data-expression',
      'concerned'
    )

    // 2. Advance to trigger state change
    await act(async () => {
      vi.advanceTimersByTime(400)
    })

    expect(mockOnSelect).toHaveBeenCalledWith('SAD')

    // Check Reflection view
    expect(
      screen.getByPlaceholderText("What's making you feel this way?")
    ).toBeInTheDocument()

    // 3. Reflection -> Activities
    const reflectionText = 'Missed goal'
    fireEvent.change(
      screen.getByPlaceholderText("What's making you feel this way?"),
      { target: { value: reflectionText } }
    )
    fireEvent.click(screen.getByText('Continue'))

    expect(screen.getByText('What would help?')).toBeInTheDocument()
    expect(screen.getByTestId('mascot')).toHaveAttribute(
      'data-expression',
      'happy'
    )

    // 4. Activities -> Support
    const activityBtn = screen.getByText('Take a short break').closest('button')
    fireEvent.click(activityBtn!)
    fireEvent.click(screen.getByText('Continue'))

    expect(screen.getByText('You Got This!')).toBeInTheDocument()
    expect(screen.getByTestId('mascot')).toHaveAttribute(
      'data-expression',
      'waving'
    )

    expect(mockOnDetailsSubmit).toHaveBeenCalledWith({
      reflection: reflectionText,
      activity: 'break',
    })

    // 5. Auto close
    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(mockOnSkip).toHaveBeenCalled()
  })

  it('should allow skipping reflection and activities', async () => {
    render(
      <MoodCheckinModal
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        onDetailsSubmit={mockOnDetailsSubmit}
        onSkip={mockOnSkip}
      />
    )

    fireEvent.click(screen.getByText('Sad'))
    act(() => {
      vi.advanceTimersByTime(400)
    })

    // Skip Reflection
    const skipReflect = screen.getAllByRole('button', { name: /Skip/i })[0]
    fireEvent.click(skipReflect)

    expect(screen.getByText('What would help?')).toBeInTheDocument()

    // Skip Activity
    const skipActivity = screen.getByRole('button', { name: /Skip/i })
    fireEvent.click(skipActivity)

    expect(screen.getByText('You Got This!')).toBeInTheDocument()
    expect(mockOnDetailsSubmit).not.toHaveBeenCalled()
  })

  it('should enforce character limit on reflection', async () => {
    render(
      <MoodCheckinModal
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        onSkip={mockOnSkip}
      />
    )

    fireEvent.click(screen.getByText('Sad'))
    act(() => {
      vi.advanceTimersByTime(400)
    })

    const textarea = screen.getByPlaceholderText(
      "What's making you feel this way?"
    )
    expect(textarea).toHaveAttribute('maxLength', '500')

    expect(screen.getByText('0/500')).toBeInTheDocument()

    fireEvent.change(textarea, { target: { value: 'abc' } })
    expect(screen.getByText('3/500')).toBeInTheDocument()
  })
})
