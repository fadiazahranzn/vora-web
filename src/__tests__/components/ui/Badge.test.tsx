import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { Badge } from '@/components/ui/Badge';

expect.extend(toHaveNoViolations);

vi.mock('@/components/ui/Badge.module.css', () => ({
    default: {
        badge: 'badge',
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info',
        neutral: 'neutral',
        high: 'high',
        medium: 'medium',
        low: 'low',
    },
}));

describe('Badge', () => {
    // ─── Variant Rendering ───────────────────────────────────────────────
    describe('variants', () => {
        it('renders neutral variant by default', () => {
            render(<Badge>Default</Badge>);
            const badge = screen.getByText('Default');
            expect(badge.className).toContain('neutral');
        });

        it('renders success variant', () => {
            render(<Badge variant="success">Completed</Badge>);
            expect(screen.getByText('Completed').className).toContain('success');
        });

        it('renders error variant', () => {
            render(<Badge variant="error">Failed</Badge>);
            expect(screen.getByText('Failed').className).toContain('error');
        });

        it('renders warning variant', () => {
            render(<Badge variant="warning">Pending</Badge>);
            expect(screen.getByText('Pending').className).toContain('warning');
        });

        it('renders info variant', () => {
            render(<Badge variant="info">New</Badge>);
            expect(screen.getByText('New').className).toContain('info');
        });

        it('renders high priority variant', () => {
            render(<Badge variant="high">High</Badge>);
            expect(screen.getByText('High').className).toContain('high');
        });

        it('renders medium priority variant', () => {
            render(<Badge variant="medium">Medium</Badge>);
            expect(screen.getByText('Medium').className).toContain('medium');
        });

        it('renders low priority variant', () => {
            render(<Badge variant="low">Low</Badge>);
            expect(screen.getByText('Low').className).toContain('low');
        });
    });

    // ─── Content Rendering ──────────────────────────────────────────────
    describe('content', () => {
        it('renders text children', () => {
            render(<Badge>Active</Badge>);
            expect(screen.getByText('Active')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            render(<Badge className="custom">Custom</Badge>);
            expect(screen.getByText('Custom').className).toContain('custom');
        });

        it('passes through additional HTML attributes', () => {
            render(<Badge data-testid="my-badge">Test</Badge>);
            expect(screen.getByTestId('my-badge')).toBeInTheDocument();
        });
    });

    // ─── Semantic HTML ──────────────────────────────────────────────────
    describe('semantic HTML', () => {
        it('renders as a span element', () => {
            render(<Badge>Status</Badge>);
            expect(screen.getByText('Status').tagName).toBe('SPAN');
        });
    });

    // ─── Theme Switching ───────────────────────────────────────────────
    describe('theme switching', () => {
        it('renders in light theme', () => {
            document.documentElement.setAttribute('data-theme', 'light');
            render(<Badge>Light</Badge>);
            expect(screen.getByText('Light')).toBeInTheDocument();
        });

        it('renders in dark theme', () => {
            document.documentElement.setAttribute('data-theme', 'dark');
            render(<Badge>Dark</Badge>);
            expect(screen.getByText('Dark')).toBeInTheDocument();
        });
    });

    // ─── Accessibility ─────────────────────────────────────────────────
    describe('accessibility', () => {
        it('has no violations (neutral)', async () => {
            const { container } = render(<Badge>Status</Badge>);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no violations (success)', async () => {
            const { container } = render(<Badge variant="success">Done</Badge>);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no violations (error)', async () => {
            const { container } = render(<Badge variant="error">Error</Badge>);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    // ─── Snapshots ─────────────────────────────────────────────────────
    describe('snapshots', () => {
        it('matches neutral variant snapshot', () => {
            const { container } = render(<Badge>Default</Badge>);
            expect(container.firstChild).toMatchSnapshot();
        });

        it('matches success variant snapshot', () => {
            const { container } = render(<Badge variant="success">Success</Badge>);
            expect(container.firstChild).toMatchSnapshot();
        });
    });
});
