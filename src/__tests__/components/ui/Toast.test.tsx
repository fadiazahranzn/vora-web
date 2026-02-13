import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi } from 'vitest';
import React from 'react';
import { ToastProvider, useToast } from '@/components/ui/Toast';

expect.extend(toHaveNoViolations);

vi.mock('@/components/ui/Toast.module.css', () => ({
    default: {
        container: 'container',
        toast: 'toast',
        success: 'success',
        error: 'error',
        info: 'info',
        content: 'content',
        closeButton: 'closeButton',
    },
}));

// Helper component to trigger toasts
const ToastTrigger: React.FC<{
    message?: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
}> = ({ message = 'Test toast', type = 'info', duration }) => {
    const { showToast } = useToast();
    return (
        <button onClick={() => showToast(message, type, duration)}>
            Show Toast
        </button>
    );
};

const renderWithProvider = (
    triggerProps?: { message?: string; type?: 'success' | 'error' | 'info'; duration?: number }
) => {
    return render(
        <ToastProvider>
            <ToastTrigger {...triggerProps} />
        </ToastProvider>
    );
};

describe('Toast', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // ─── Basic Rendering ───────────────────────────────────────────────
    describe('rendering', () => {
        it('shows a toast when triggered', async () => {
            vi.useRealTimers();
            const user = userEvent.setup();
            renderWithProvider();
            await user.click(screen.getByText('Show Toast'));
            expect(screen.getByText('Test toast')).toBeInTheDocument();
        });

        it('shows toast with success type', async () => {
            vi.useRealTimers();
            const user = userEvent.setup();
            renderWithProvider({ type: 'success', message: 'Success!' });
            await user.click(screen.getByText('Show Toast'));
            const toast = screen.getByText('Success!').closest('.toast');
            expect(toast?.className).toContain('success');
        });

        it('shows toast with error type', async () => {
            vi.useRealTimers();
            const user = userEvent.setup();
            renderWithProvider({ type: 'error', message: 'Error!' });
            await user.click(screen.getByText('Show Toast'));
            const toast = screen.getByText('Error!').closest('.toast');
            expect(toast?.className).toContain('error');
        });

        it('shows toast with info type', async () => {
            vi.useRealTimers();
            const user = userEvent.setup();
            renderWithProvider({ type: 'info', message: 'Info!' });
            await user.click(screen.getByText('Show Toast'));
            const toast = screen.getByText('Info!').closest('.toast');
            expect(toast?.className).toContain('info');
        });
    });

    // ─── Auto-Dismiss ─────────────────────────────────────────────────
    describe('auto-dismiss', () => {
        it('auto-dismisses after default duration (4000ms)', () => {
            renderWithProvider();
            // Click trigger (use fireEvent because fake timers conflict with userEvent)
            fireEvent.click(screen.getByText('Show Toast'));
            expect(screen.getByText('Test toast')).toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(4100);
            });

            expect(screen.queryByText('Test toast')).not.toBeInTheDocument();
        });

        it('auto-dismisses after custom duration', () => {
            renderWithProvider({ duration: 2000 });
            fireEvent.click(screen.getByText('Show Toast'));
            expect(screen.getByText('Test toast')).toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(2100);
            });

            expect(screen.queryByText('Test toast')).not.toBeInTheDocument();
        });
    });

    // ─── Manual Close ─────────────────────────────────────────────────
    describe('manual close', () => {
        it('dismisses when close button is clicked', async () => {
            vi.useRealTimers();
            const user = userEvent.setup();
            renderWithProvider({ duration: 0 }); // duration 0 = no auto-dismiss
            await user.click(screen.getByText('Show Toast'));
            expect(screen.getByText('Test toast')).toBeInTheDocument();

            const closeBtn = screen.getByLabelText('Close notification');
            await user.click(closeBtn);
            expect(screen.queryByText('Test toast')).not.toBeInTheDocument();
        });
    });

    // ─── Multiple Toasts ─────────────────────────────────────────────
    describe('multiple toasts', () => {
        it('shows multiple toasts simultaneously', async () => {
            vi.useRealTimers();
            const user = userEvent.setup();
            render(
                <ToastProvider>
                    <ToastTrigger message="First toast" duration={0} />
                </ToastProvider>
            );
            await user.click(screen.getByText('Show Toast'));
            await user.click(screen.getByText('Show Toast'));
            // Both share the same message, check for multiple alert roles
            const alerts = screen.getAllByRole('alert');
            expect(alerts.length).toBeGreaterThanOrEqual(2);
        });
    });

    // ─── Context Hook ─────────────────────────────────────────────────
    describe('useToast hook', () => {
        it('throws when used outside ToastProvider', () => {
            const TestComponent = () => {
                useToast();
                return null;
            };
            expect(() => render(<TestComponent />)).toThrow(
                'useToast must be used within a ToastProvider'
            );
        });
    });

    // ─── ARIA Attributes ──────────────────────────────────────────────
    describe('ARIA attributes', () => {
        it('has role="alert" on each toast', async () => {
            vi.useRealTimers();
            const user = userEvent.setup();
            renderWithProvider();
            await user.click(screen.getByText('Show Toast'));
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        it('close button has accessible label', async () => {
            vi.useRealTimers();
            const user = userEvent.setup();
            renderWithProvider();
            await user.click(screen.getByText('Show Toast'));
            expect(screen.getByLabelText('Close notification')).toBeInTheDocument();
        });
    });

    // ─── Theme Switching ───────────────────────────────────────────────
    describe('theme switching', () => {
        it('renders in light theme', async () => {
            vi.useRealTimers();
            const user = userEvent.setup();
            document.documentElement.setAttribute('data-theme', 'light');
            renderWithProvider();
            await user.click(screen.getByText('Show Toast'));
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        it('renders in dark theme', async () => {
            vi.useRealTimers();
            const user = userEvent.setup();
            document.documentElement.setAttribute('data-theme', 'dark');
            renderWithProvider();
            await user.click(screen.getByText('Show Toast'));
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });
    });

    // ─── Accessibility ─────────────────────────────────────────────────
    describe('accessibility', () => {
        it('has no violations when toast is shown', async () => {
            vi.useRealTimers();
            const user = userEvent.setup();
            const { container } = renderWithProvider();
            await user.click(screen.getByText('Show Toast'));
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
