import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

expect.extend(toHaveNoViolations);

vi.mock('@/components/ui/Skeleton.module.css', () => ({
    default: {
        skeleton: 'skeleton',
        line: 'line',
        circle: 'circle',
        rect: 'rect',
    },
}));

describe('Skeleton', () => {
    // ─── Variant Rendering ───────────────────────────────────────────────
    describe('variants', () => {
        it('renders line variant by default', () => {
            render(<Skeleton data-testid="skeleton" />);
            expect(screen.getByTestId('skeleton').className).toContain('line');
        });

        it('renders circle variant', () => {
            render(<Skeleton variant="circle" data-testid="skeleton" />);
            expect(screen.getByTestId('skeleton').className).toContain('circle');
        });

        it('renders rect variant', () => {
            render(<Skeleton variant="rect" data-testid="skeleton" />);
            expect(screen.getByTestId('skeleton').className).toContain('rect');
        });
    });

    // ─── Dimensions ─────────────────────────────────────────────────────
    describe('dimensions', () => {
        it('applies width as number (converts to px)', () => {
            render(<Skeleton width={200} data-testid="skeleton" />);
            expect(screen.getByTestId('skeleton').style.width).toBe('200px');
        });

        it('applies height as number (converts to px)', () => {
            render(<Skeleton height={50} data-testid="skeleton" />);
            expect(screen.getByTestId('skeleton').style.height).toBe('50px');
        });

        it('applies width as string', () => {
            render(<Skeleton width="100%" data-testid="skeleton" />);
            expect(screen.getByTestId('skeleton').style.width).toBe('100%');
        });

        it('applies height as string', () => {
            render(<Skeleton height="3rem" data-testid="skeleton" />);
            expect(screen.getByTestId('skeleton').style.height).toBe('3rem');
        });

        it('applies both width and height', () => {
            render(<Skeleton width={100} height={100} data-testid="skeleton" />);
            const skeleton = screen.getByTestId('skeleton');
            expect(skeleton.style.width).toBe('100px');
            expect(skeleton.style.height).toBe('100px');
        });
    });

    // ─── Custom Props ──────────────────────────────────────────────────
    describe('custom props', () => {
        it('applies custom className', () => {
            render(<Skeleton className="custom-skeleton" data-testid="skeleton" />);
            expect(screen.getByTestId('skeleton').className).toContain('custom-skeleton');
        });

        it('merges custom styles', () => {
            render(
                <Skeleton
                    style={{ borderRadius: '8px' }}
                    width={100}
                    data-testid="skeleton"
                />
            );
            const skeleton = screen.getByTestId('skeleton');
            expect(skeleton.style.borderRadius).toBe('8px');
            expect(skeleton.style.width).toBe('100px');
        });

        it('passes through data attributes', () => {
            render(<Skeleton data-testid="skeleton" data-custom="value" />);
            expect(screen.getByTestId('skeleton')).toHaveAttribute('data-custom', 'value');
        });
    });

    // ─── Semantic HTML ──────────────────────────────────────────────────
    describe('semantic HTML', () => {
        it('renders as a div element', () => {
            render(<Skeleton data-testid="skeleton" />);
            expect(screen.getByTestId('skeleton').tagName).toBe('DIV');
        });
    });

    // ─── Theme Switching ───────────────────────────────────────────────
    describe('theme switching', () => {
        it('renders in light theme', () => {
            document.documentElement.setAttribute('data-theme', 'light');
            render(<Skeleton data-testid="skeleton" />);
            expect(screen.getByTestId('skeleton')).toBeInTheDocument();
        });

        it('renders in dark theme', () => {
            document.documentElement.setAttribute('data-theme', 'dark');
            render(<Skeleton data-testid="skeleton" />);
            expect(screen.getByTestId('skeleton')).toBeInTheDocument();
        });
    });

    // ─── Accessibility ─────────────────────────────────────────────────
    describe('accessibility', () => {
        it('has no violations (line variant)', async () => {
            const { container } = render(<Skeleton />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no violations (circle variant)', async () => {
            const { container } = render(<Skeleton variant="circle" width={48} height={48} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    // ─── Snapshots ─────────────────────────────────────────────────────
    describe('snapshots', () => {
        it('matches line variant snapshot', () => {
            const { container } = render(<Skeleton width="100%" height={16} />);
            expect(container.firstChild).toMatchSnapshot();
        });

        it('matches circle variant snapshot', () => {
            const { container } = render(
                <Skeleton variant="circle" width={48} height={48} />
            );
            expect(container.firstChild).toMatchSnapshot();
        });
    });
});
