'use client'

import React, { useState } from 'react'
import { Check, Flame, Edit } from 'lucide-react'
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
  onEdit?: (id: string) => void
  onDetails?: (id: string) => void
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggle,
  onEdit,
  onDetails,
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggle) {
      if (!habit.isCompleted) {
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 400)
      }
      onToggle(habit.id, !habit.isCompleted)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(habit.id)
    }
  }

  const handleCardClick = () => {
    if (onDetails) {
      onDetails(habit.id)
    }
  }

  return (
    <div
      className={clsx(styles.cardWrapper, isAnimating && styles.bounce)}
      onClick={handleCardClick}
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
          role="checkbox"
          aria-checked={habit.isCompleted}
          aria-label={`Mark ${habit.name} as ${habit.isCompleted ? 'incomplete' : 'complete'}`}
          tabIndex={0}
          className={clsx(
            styles.checkbox,
            habit.isCompleted && styles.checkboxChecked
          )}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleToggle(e as any)
            }
          }}
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

            {/* Streak Badge */}
            {(habit.streakCount ?? 0) > 0 && (
              <div className={styles.streak} title="Current Streak">
                <Flame size={12} fill="currentColor" />
                <span>{habit.streakCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Button */}
        {onEdit && (
          <button
            className={styles.editBtn}
            onClick={handleEdit}
            title="Edit habit"
          >
            <Edit size={16} />
          </button>
        )}

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
