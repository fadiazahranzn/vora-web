import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { EmptyState } from '@/components/ui/EmptyState';

expect.extend(toHaveNoViolations);

vi.mock('@/components/ui/EmptyState.module.css', () => ({
    default: {
        container: 'container',
        mascot: 'mascot',
        title: 'title',
        description: 'description',
        action: 'action',
    },
}));

vi.mock('@/components/ui/Button.module.css', () => ({
    default: {
        button: 'button',
        primary: 'primary',
        md: 'md',
        content: 'content',
    },
}));

// Mock the Mascot component to avoid side effects from its hooks (window.matchMedia)
vi.mock('@/components/mascot/Mascot', () => ({
    Mascot: ({ expression, size }: { expression: string; size: number }) => (
        <div data-testid="mascot" data-expression={expression} data-size={size}>
            Mascot
        </div>
    ),
}));

describe('EmptyState', () => {
    const defaultProps = {
        title: 'No items yet',
        description: 'Start by adding your first item',
    };

    // ─── Rendering ───────────────────────────────────────────────────────
    describe('rendering', () => {
        it('renders title and description', () => {
            render(<EmptyState {...defaultProps} />);
            expect(screen.getByText('No items yet')).toBeInTheDocument();
            expect(screen.getByText('Start by adding your first item')).toBeInTheDocument();
        });

        it('renders mascot component by default', () => {
            render(<EmptyState {...defaultProps} />);
            expect(screen.getByTestId('mascot')).toBeInTheDocument();
        });

        it('renders emoji mascot when useMascot is false', () => {
            render(<EmptyState {...defaultProps} useMascot={false} />);
            expect(screen.queryByTestId('mascot')).not.toBeInTheDocument();
        });

        it('uses custom emoji when useMascot is false', () => {
            render(<EmptyState {...defaultProps} useMascot={false} mascotEmoji="🚀" />);
            expect(screen.getByText('🚀')).toBeInTheDocument();
        });

        it('renders default emoji 🎨 when useMascot is false and no custom emoji', () => {
            render(<EmptyState {...defaultProps} useMascot={false} />);
            expect(screen.getByText('🎨')).toBeInTheDocument();
        });
    });

    // ─── Mascot Expression ────────────────────────────────────────────
    describe('mascot expression', () => {
        it('uses "happy" expression when no action is provided', () => {
            render(<EmptyState {...defaultProps} />);
            expect(screen.getByTestId('mascot')).toHaveAttribute('data-expression', 'happy');
        });

        it('uses "pointing" expression when action is provided', () => {
            render(
                <EmptyState {...defaultProps} actionLabel="Get Started" onAction={() => { }} />
            );
            expect(screen.getByTestId('mascot')).toHaveAttribute('data-expression', 'pointing');
        });
    });

    // ─── Action Button ────────────────────────────────────────────────
    describe('action button', () => {
        it('renders action button when actionLabel and onAction are provided', () => {
            render(
                <EmptyState
                    {...defaultProps}
                    actionLabel="Add Item"
                    onAction={() => { }}
                />
            );
            expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
        });

        it('does not render action button when actionLabel is not provided', () => {
            render(<EmptyState {...defaultProps} />);
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });

        it('calls onAction when action button is clicked', async () => {
            const user = userEvent.setup();
            const handleAction = vi.fn();
            render(
                <EmptyState
                    {...defaultProps}
                    actionLabel="Create"
                    onAction={handleAction}
                />
            );
            await user.click(screen.getByRole('button', { name: /create/i }));
            expect(handleAction).toHaveBeenCalledTimes(1);
        });
    });

    // ─── Custom Props ──────────────────────────────────────────────────
    describe('custom props', () => {
        it('applies custom className', () => {
            const { container } = render(
                <EmptyState {...defaultProps} className="custom-empty" />
            );
            expect(container.firstChild).toHaveClass('custom-empty');
        });
    });

    // ─── Accessibility ─────────────────────────────────────────────────
    describe('accessibility', () => {
        it('mascot area is hidden from screen readers', () => {
            render(<EmptyState {...defaultProps} />);
            const mascotContainer = screen.getByTestId('mascot').parentElement;
            expect(mascotContainer).toHaveAttribute('aria-hidden', 'true');
        });

        it('has no violations (basic)', async () => {
            const { container } = render(<EmptyState {...defaultProps} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no violations (with action)', async () => {
            const { container } = render(
                <EmptyState {...defaultProps} actionLabel="Start" onAction={() => { }} />
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    // ─── Theme Switching ───────────────────────────────────────────────
    describe('theme switching', () => {
        it('renders in light theme', () => {
            document.documentElement.setAttribute('data-theme', 'light');
            render(<EmptyState {...defaultProps} />);
            expect(screen.getByText('No items yet')).toBeInTheDocument();
        });

        it('renders in dark theme', () => {
            document.documentElement.setAttribute('data-theme', 'dark');
            render(<EmptyState {...defaultProps} />);
            expect(screen.getByText('No items yet')).toBeInTheDocument();
        });
    });

    // ─── Snapshots ─────────────────────────────────────────────────────
    describe('snapshots', () => {
        it('matches basic empty state snapshot', () => {
            const { container } = render(<EmptyState {...defaultProps} />);
            expect(container.firstChild).toMatchSnapshot();
        });

        it('matches empty state with action snapshot', () => {
            const { container } = render(
                <EmptyState
                    {...defaultProps}
                    actionLabel="Add Habit"
                    onAction={() => { }}
                />
            );
            expect(container.firstChild).toMatchSnapshot();
        });
    });
});
