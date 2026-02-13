import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

expect.extend(toHaveNoViolations);

// Mock CSS module
vi.mock('@/components/ui/ThemeSwitcher.module.css', () => ({
    default: {
        container: 'container',
        option: 'option',
        active: 'active',
        srOnly: 'srOnly',
    },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Sun: ({ size }: { size: number }) => <svg data-testid="sun-icon" width={size} height={size} />,
    Moon: ({ size }: { size: number }) => <svg data-testid="moon-icon" width={size} height={size} />,
    Monitor: ({ size }: { size: number }) => <svg data-testid="monitor-icon" width={size} height={size} />,
}));

// Mock ThemeContext
const mockSetTheme = vi.fn();
let mockTheme = 'system';

vi.mock('@/contexts/ThemeContext', () => ({
    useTheme: () => ({
        theme: mockTheme,
        setTheme: mockSetTheme,
        resolvedTheme: mockTheme === 'dark' ? 'dark' : 'light',
    }),
}));

// Import after mocks
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

describe('ThemeSwitcher', () => {
    beforeEach(() => {
        mockTheme = 'system';
        mockSetTheme.mockClear();
    });

    // ─── Rendering ───────────────────────────────────────────────────────
    describe('rendering', () => {
        it('renders three theme options', () => {
            render(<ThemeSwitcher />);
            const radioButtons = screen.getAllByRole('radio');
            expect(radioButtons).toHaveLength(3);
        });

        it('renders Light, Dark, and System options', () => {
            render(<ThemeSwitcher />);
            expect(screen.getByText('Light')).toBeInTheDocument();
            expect(screen.getByText('Dark')).toBeInTheDocument();
            expect(screen.getByText('System')).toBeInTheDocument();
        });

        it('renders all three icons', () => {
            render(<ThemeSwitcher />);
            expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
            expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
            expect(screen.getByTestId('monitor-icon')).toBeInTheDocument();
        });

        it('has radiogroup role on container', () => {
            render(<ThemeSwitcher />);
            expect(screen.getByRole('radiogroup')).toBeInTheDocument();
        });

        it('has accessible label on radiogroup', () => {
            render(<ThemeSwitcher />);
            expect(screen.getByRole('radiogroup')).toHaveAttribute(
                'aria-label',
                'Theme preference'
            );
        });
    });

    // ─── Active State ─────────────────────────────────────────────────
    describe('active state', () => {
        it('sets system as active by default', () => {
            render(<ThemeSwitcher />);
            const radioButtons = screen.getAllByRole('radio');
            // System is the 3rd option
            const systemBtn = radioButtons[2];
            expect(systemBtn).toHaveAttribute('aria-checked', 'true');
        });

        it('marks light as active when theme is light', () => {
            mockTheme = 'light';
            render(<ThemeSwitcher />);
            const radioButtons = screen.getAllByRole('radio');
            const lightBtn = radioButtons[0];
            expect(lightBtn).toHaveAttribute('aria-checked', 'true');
        });

        it('marks dark as active when theme is dark', () => {
            mockTheme = 'dark';
            render(<ThemeSwitcher />);
            const radioButtons = screen.getAllByRole('radio');
            const darkBtn = radioButtons[1];
            expect(darkBtn).toHaveAttribute('aria-checked', 'true');
        });
    });

    // ─── Theme Switching Behavior ─────────────────────────────────────
    describe('theme switching behavior', () => {
        it('calls setTheme with "light" when Light is clicked', async () => {
            const user = userEvent.setup();
            render(<ThemeSwitcher />);
            const lightButton = screen.getByTitle('Light');
            await user.click(lightButton);
            expect(mockSetTheme).toHaveBeenCalledWith('light');
        });

        it('calls setTheme with "dark" when Dark is clicked', async () => {
            const user = userEvent.setup();
            render(<ThemeSwitcher />);
            const darkButton = screen.getByTitle('Dark');
            await user.click(darkButton);
            expect(mockSetTheme).toHaveBeenCalledWith('dark');
        });

        it('calls setTheme with "system" when System is clicked', async () => {
            const user = userEvent.setup();
            mockTheme = 'light';
            render(<ThemeSwitcher />);
            const systemButton = screen.getByTitle('System');
            await user.click(systemButton);
            expect(mockSetTheme).toHaveBeenCalledWith('system');
        });
    });

    // ─── ARIA attributes ──────────────────────────────────────────────
    describe('ARIA attributes', () => {
        it('each option has role="radio"', () => {
            render(<ThemeSwitcher />);
            const radios = screen.getAllByRole('radio');
            expect(radios).toHaveLength(3);
        });

        it('each option has a title attribute', () => {
            render(<ThemeSwitcher />);
            expect(screen.getByTitle('Light')).toBeInTheDocument();
            expect(screen.getByTitle('Dark')).toBeInTheDocument();
            expect(screen.getByTitle('System')).toBeInTheDocument();
        });

        it('non-active options have aria-checked="false"', () => {
            render(<ThemeSwitcher />);
            const radios = screen.getAllByRole('radio');
            // Light and Dark are not active when theme = system
            expect(radios[0]).toHaveAttribute('aria-checked', 'false');
            expect(radios[1]).toHaveAttribute('aria-checked', 'false');
        });
    });

    // ─── Accessibility ─────────────────────────────────────────────────
    describe('accessibility', () => {
        it('has no accessibility violations', async () => {
            const { container } = render(<ThemeSwitcher />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    // ─── Snapshots ─────────────────────────────────────────────────────
    describe('snapshots', () => {
        it('matches system-active snapshot', () => {
            const { container } = render(<ThemeSwitcher />);
            expect(container.firstChild).toMatchSnapshot();
        });
    });
});
