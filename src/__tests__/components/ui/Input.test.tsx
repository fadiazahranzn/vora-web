import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { Input } from '@/components/ui/Input';

expect.extend(toHaveNoViolations);

vi.mock('@/components/ui/Input.module.css', () => ({
    default: {
        container: 'container',
        input: 'input',
        inputWrapper: 'inputWrapper',
        label: 'label',
        error: 'error',
        errorText: 'errorText',
        helperText: 'helperText',
        textarea: 'textarea',
    },
}));

describe('Input', () => {
    // ─── Basic Rendering ───────────────────────────────────────────────
    describe('rendering', () => {
        it('renders a text input by default', () => {
            render(<Input placeholder="Type here" />);
            expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
        });

        it('renders with a label', () => {
            render(<Input label="Email" />);
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
        });

        it('renders a textarea when multiline is true', () => {
            render(<Input multiline label="Message" />);
            const textarea = screen.getByLabelText('Message');
            expect(textarea.tagName).toBe('TEXTAREA');
        });
    });

    // ─── Error State ──────────────────────────────────────────────────
    describe('error state', () => {
        it('displays error message', () => {
            render(<Input error="This field is required" />);
            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });

        it('sets aria-invalid when error is present', () => {
            render(<Input error="Error" label="Name" />);
            const input = screen.getByLabelText('Name');
            expect(input).toHaveAttribute('aria-invalid', 'true');
        });

        it('has role="alert" on the error message', () => {
            render(<Input error="Required" />);
            expect(screen.getByRole('alert')).toHaveTextContent('Required');
        });

        it('links input to error message via aria-describedby', () => {
            render(<Input error="Must be valid" label="Email" id="email-input" />);
            const input = screen.getByLabelText('Email');
            expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('error'));
        });
    });

    // ─── Helper Text ──────────────────────────────────────────────────
    describe('helper text', () => {
        it('displays helper text', () => {
            render(<Input helperText="Enter your email address" />);
            expect(screen.getByText('Enter your email address')).toBeInTheDocument();
        });

        it('hides helper text when error is present', () => {
            render(<Input helperText="Help" error="Error" />);
            expect(screen.queryByText('Help')).not.toBeInTheDocument();
            expect(screen.getByText('Error')).toBeInTheDocument();
        });
    });

    // ─── User Interaction ─────────────────────────────────────────────
    describe('interactions', () => {
        it('allows typing into input', async () => {
            const user = userEvent.setup();
            render(<Input label="Username" />);
            const input = screen.getByLabelText('Username');
            await user.type(input, 'john_doe');
            expect(input).toHaveValue('john_doe');
        });

        it('allows typing into textarea', async () => {
            const user = userEvent.setup();
            render(<Input multiline label="Bio" />);
            const textarea = screen.getByLabelText('Bio');
            await user.type(textarea, 'Hello World');
            expect(textarea).toHaveValue('Hello World');
        });

        it('calls onChange when typing', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<Input label="Name" onChange={handleChange} />);
            await user.type(screen.getByLabelText('Name'), 'A');
            expect(handleChange).toHaveBeenCalled();
        });
    });

    // ─── Disabled State ───────────────────────────────────────────────
    describe('disabled state', () => {
        it('disables the input', () => {
            render(<Input label="Disabled" disabled />);
            expect(screen.getByLabelText('Disabled')).toBeDisabled();
        });
    });

    // ─── Ref Forwarding ───────────────────────────────────────────────
    describe('ref forwarding', () => {
        it('forwards ref to the input element', () => {
            const ref = React.createRef<HTMLInputElement>();
            render(<Input ref={ref} />);
            expect(ref.current).toBeInstanceOf(HTMLInputElement);
        });
    });

    // ─── Theme Switching ───────────────────────────────────────────────
    describe('theme switching', () => {
        it('renders with light theme', () => {
            document.documentElement.setAttribute('data-theme', 'light');
            render(<Input label="Light" />);
            expect(screen.getByLabelText('Light')).toBeInTheDocument();
        });

        it('renders with dark theme', () => {
            document.documentElement.setAttribute('data-theme', 'dark');
            render(<Input label="Dark" />);
            expect(screen.getByLabelText('Dark')).toBeInTheDocument();
        });
    });

    // ─── Accessibility ─────────────────────────────────────────────────
    describe('accessibility', () => {
        it('has no violations (basic input)', async () => {
            const { container } = render(<Input label="Name" />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no violations (with error)', async () => {
            const { container } = render(
                <Input label="Email" error="Invalid email" />
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has no violations (textarea)', async () => {
            const { container } = render(<Input label="Message" multiline />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    // ─── Snapshots ─────────────────────────────────────────────────────
    describe('snapshots', () => {
        it('matches default input snapshot', () => {
            const { container } = render(<Input label="Name" placeholder="Enter" />);
            expect(container.firstChild).toMatchSnapshot();
        });

        it('matches error state snapshot', () => {
            const { container } = render(
                <Input label="Email" error="Required" />
            );
            expect(container.firstChild).toMatchSnapshot();
        });
    });
});
