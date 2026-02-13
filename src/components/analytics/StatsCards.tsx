'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Star, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useStats } from '@/hooks/useStats';
import { Skeleton } from '@/components/ui/Skeleton';

interface StatsCardProps {
    label: string;
    value: number;
    icon: React.ElementType;
    iconColor: string;
    suffix?: string;
}

const StatsCard = ({ label, value, icon: Icon, iconColor, suffix }: StatsCardProps) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) {
            setDisplayValue(end);
            return;
        }

        const duration = 1000; // 1 second
        const increment = end / (duration / 16); // 60fps approx

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <Card className="stats-card">
            <div className="stats-card-content">
                <div className={`icon-container ${iconColor}`}>
                    <Icon size={24} />
                </div>
                <div className="stats-info">
                    <span className="stats-value">
                        {displayValue} {suffix}
                    </span>
                    <span className="stats-label">{label}</span>
                </div>
            </div>
            <style jsx>{`
                .stats-card {
                    background: var(--vora-color-bg-secondary);
                    border: 1px solid var(--vora-color-border);
                    border-radius: var(--vora-radius-lg);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .stats-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--vora-shadow-md);
                }
                :global(.stats-card-content) {
                    display: flex;
                    align-items: center;
                    gap: var(--vora-space-4);
                    padding: var(--vora-space-4) !important;
                }
                .icon-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    border-radius: var(--vora-radius-md);
                }
                .orange { background: rgba(255, 140, 0, 0.1); color: #FF8C00; }
                .gold { background: rgba(255, 215, 0, 0.1); color: #FFD700; }
                .purple { background: rgba(147, 112, 219, 0.1); color: #9370DB; }
                .blue { background: rgba(30, 144, 255, 0.1); color: #1E90FF; }
                
                .stats-info {
                    display: flex;
                    flex-direction: column;
                }
                .stats-value {
                    font-size: var(--vora-font-size-h3);
                    font-weight: var(--vora-font-weight-bold);
                    color: var(--vora-color-text-primary);
                    line-height: 1.2;
                }
                .stats-label {
                    font-size: var(--vora-font-size-sm);
                    color: var(--vora-color-text-secondary);
                }

                @media (max-width: 640px) {
                    .stats-value {
                        font-size: var(--vora-font-size-h4);
                    }
                }
            `}</style>
        </Card>
    );
};

export const StatsCards = () => {
    const { data, isLoading, error } = useStats();

    if (isLoading) {
        return (
            <div className="stats-grid">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error loading statistics</div>;
    }

    const stats = [
        {
            label: 'Current Streak',
            value: data?.currentStreak ?? 0,
            icon: Flame,
            iconColor: 'orange',
            suffix: '🔥',
        },
        {
            label: 'Longest Streak',
            value: data?.longestStreak ?? 0,
            icon: Trophy,
            iconColor: 'gold',
            suffix: '🏆',
        },
        {
            label: 'Perfect Days',
            value: data?.perfectDays ?? 0,
            icon: Star,
            iconColor: 'purple',
            suffix: '⭐',
        },
        {
            label: 'Active Days',
            value: data?.activeDays ?? 0,
            icon: Calendar,
            iconColor: 'blue',
            suffix: '📅',
        },
    ];

    return (
        <div className="stats-grid">
            {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
            ))}
            <style jsx>{`
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--vora-space-4);
                    width: 100%;
                }
                @media (min-width: 1024px) {
                    .stats-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }
            `}</style>
        </div>
    );
};
