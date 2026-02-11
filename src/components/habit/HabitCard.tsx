'use client'

import React, { useState } from 'react'
import { Check, Flame } from 'lucide-react'
import { clsx } from 'clsx'
import styles from './HabitCard.module.css'

interface HabitCardProps {
  habit: {
    id: string
    name: string
    color: string
    isCompleted?: boolean
    streakCount?: number
    category?: {
      name: string
      icon: string
    }
  }
  onToggle?: (id: string, completed: boolean) => void
  onDetails?: (id: string) => void
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggle,
  onDetails,
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggle) {
      if (!habit.isCompleted) {
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 300)
      }
      onToggle(habit.id, !habit.isCompleted)
    }
  }

  return (
    <div
      className={clsx(styles.cardWrapper, isAnimating && styles.bounce)}
      onClick={() => onDetails?.(habit.id)}
    >
      <div
        className={clsx(styles.card, habit.isCompleted && styles.cardCompleted)}
      >
        {/* Accent Border */}
        <div
          className={styles.accentBorder}
          style={{ backgroundColor: habit.color }}
        />

        {/* Checkbox */}
        <div
          className={clsx(
            styles.checkbox,
            habit.isCompleted && styles.checkboxChecked
          )}
          onClick={handleToggle}
        >
          <Check size={16} strokeWidth={3} />
        </div>

        {/* Content */}
        <div className={styles.content}>
          <span
            className={clsx(
              styles.title,
              habit.isCompleted && styles.titleCompleted
            )}
          >
            {habit.name}
          </span>
          <div className={styles.meta}>
            {habit.category && (
              <div className={styles.category}>
                <span>{habit.category.icon}</span>
                <span>{habit.category.name}</span>
              </div>
            )}
            {/* Streak - Placeholder logic */}
            {(habit.streakCount ?? 0) > 0 && (
              <div className={styles.streak}>
                <Flame size={12} fill="currentColor" />
                <span>{habit.streakCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Completion Stamp (Subtle) */}
        {habit.isCompleted && (
          <div className={styles.stamp}>
            <Check size={80} strokeWidth={1} />
          </div>
        )}
      </div>
    </div>
  )
}
