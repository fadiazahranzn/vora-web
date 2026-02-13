import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { Modal } from '@/components/ui/Modal';

expect.extend(toHaveNoViolations);

vi.mock('@/components/ui/Modal.module.css', () => ({
    default: {
        overlay: 'overlay',
        modal: 'modal',
        header: 'header',
        title: 'title',
        closeButton: 'closeButton',
        body: 'body',
        footer: 'footer',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
    },
}));

describe('Modal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        title: 'Test Modal',
        children: <p>Modal content</p>,
    };

    beforeEach(() => {
        defaultProps.onClose = vi.fn();
    });

    // ─── Rendering ───────────────────────────────────────────────────────
    describe('rendering', () => {
        it('renders when isOpen is true', () => {
            render(<Modal {...defaultProps} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('Test Modal')).toBeInTheDocument();
            expect(screen.getByText('Modal content')).toBeInTheDocument();
        });

        it('does not render when isOpen is false', () => {
            render(<Modal {...defaultProps} isOpen={false} />);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('renders without title', () => {
            render(<Modal {...defaultProps} title={undefined} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
        });

        it('renders footer when provided', () => {
            render(
                <Modal {...defaultProps} footer={<button>Save</button>} />
            );
            expect(screen.getByText('Save')).toBeInTheDocument();
        });

        it('does not render footer when not provided', () => {
            render(<Modal {...defaultProps} />);
            // Footer should not exist if no footer prop
            const dialog = screen.getByRole('dialog');
            expect(dialog.querySelectorAll('.footer')).toHaveLength(0);
        });
    });

    // ─── Sizes ───────────────────────────────────────────────────────────
    describe('sizes', () => {
        it('renders medium size by default', () => {
            render(<Modal {...defaultProps} />);
            const dialog = screen.getByRole('dialog');
            expect(dialog.className).toContain('md');
        });

        it('renders small size', () => {
            render(<Modal {...defaultProps} size="sm" />);
            const dialog = screen.getByRole('dialog');
            expect(dialog.className).toContain('sm');
        });

        it('renders large size', () => {
            render(<Modal {...defaultProps} size="lg" />);
            const dialog = screen.getByRole('dialog');
            expect(dialog.className).toContain('lg');
        });
    });

    // ─── Dismiss Behavior ───────────────────────────────────────────────
    describe('dismiss behavior', () => {
        it('calls onClose when Escape key is pressed', () => {
            render(<Modal {...defaultProps} />);
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });

        it('calls onClose when close button is clicked', async () => {
            const user = userEvent.setup();
            render(<Modal {...defaultProps} />);
            const closeButton = screen.getByLabelText('Close modal');
            await user.click(closeButton);
            expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });

        it('calls onClose when overlay is clicked', () => {
            render(<Modal {...defaultProps} />);
            // Overlay wraps the dialog; click on overlay itself
            const overlay = screen.getByRole('dialog').parentElement!;
            fireEvent.click(overlay);
            expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });

        it('does not call onClose when modal content is clicked', () => {
            render(<Modal {...defaultProps} />);
            fireEvent.click(screen.getByText('Modal content'));
            expect(defaultProps.onClose).not.toHaveBeenCalled();
        });
    });

    // ─── Focus Trap ─────────────────────────────────────────────────────
    describe('focus trap', () => {
        it('focuses the first focusable element when opened', async () => {
            render(<Modal {...defaultProps} />);
            await waitFor(() => {
                // The close button should receive focus as first focusable element
                const closeButton = screen.getByLabelText('Close modal');
                expect(document.activeElement).toBe(closeButton);
            });
        });

        it('prevents body scrolling when open', () => {
            render(<Modal {...defaultProps} />);
            expect(document.body.style.overflow).toBe('hidden');
        });

        it('restores body scrolling when closed', () => {
            const { unmount } = render(<Modal {...defaultProps} />);
            unmount();
            expect(document.body.style.overflow).toBe('unset');
        });
    });

    // ─── ARIA attributes ───────────────────────────────────────────────
    describe('ARIA attributes', () => {
        it('has role="dialog"', () => {
            render(<Modal {...defaultProps} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('has aria-modal="true"', () => {
            render(<Modal {...defaultProps} />);
            expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
        });

        it('has aria-labelledby when title is provided', () => {
            render(<Modal {...defaultProps} />);
            expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title');
        });

        it('does not have aria-labelledby without title', () => {
            render(<Modal {...defaultProps} title={undefined} />);
            expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
        });
    });

    // ─── Theme Switching ───────────────────────────────────────────────
    describe('theme switching', () => {
        it('renders with light theme', () => {
            document.documentElement.setAttribute('data-theme', 'light');
            render(<Modal {...defaultProps} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('renders with dark theme', () => {
            document.documentElement.setAttribute('data-theme', 'dark');
            render(<Modal {...defaultProps} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    // ─── Accessibility ─────────────────────────────────────────────────
    describe('accessibility', () => {
        it('has no accessibility violations', async () => {
            const { container } = render(<Modal {...defaultProps} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no violations with footer', async () => {
            const { container } = render(
                <Modal {...defaultProps} footer={<button>Confirm</button>} />
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    // ─── Snapshots ─────────────────────────────────────────────────────
    describe('snapshots', () => {
        it('matches open modal snapshot', () => {
            const { baseElement } = render(<Modal {...defaultProps} />);
            expect(baseElement).toMatchSnapshot();
        });
    });
});
