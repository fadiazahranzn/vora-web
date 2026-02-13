import { useQuery } from '@tanstack/react-query';

interface StatsData {
    currentStreak: number;
    longestStreak: number;
    perfectDays: number;
    activeDays: number;
}

export function useStats() {
    return useQuery<StatsData>({
        queryKey: ['analytics-stats'],
        queryFn: async () => {
            const response = await fetch('/api/analytics/stats');
            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }
            return response.json();
        },
        staleTime: 2 * 60 * 1000, // 2 minutes as per technical notes
    });
}
