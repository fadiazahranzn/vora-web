import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { Card } from '@/components/ui/Card';

expect.extend(toHaveNoViolations);

vi.mock('@/components/ui/Card.module.css', () => ({
    default: {
        card: 'card',
        standard: 'standard',
        elevated: 'elevated',
        interactive: 'interactive',
        'p-0': 'p-0',
        'p-sm': 'p-sm',
        'p-md': 'p-md',
        'p-lg': 'p-lg',
    },
}));

describe('Card', () => {
    // ─── Variant Rendering ───────────────────────────────────────────────
    describe('variants', () => {
        it('renders standard variant by default', () => {
            render(<Card data-testid="card">Content</Card>);
            const card = screen.getByTestId('card');
            expect(card).toBeInTheDocument();
            expect(card.className).toContain('standard');
        });

        it('renders elevated variant', () => {
            render(<Card variant="elevated" data-testid="card">Content</Card>);
            expect(screen.getByTestId('card').className).toContain('elevated');
        });

        it('renders interactive variant', () => {
            render(<Card variant="interactive" data-testid="card">Content</Card>);
            expect(screen.getByTestId('card').className).toContain('interactive');
        });
    });

    // ─── Padding ─────────────────────────────────────────────────────────
    describe('padding', () => {
        it('renders medium padding by default', () => {
            render(<Card data-testid="card">Content</Card>);
            expect(screen.getByTestId('card').className).toContain('p-md');
        });

        it('renders no padding', () => {
            render(<Card padding="none" data-testid="card">Content</Card>);
            expect(screen.getByTestId('card').className).toContain('p-0');
        });

        it('renders small padding', () => {
            render(<Card padding="sm" data-testid="card">Content</Card>);
            expect(screen.getByTestId('card').className).toContain('p-sm');
        });

        it('renders large padding', () => {
            render(<Card padding="lg" data-testid="card">Content</Card>);
            expect(screen.getByTestId('card').className).toContain('p-lg');
        });
    });

    // ─── Content Rendering ──────────────────────────────────────────────
    describe('content', () => {
        it('renders children correctly', () => {
            render(
                <Card>
                    <h3>Card Title</h3>
                    <p>Card body text</p>
                </Card>
            );
            expect(screen.getByText('Card Title')).toBeInTheDocument();
            expect(screen.getByText('Card body text')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            render(<Card className="custom-class" data-testid="card">Content</Card>);
            expect(screen.getByTestId('card').className).toContain('custom-class');
        });

        it('passes through additional HTML attributes', () => {
            render(<Card data-testid="card" id="my-card">Content</Card>);
            expect(screen.getByTestId('card')).toHaveAttribute('id', 'my-card');
        });
    });

    // ─── Ref Forwarding ─────────────────────────────────────────────────
    describe('ref forwarding', () => {
        it('forwards ref to the div element', () => {
            const ref = React.createRef<HTMLDivElement>();
            render(<Card ref={ref}>Ref Card</Card>);
            expect(ref.current).toBeInstanceOf(HTMLDivElement);
        });
    });

    // ─── Theme Switching ───────────────────────────────────────────────
    describe('theme switching', () => {
        it('renders correctly with light theme', () => {
            document.documentElement.setAttribute('data-theme', 'light');
            render(<Card data-testid="card">Light</Card>);
            expect(screen.getByTestId('card')).toBeInTheDocument();
        });

        it('renders correctly with dark theme', () => {
            document.documentElement.setAttribute('data-theme', 'dark');
            render(<Card data-testid="card">Dark</Card>);
            expect(screen.getByTestId('card')).toBeInTheDocument();
        });
    });

    // ─── Accessibility ─────────────────────────────────────────────────
    describe('accessibility', () => {
        it('has no accessibility violations (standard)', async () => {
            const { container } = render(<Card>Standard card content</Card>);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no accessibility violations (elevated)', async () => {
            const { container } = render(
                <Card variant="elevated">Elevated card</Card>
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    // ─── Snapshots ─────────────────────────────────────────────────────
    describe('snapshots', () => {
        it('matches standard variant snapshot', () => {
            const { container } = render(<Card>Standard Content</Card>);
            expect(container.firstChild).toMatchSnapshot();
        });

        it('matches elevated variant snapshot', () => {
            const { container } = render(
                <Card variant="elevated" padding="lg">Elevated</Card>
            );
            expect(container.firstChild).toMatchSnapshot();
        });
    });
});
