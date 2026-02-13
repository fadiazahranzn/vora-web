import { render, screen, act } from '@testing-library/react';
import { CircularProgress } from '@/components/analytics/CircularProgress';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

// Mock the CSS module
vi.mock('@/components/analytics/CircularProgress.module.css', () => ({
    default: {
        container: 'container',
        svg: 'svg',
        circleBg: 'circleBg',
        circleProgress: 'circleProgress',
        centeredContent: 'centeredContent',
        percentage: 'percentage',
        label: 'label',
        message: 'message',
    },
}));

describe('CircularProgress', () => {
    it('renders with 0% when there are no habits', () => {
        render(<CircularProgress completed={0} total={0} />);
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText('No habits scheduled today')).toBeInTheDocument();
    });

    it('renders correct percentage', () => {
        render(<CircularProgress completed={3} total={5} />);
        // 60%
        expect(screen.getByText('60%')).toBeInTheDocument();
        expect(screen.queryByText('No habits scheduled today')).not.toBeInTheDocument();
    });

    it('renders 100% correctly', () => {
        render(<CircularProgress completed={5} total={5} />);
        expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('has accessible label', () => {
        render(<CircularProgress completed={1} total={2} />);
        const svg = screen.getByLabelText(/Progress: 50%/i);
        expect(svg).toBeInTheDocument();
    });

    it('clamps percentage to 100%', () => {
        render(<CircularProgress completed={6} total={5} />);
        expect(screen.getByText('100%')).toBeInTheDocument();
    });
});
