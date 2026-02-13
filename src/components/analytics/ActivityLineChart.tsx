'use client';

import React, { useState, Suspense, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import styles from './ActivityLineChart.module.css';

// Lazy load the chart implementation to reduce initial bundle size
const LazyChart = React.lazy(() => import('./ActivityChartImpl'));

type ViewType = 'weekly' | 'monthly' | 'yearly';

interface ChartDataPoint {
    date: string;
    rate: number;
}

export function ActivityLineChart() {
    const [view, setView] = useState<ViewType>('weekly');

    const { data, isLoading, error } = useQuery<ChartDataPoint[]>({
        queryKey: ['analytics', 'chart', view],
        queryFn: async () => {
            const res = await fetch(`/api/analytics/chart?view=${view}`);
            if (!res.ok) {
                throw new Error('Failed to fetch activity data');
            }
            return res.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });

    return (
        <section className={styles.container} aria-label="Activity Line Chart">
            <div className={styles.header}>
                <h3 className={styles.title}>Activity</h3>
                <div className={styles.toggleGroup} role="group" aria-label="View toggle">
                    <button
                        className={`${styles.toggleButton} ${view === 'weekly' ? styles.active : ''}`}
                        onClick={() => setView('weekly')}
                        aria-pressed={view === 'weekly'}
                    >
                        Weekly
                    </button>
                    <button
                        className={`${styles.toggleButton} ${view === 'monthly' ? styles.active : ''}`}
                        onClick={() => setView('monthly')}
                        aria-pressed={view === 'monthly'}
                    >
                        Monthly
                    </button>
                    <button
                        className={`${styles.toggleButton} ${view === 'yearly' ? styles.active : ''}`}
                        onClick={() => setView('yearly')}
                        aria-pressed={view === 'yearly'}
                    >
                        Yearly
                    </button>
                </div>
            </div>

            <div className={styles.chartContainer}>
                {isLoading ? (
                    <div className={styles.loadingState}>Loading chart...</div>
                ) : error ? (
                    <div className={styles.errorState}>Error loading data</div>
                ) : !data || data.length === 0 ? (
                    <div className={styles.emptyState}>No activity recorded for this period.</div>
                ) : (
                    <Suspense fallback={<div className={styles.loadingState}>Loading chart...</div>}>
                        <LazyChart data={data} view={view} />
                    </Suspense>
                )}
            </div>
        </section>
    );
}
