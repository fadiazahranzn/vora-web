import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { ProgressBar } from '@/components/ui/ProgressBar';

expect.extend(toHaveNoViolations);

vi.mock('@/components/ui/ProgressBar.module.css', () => ({
    default: {
        container: 'container',
        bar: 'bar',
        label: 'label',
    },
}));

describe('ProgressBar', () => {
    // ─── Basic Rendering ───────────────────────────────────────────────
    describe('rendering', () => {
        it('renders a progress bar', () => {
            render(<ProgressBar value={50} />);
            const bar = screen.getByRole('progressbar');
            expect(bar).toBeInTheDocument();
        });

        it('renders with correct aria-valuenow', () => {
            render(<ProgressBar value={75} />);
            expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
        });

        it('renders with aria-valuemin=0', () => {
            render(<ProgressBar value={50} />);
            expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0');
        });

        it('renders with aria-valuemax defaulting to 100', () => {
            render(<ProgressBar value={50} />);
            expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
        });

        it('renders with custom max value', () => {
            render(<ProgressBar value={5} max={10} />);
            expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '10');
        });
    });

    // ─── Percentage Calculation ────────────────────────────────────────
    describe('percentage calculation', () => {
        it('calculates correct width for 50%', () => {
            render(<ProgressBar value={50} />);
            const bar = screen.getByRole('progressbar');
            expect(bar.style.width).toBe('50%');
        });

        it('calculates correct width with custom max', () => {
            render(<ProgressBar value={3} max={10} />);
            const bar = screen.getByRole('progressbar');
            expect(bar.style.width).toBe('30%');
        });

        it('clamps to 0% for negative values', () => {
            render(<ProgressBar value={-10} />);
            const bar = screen.getByRole('progressbar');
            expect(bar.style.width).toBe('0%');
        });

        it('clamps to 100% for overflow values', () => {
            render(<ProgressBar value={150} />);
            const bar = screen.getByRole('progressbar');
            expect(bar.style.width).toBe('100%');
        });

        it('handles zero value', () => {
            render(<ProgressBar value={0} />);
            const bar = screen.getByRole('progressbar');
            expect(bar.style.width).toBe('0%');
        });

        it('handles 100% value', () => {
            render(<ProgressBar value={100} />);
            const bar = screen.getByRole('progressbar');
            expect(bar.style.width).toBe('100%');
        });
    });

    // ─── Label ─────────────────────────────────────────────────────────
    describe('label', () => {
        it('shows label when showLabel is true', () => {
            render(<ProgressBar value={50} showLabel label="Progress" />);
            expect(screen.getByText('Progress')).toBeInTheDocument();
        });

        it('does not show label by default', () => {
            render(<ProgressBar value={50} label="Progress" />);
            expect(screen.queryByText('Progress')).not.toBeInTheDocument();
        });
    });

    // ─── Percentage Display ────────────────────────────────────────────
    describe('percentage display', () => {
        it('shows percentage when showPercentage is true', () => {
            render(<ProgressBar value={75} showPercentage />);
            expect(screen.getByText('75%')).toBeInTheDocument();
        });

        it('does not show percentage by default', () => {
            render(<ProgressBar value={75} />);
            expect(screen.queryByText('75%')).not.toBeInTheDocument();
        });

        it('rounds percentage display', () => {
            render(<ProgressBar value={1} max={3} showPercentage />);
            expect(screen.getByText('33%')).toBeInTheDocument();
        });

        it('shows both label and percentage', () => {
            render(<ProgressBar value={60} showLabel showPercentage label="Tasks" />);
            expect(screen.getByText('Tasks')).toBeInTheDocument();
            expect(screen.getByText('60%')).toBeInTheDocument();
        });
    });

    // ─── Custom ClassName ─────────────────────────────────────────────
    describe('custom className', () => {
        it('applies custom className to wrapper', () => {
            const { container } = render(
                <ProgressBar value={50} className="my-progress" />
            );
            expect(container.firstChild).toHaveClass('my-progress');
        });
    });

    // ─── Theme Switching ───────────────────────────────────────────────
    describe('theme switching', () => {
        it('renders in light theme', () => {
            document.documentElement.setAttribute('data-theme', 'light');
            render(<ProgressBar value={50} />);
            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        });

        it('renders in dark theme', () => {
            document.documentElement.setAttribute('data-theme', 'dark');
            render(<ProgressBar value={50} />);
            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        });
    });

    // ─── Accessibility ─────────────────────────────────────────────────
    describe('accessibility', () => {
        it('has no violations', async () => {
            const { container } = render(<ProgressBar value={50} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no violations with label and percentage', async () => {
            const { container } = render(
                <ProgressBar value={75} showLabel showPercentage label="Loading" />
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    // ─── Snapshots ─────────────────────────────────────────────────────
    describe('snapshots', () => {
        it('matches basic progress bar snapshot', () => {
            const { container } = render(<ProgressBar value={50} />);
            expect(container.firstChild).toMatchSnapshot();
        });

        it('matches full-featured progress bar snapshot', () => {
            const { container } = render(
                <ProgressBar value={80} showLabel showPercentage label="Upload" />
            );
            expect(container.firstChild).toMatchSnapshot();
        });
    });
});
