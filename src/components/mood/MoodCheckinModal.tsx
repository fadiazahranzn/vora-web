'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { clsx } from 'clsx'
import styles from './MoodCheckinModal.module.css'

export type MoodType =
  | 'HAPPY'
  | 'PROUD'
  | 'WORRIED'
  | 'ANNOYED'
  | 'SAD'
  | 'ANGRY'

interface MoodOption {
  type: MoodType
  emoji: string
  label: string
}

const MOODS: MoodOption[] = [
  { type: 'HAPPY', emoji: '😊', label: 'Happy' },
  { type: 'PROUD', emoji: '💪', label: 'Proud' },
  { type: 'WORRIED', emoji: '😟', label: 'Worried' },
  { type: 'ANNOYED', emoji: '😠', label: 'Annoyed' },
  { type: 'SAD', emoji: '😢', label: 'Sad' },
  { type: 'ANGRY', emoji: '😡', label: 'Angry' },
]

interface MoodCheckinModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (mood: MoodType) => void
  onSkip: () => void
}

export const MoodCheckinModal: React.FC<MoodCheckinModalProps> = ({
  isOpen,
  onClose: _onClose,
  onSelect,
  onSkip,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)

  const handleMoodClick = (mood: MoodType) => {
    setSelectedMood(mood)
    // Small delay to show selection before proceeding
    setTimeout(() => {
      onSelect(mood)
      setSelectedMood(null)
    }, 400)
  }

  return (
    <Modal isOpen={isOpen} onClose={onSkip} title="" size="md">
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>How do you feel?</h2>
          <p className={styles.subtitle}>
            Checking in with your mood helps you understand your habits better.
          </p>
        </div>

        <div className={styles.moodGrid}>
          {MOODS.map((mood) => (
            <div
              key={mood.type}
              className={clsx(
                styles.moodItem,
                selectedMood === mood.type && styles.moodItemActive
              )}
              onClick={() => handleMoodClick(mood.type)}
            >
              <span className={styles.emoji}>{mood.emoji}</span>
              <span className={styles.moodLabel}>{mood.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button className={styles.skipBtn} onClick={onSkip}>
            Skip for now, just mark as done
          </button>
        </div>
      </div>
    </Modal>
  )
}
