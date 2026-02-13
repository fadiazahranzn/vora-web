import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { Button } from '@/components/ui/Button';

expect.extend(toHaveNoViolations);

// Mock CSS module
vi.mock('@/components/ui/Button.module.css', () => ({
    default: {
        button: 'button',
        primary: 'primary',
        secondary: 'secondary',
        ghost: 'ghost',
        outline: 'outline',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        loading: 'loading',
        iconOnly: 'iconOnly',
        spinner: 'spinner',
        icon: 'icon',
        content: 'content',
    },
}));

describe('Button', () => {
    // ─── Variant Rendering ───────────────────────────────────────────────
    describe('variants', () => {
        it('renders primary variant by default', () => {
            render(<Button>Click me</Button>);
            const button = screen.getByRole('button', { name: /click me/i });
            expect(button).toBeInTheDocument();
            expect(button.className).toContain('primary');
        });

        it('renders secondary variant', () => {
            render(<Button variant="secondary">Secondary</Button>);
            const button = screen.getByRole('button', { name: /secondary/i });
            expect(button.className).toContain('secondary');
        });

        it('renders ghost variant', () => {
            render(<Button variant="ghost">Ghost</Button>);
            const button = screen.getByRole('button', { name: /ghost/i });
            expect(button.className).toContain('ghost');
        });

        it('renders outline variant', () => {
            render(<Button variant="outline">Outline</Button>);
            const button = screen.getByRole('button', { name: /outline/i });
            expect(button.className).toContain('outline');
        });
    });

    // ─── Sizes ───────────────────────────────────────────────────────────
    describe('sizes', () => {
        it('renders small size', () => {
            render(<Button size="sm">Small</Button>);
            expect(screen.getByRole('button').className).toContain('sm');
        });

        it('renders medium size by default', () => {
            render(<Button>Medium</Button>);
            expect(screen.getByRole('button').className).toContain('md');
        });

        it('renders large size', () => {
            render(<Button size="lg">Large</Button>);
            expect(screen.getByRole('button').className).toContain('lg');
        });
    });

    // ─── Loading State ──────────────────────────────────────────────────
    describe('loading state', () => {
        it('shows spinner when loading', () => {
            render(<Button isLoading>Loading</Button>);
            const spinner = screen.getByRole('status');
            expect(spinner).toBeInTheDocument();
            expect(spinner).toHaveAttribute('aria-label', 'Loading');
        });

        it('disables button when loading', () => {
            render(<Button isLoading>Loading</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('sets aria-busy when loading', () => {
            render(<Button isLoading>Loading</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
        });

        it('hides children text when loading', () => {
            render(<Button isLoading>Click me</Button>);
            expect(screen.queryByText('Click me')).not.toBeInTheDocument();
        });

        it('hides icons when loading', () => {
            render(
                <Button isLoading leftIcon={<span data-testid="left-icon">←</span>}>
                    Text
                </Button>
            );
            expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
        });
    });

    // ─── Icon-Only Mode ─────────────────────────────────────────────────
    describe('icon-only mode', () => {
        it('renders icon-only button', () => {
            render(
                <Button iconOnly aria-label="Add item">
                    <span data-testid="plus-icon">+</span>
                </Button>
            );
            const button = screen.getByRole('button', { name: /add item/i });
            expect(button.className).toContain('iconOnly');
            expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
        });
    });

    // ─── Icons ──────────────────────────────────────────────────────────
    describe('icons', () => {
        it('renders left icon', () => {
            render(
                <Button leftIcon={<span data-testid="left-icon">←</span>}>
                    Back
                </Button>
            );
            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        });

        it('renders right icon', () => {
            render(
                <Button rightIcon={<span data-testid="right-icon">→</span>}>
                    Next
                </Button>
            );
            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });
    });

    // ─── Interactions ───────────────────────────────────────────────────
    describe('interactions', () => {
        it('calls onClick when clicked', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            render(<Button onClick={handleClick}>Click me</Button>);
            await user.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('does not call onClick when disabled', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            render(<Button onClick={handleClick} disabled>Click me</Button>);
            await user.click(screen.getByRole('button'));
            expect(handleClick).not.toHaveBeenCalled();
        });

        it('does not call onClick when loading', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            render(<Button onClick={handleClick} isLoading>Click me</Button>);
            await user.click(screen.getByRole('button'));
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    // ─── Keyboard Navigation ───────────────────────────────────────────
    describe('keyboard navigation', () => {
        it('can be activated with Enter key', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            render(<Button onClick={handleClick}>Press Enter</Button>);
            const button = screen.getByRole('button');
            button.focus();
            await user.keyboard('{Enter}');
            expect(handleClick).toHaveBeenCalled();
        });

        it('can be activated with Space key', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            render(<Button onClick={handleClick}>Press Space</Button>);
            const button = screen.getByRole('button');
            button.focus();
            await user.keyboard(' ');
            expect(handleClick).toHaveBeenCalled();
        });

        it('is focusable', () => {
            render(<Button>Focusable</Button>);
            const button = screen.getByRole('button');
            button.focus();
            expect(document.activeElement).toBe(button);
        });
    });

    // ─── Forwarded Ref ─────────────────────────────────────────────────
    describe('ref forwarding', () => {
        it('forwards ref to the button element', () => {
            const ref = React.createRef<HTMLButtonElement>();
            render(<Button ref={ref}>Ref Button</Button>);
            expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        });
    });

    // ─── Theme Switching ───────────────────────────────────────────────
    describe('theme switching', () => {
        it('renders correctly with light theme', () => {
            document.documentElement.setAttribute('data-theme', 'light');
            render(<Button>Light Theme</Button>);
            expect(screen.getByRole('button')).toBeInTheDocument();
            expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        });

        it('renders correctly with dark theme', () => {
            document.documentElement.setAttribute('data-theme', 'dark');
            render(<Button>Dark Theme</Button>);
            expect(screen.getByRole('button')).toBeInTheDocument();
            expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        });
    });

    // ─── Accessibility ─────────────────────────────────────────────────
    describe('accessibility', () => {
        it('has no accessibility violations (primary)', async () => {
            const { container } = render(<Button>Accessible Button</Button>);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no accessibility violations (icon-only with label)', async () => {
            const { container } = render(
                <Button iconOnly aria-label="Delete">
                    🗑
                </Button>
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no accessibility violations (loading state)', async () => {
            const { container } = render(<Button isLoading>Loading</Button>);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no accessibility violations (disabled state)', async () => {
            const { container } = render(<Button disabled>Disabled</Button>);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    // ─── Snapshot Tests ─────────────────────────────────────────────────
    describe('snapshots', () => {
        it('matches primary variant snapshot', () => {
            const { container } = render(<Button variant="primary">Primary</Button>);
            expect(container.firstChild).toMatchSnapshot();
        });

        it('matches loading state snapshot', () => {
            const { container } = render(<Button isLoading>Loading</Button>);
            expect(container.firstChild).toMatchSnapshot();
        });

        it('matches icon-only snapshot', () => {
            const { container } = render(
                <Button iconOnly aria-label="Add">+</Button>
            );
            expect(container.firstChild).toMatchSnapshot();
        });
    });
});
