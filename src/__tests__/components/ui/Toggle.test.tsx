import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { Toggle } from '@/components/ui/Toggle';

expect.extend(toHaveNoViolations);

vi.mock('@/components/ui/Toggle.module.css', () => ({
    default: {
        label: 'label',
        input: 'input',
        switch: 'switch',
        thumb: 'thumb',
        checked: 'checked',
        disabled: 'disabled',
    },
}));

describe('Toggle', () => {
    const defaultProps = {
        checked: false,
        onChange: vi.fn(),
    };

    // ─── Rendering ───────────────────────────────────────────────────────
    describe('rendering', () => {
        it('renders unchecked toggle', () => {
            render(<Toggle {...defaultProps} label="Notifications" />);
            const toggle = screen.getByRole('switch');
            expect(toggle).toBeInTheDocument();
            expect(toggle).not.toBeChecked();
        });

        it('renders checked toggle', () => {
            render(<Toggle {...defaultProps} checked={true} label="Enabled" />);
            expect(screen.getByRole('switch')).toBeChecked();
        });

        it('renders with label', () => {
            render(<Toggle {...defaultProps} label="Dark Mode" />);
            expect(screen.getByText('Dark Mode')).toBeInTheDocument();
        });

        it('renders without label', () => {
            render(<Toggle {...defaultProps} />);
            const toggle = screen.getByRole('switch');
            expect(toggle).toBeInTheDocument();
        });
    });

    // ─── Interactions ──────────────────────────────────────────────────
    describe('interactions', () => {
        it('calls onChange when clicked', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<Toggle checked={false} onChange={handleChange} label="Toggle" />);
            await user.click(screen.getByRole('switch'));
            expect(handleChange).toHaveBeenCalledWith(true);
        });

        it('does not call onChange when disabled', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<Toggle checked={false} onChange={handleChange} disabled label="Toggle" />);
            await user.click(screen.getByRole('switch'));
            expect(handleChange).not.toHaveBeenCalled();
        });
    });

    // ─── Keyboard Navigation ──────────────────────────────────────────
    describe('keyboard navigation', () => {
        it('can be toggled with Space key', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<Toggle checked={false} onChange={handleChange} label="Toggle" />);
            const toggle = screen.getByRole('switch');
            toggle.focus();
            await user.keyboard(' ');
            expect(handleChange).toHaveBeenCalled();
        });

        it('is focusable', () => {
            render(<Toggle {...defaultProps} label="Focus me" />);
            const toggle = screen.getByRole('switch');
            toggle.focus();
            expect(document.activeElement).toBe(toggle);
        });
    });

    // ─── Disabled State ───────────────────────────────────────────────
    describe('disabled state', () => {
        it('renders as disabled', () => {
            render(<Toggle {...defaultProps} disabled label="Disabled" />);
            expect(screen.getByRole('switch')).toBeDisabled();
        });
    });

    // ─── ARIA Attributes ──────────────────────────────────────────────
    describe('ARIA attributes', () => {
        it('has role="switch"', () => {
            render(<Toggle {...defaultProps} label="Switch" />);
            expect(screen.getByRole('switch')).toBeInTheDocument();
        });

        it('has aria-checked matching checked state', () => {
            const { rerender } = render(<Toggle {...defaultProps} checked={false} />);
            expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

            rerender(<Toggle {...defaultProps} checked={true} />);
            expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
        });
    });

    // ─── Theme Switching ───────────────────────────────────────────────
    describe('theme switching', () => {
        it('renders in light theme', () => {
            document.documentElement.setAttribute('data-theme', 'light');
            render(<Toggle {...defaultProps} label="Light" />);
            expect(screen.getByRole('switch')).toBeInTheDocument();
        });

        it('renders in dark theme', () => {
            document.documentElement.setAttribute('data-theme', 'dark');
            render(<Toggle {...defaultProps} label="Dark" />);
            expect(screen.getByRole('switch')).toBeInTheDocument();
        });
    });

    // ─── Accessibility ─────────────────────────────────────────────────
    describe('accessibility', () => {
        it('has no violations (unchecked)', async () => {
            const { container } = render(<Toggle {...defaultProps} label="Notifications" />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no violations (checked)', async () => {
            const { container } = render(
                <Toggle {...defaultProps} checked={true} label="Enabled" />
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no violations (disabled)', async () => {
            const { container } = render(
                <Toggle {...defaultProps} disabled label="Disabled" />
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    // ─── Snapshots ─────────────────────────────────────────────────────
    describe('snapshots', () => {
        it('matches unchecked snapshot', () => {
            const { container } = render(<Toggle {...defaultProps} label="Off" />);
            expect(container.firstChild).toMatchSnapshot();
        });

        it('matches checked snapshot', () => {
            const { container } = render(
                <Toggle {...defaultProps} checked={true} label="On" />
            );
            expect(container.firstChild).toMatchSnapshot();
        });
    });
});
