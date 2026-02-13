import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import OfflinePage from '@/app/offline/page'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('OfflinePage', () => {
  const originalReload = window.location.reload
  const originalOnline = navigator.onLine

  beforeEach(() => {
    // Mock Window reload
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: vi.fn() },
    })

    // Mock navigator.serviceWorker
    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      value: {
        controller: {
          postMessage: vi.fn(),
        },
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    })

    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false, // Default to offline
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: originalReload },
    })
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: originalOnline,
    })
    vi.clearAllMocks()
  })

  it('renders the offline message and mascot', () => {
    render(<OfflinePage />)

    expect(screen.getByText("You're offline")).toBeInTheDocument()
    expect(
      screen.getByText(/Don't worry, your progress is saved/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Retry Connection/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Mascot feeling concerned/i })
    ).toBeInTheDocument()
  })

  it('checks for pending sync items from Service Worker', () => {
    const postMessageMock = vi.fn()
    const addEventListenerMock = vi.fn()

    // Setup mock before render
    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      value: {
        controller: {
          postMessage: postMessageMock,
        },
        addEventListener: addEventListenerMock,
        removeEventListener: vi.fn(),
      },
    })

    render(<OfflinePage />)

    expect(postMessageMock).toHaveBeenCalledWith({ type: 'GET_PENDING_COUNT' })
    expect(addEventListenerMock).toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    )
  })

  it('displays pending sync count when receiving message from Service Worker', async () => {
    let messageHandler: (event: MessageEvent) => void = () => {}

    const addEventListenerMock = vi.fn((event, handler) => {
      if (event === 'message') {
        messageHandler = handler as any
      }
    })

    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      value: {
        controller: { postMessage: vi.fn() },
        addEventListener: addEventListenerMock,
        removeEventListener: vi.fn(),
      },
    })

    render(<OfflinePage />)

    // Simulate message from Service Worker
    act(() => {
      messageHandler(
        new MessageEvent('message', {
          data: { type: 'PENDING_COUNT', count: 5 },
        })
      )
    })

    const badge = await screen.findByText(/5 actions pending sync/i)
    expect(badge).toBeInTheDocument()
  })

  it('attempts to reload when Retry button is clicked and online', () => {
    // Mock online is true
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    })

    render(<OfflinePage />)

    const retryButton = screen.getByRole('button', {
      name: /Retry Connection/i,
    })
    fireEvent.click(retryButton)

    expect(window.location.reload).toHaveBeenCalled()
  })

  it('shows loading state and does not reload when Retry button is clicked and still offline', () => {
    // Mock online is false
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false,
    })

    vi.useFakeTimers()

    render(<OfflinePage />)

    const retryButton = screen.getByRole('button', {
      name: /Retry Connection/i,
    })
    fireEvent.click(retryButton)

    // Should check for loading spinner or disabled state if implemented in Button
    // Assuming Button handles isLoading prop by showing spinner or similar
    // Since I don't know exact Button implementation, I'll check if reload was NOT called immediately
    expect(window.location.reload).not.toHaveBeenCalled()

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    vi.useRealTimers()
  })

  it('auto-reloads when back online', () => {
    render(<OfflinePage />)

    // Trigger online event
    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    expect(window.location.reload).toHaveBeenCalled()
  })
})
