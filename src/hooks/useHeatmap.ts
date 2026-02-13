import { useQuery } from '@tanstack/react-query';

export interface HeatmapDay {
    date: string;
    rate: number;
    completed: number;
    scheduled: number;
}

export interface DayDetail {
    id: string;
    name: string;
    completed: boolean;
    color: string | null;
    emoji: string | null;
}

export interface HeatmapDrillDownData {
    date: string;
    habits: DayDetail[];
}

export function useHeatmap(month: string) {
    return useQuery<HeatmapDay[]>({
        queryKey: ['analytics-heatmap', month],
        queryFn: async () => {
            const response = await fetch(`/api/analytics/heatmap?month=${month}`);
            if (!response.ok) {
                throw new Error('Failed to fetch heatmap data');
            }
            return response.json();
        },
        staleTime: 2 * 60 * 1000,
    });
}

export function useHeatmapDetail(date: string | null) {
    return useQuery<HeatmapDrillDownData>({
        queryKey: ['analytics-heatmap-detail', date],
        queryFn: async () => {
            if (!date) return { date: '', habits: [] };
            const response = await fetch(`/api/analytics/heatmap/${date}`);
            if (!response.ok) {
                throw new Error('Failed to fetch heatmap detail');
            }
            return response.json();
        },
        enabled: !!date,
        staleTime: 2 * 60 * 1000,
    });
}
