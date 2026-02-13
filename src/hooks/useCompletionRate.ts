import { useQuery } from '@tanstack/react-query';

interface CompletionRate {
    completed: number;
    total: number;
}

export function useCompletionRate() {
    return useQuery<CompletionRate>({
        queryKey: ['analytics', 'completion-rate'],
        queryFn: async () => {
            const response = await fetch('/api/analytics/completion-rate');
            if (!response.ok) {
                // If the API endpoint is not yet implemented (STORY-005), 
                // return a mock response for now to unblock frontend development.
                if (response.status === 404) {
                    console.warn('Completion rate API not found, using mock data.');
                    return { completed: 3, total: 5 }; // Mock data as per mockup
                }
                throw new Error('Failed to fetch completion rate');
            }
            return response.json();
        },
        staleTime: 2 * 60 * 1000, // 2 minutes stale time as per STORY-001
        refetchOnWindowFocus: true,
    });
}
