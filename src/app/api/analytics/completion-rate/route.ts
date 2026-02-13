import { NextResponse } from 'next/server';

export async function GET() {
    // TODO: Replace with real database query when implementing STORY-005 (Analytics API)
    // Simulating network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
        completed: 3,
        total: 5,
    });
}
