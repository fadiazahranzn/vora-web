'use client';

import React from 'react';
import { CircularProgress } from '@/components/analytics/CircularProgress';
import { ActivityLineChart } from '@/components/analytics/ActivityLineChart';
import { useCompletionRate } from '@/hooks/useCompletionRate';
import { HeatmapCalendar } from '@/components/analytics/HeatmapCalendar';
import { StatsCards } from '@/components/analytics/StatsCards';

export default function AnalyticsPage() {
    const { data, isLoading, error } = useCompletionRate();

    return (
        <div className="analytics-container">
            <h1>Analytics</h1>

            <div className="stats-section">
                <StatsCards />
            </div>

            <div className="grid-container">
                <section className="chart-section daily-progress">
                    <h2>Daily Progress</h2>
                    {isLoading ? (
                        <div className="loading-state">Loading...</div>
                    ) : error ? (
                        <div className="error-state">Error loading data</div>
                    ) : (
                        <CircularProgress
                            completed={data?.completed ?? 0}
                            total={data?.total ?? 0}
                        />
                    )}
                </section>

                <ActivityLineChart />
            </div>

            <div className="heatmap-section">
                <HeatmapCalendar />
            </div>
        </div>

    );
}
