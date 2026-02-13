import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';

expect.extend(toHaveNoViolations);

vi.mock('@/components/ui/BottomSheet.module.css', () => ({
    default: {
        overlay: 'overlay',
        sheet: 'sheet',
        handle: 'handle',
        header: 'header',
        title: 'title',
        closeButton: 'closeButton',
        body: 'body',
    },
}));

describe('BottomSheet', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        title: 'Sheet Title',
        children: <p>Sheet content</p>,
    };

    beforeEach(() => {
        defaultProps.onClose = vi.fn();
    });

    // ─── Rendering ───────────────────────────────────────────────────────
    describe('rendering', () => {
        it('renders when isOpen is true', () => {
            render(<BottomSheet {...defaultProps} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('Sheet Title')).toBeInTheDocument();
            expect(screen.getByText('Sheet content')).toBeInTheDocument();
        });

        it('does not render when isOpen is false', () => {
            render(<BottomSheet {...defaultProps} isOpen={false} />);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('renders without title', () => {
            render(<BottomSheet {...defaultProps} title={undefined} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument();
        });
    });

    // ─── Dismiss Behavior ───────────────────────────────────────────────
    describe('dismiss behavior', () => {
        it('calls onClose when close button is clicked', async () => {
            const user = userEvent.setup();
            render(<BottomSheet {...defaultProps} />);
            const closeButton = screen.getByLabelText('Close sheet');
            await user.click(closeButton);
            expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });

        it('calls onClose when overlay is clicked', () => {
            render(<BottomSheet {...defaultProps} />);
            const overlay = screen.getByRole('dialog').parentElement!;
            fireEvent.click(overlay);
            expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });

        it('does not call onClose when sheet content is clicked', () => {
            render(<BottomSheet {...defaultProps} />);
            fireEvent.click(screen.getByText('Sheet content'));
            expect(defaultProps.onClose).not.toHaveBeenCalled();
        });
    });

    // ─── Body Scroll Lock ──────────────────────────────────────────────
    describe('body scroll lock', () => {
        it('locks body scroll when open', () => {
            render(<BottomSheet {...defaultProps} />);
            expect(document.body.style.overflow).toBe('hidden');
        });

        it('restores body scroll when closed', () => {
            const { unmount } = render(<BottomSheet {...defaultProps} />);
            unmount();
            expect(document.body.style.overflow).toBe('unset');
        });
    });

    // ─── ARIA Attributes ──────────────────────────────────────────────
    describe('ARIA attributes', () => {
        it('has role="dialog"', () => {
            render(<BottomSheet {...defaultProps} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('has aria-modal="true"', () => {
            render(<BottomSheet {...defaultProps} />);
            expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
        });

        it('has aria-labelledby when title is provided', () => {
            render(<BottomSheet {...defaultProps} />);
            expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'sheet-title');
        });

        it('does not have aria-labelledby without title', () => {
            render(<BottomSheet {...defaultProps} title={undefined} />);
            expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
        });
    });

    // ─── Theme Switching ───────────────────────────────────────────────
    describe('theme switching', () => {
        it('renders in light theme', () => {
            document.documentElement.setAttribute('data-theme', 'light');
            render(<BottomSheet {...defaultProps} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('renders in dark theme', () => {
            document.documentElement.setAttribute('data-theme', 'dark');
            render(<BottomSheet {...defaultProps} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    // ─── Accessibility ─────────────────────────────────────────────────
    describe('accessibility', () => {
        it('has no accessibility violations', async () => {
            const { container } = render(<BottomSheet {...defaultProps} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('close button is accessible', () => {
            render(<BottomSheet {...defaultProps} />);
            const closeBtn = screen.getByLabelText('Close sheet');
            expect(closeBtn).toBeInTheDocument();
        });
    });

    // ─── Snapshots ─────────────────────────────────────────────────────
    describe('snapshots', () => {
        it('matches open sheet snapshot', () => {
            const { baseElement } = render(<BottomSheet {...defaultProps} />);
            expect(baseElement).toMatchSnapshot();
        });
    });
});
