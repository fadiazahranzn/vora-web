'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CircularProgress } from '@/components/analytics/CircularProgress';
import { ActivityLineChart } from '@/components/analytics/ActivityLineChart';
import { useCompletionRate } from '@/hooks/useCompletionRate';
import { HeatmapCalendar } from '@/components/analytics/HeatmapCalendar';
import { StatsCards } from '@/components/analytics/StatsCards';

export default function AnalyticsPage() {
    const { data, isLoading, error } = useCompletionRate();

    return (
        <DashboardLayout>
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

            <style jsx>{`
        .analytics-container {
            display: flex;
            flex-direction: column;
            gap: var(--vora-space-6);
            padding-bottom: var(--vora-space-8);
        }
        
        h1 {
            margin-bottom: var(--vora-space-2);
        }
        
        .stats-section {
            margin-bottom: var(--vora-space-6);
        }

        .grid-container {
            display: flex;
            flex-direction: column;
            gap: var(--vora-space-6);
        }

        .heatmap-section {
            margin-top: var(--vora-space-2);
        }

        /* Desktop: Maybe switch to grid? For now column is fine as charts are wide */
        @media (min-width: 1024px) {
             .grid-container {
                display: grid;
                grid-template-columns: 350px 1fr;
                align-items: start;
             }
        }

        .chart-section {
            background: var(--vora-color-bg-secondary); /* or card-bg */
            
            border-radius: var(--vora-radius-lg);
            padding: var(--vora-space-6);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--vora-space-4);
            box-shadow: var(--vora-shadow-sm);
            height: 100%; /* Match height if in grid */
        }
        
        h2 {
            align-self: flex-start;
            margin-bottom: var(--vora-space-2);
            font-size: var(--vora-font-size-h3);
        }
        
        .loading-state, .error-state {
            padding: var(--vora-space-8);
            color: var(--vora-color-text-secondary);
        }
      `}</style>
        </DashboardLayout>
    );
}
