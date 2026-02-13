'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Mascot, MascotExpression } from '@/components/mascot/Mascot'
import { Button } from '@/components/ui/Button'
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

const CONGRATS_MESSAGES = [
  'Amazing work! 🎉',
  "You're on fire! 🔥",
  'Keep it up! 💪',
  'Fantastic! ⭐',
  "You're crushing it! 🏆",
]

const EMPATHETIC_MESSAGES = [
  "It's okay to feel this way.",
  'Take a deep breath.',
  "We're here for you.",
  'Be kind to yourself.',
  'One step at a time.',
]

const CALMING_ACTIVITIES = [
  { id: 'break', label: 'Take a short break', icon: '☕' },
  { id: 'breathe', label: 'Practice deep breathing', icon: '🌬️' },
  { id: 'music', label: 'Listen to calming music', icon: '🎧' },
  { id: 'talk', label: 'Talk to someone', icon: '🗣️' },
  { id: 'walk', label: 'Go for a walk', icon: '🚶' },
  { id: 'hydrate', label: 'Stay hydrated', icon: '💧' },
]

interface MoodCheckinModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (mood: MoodType) => void
  onDetailsSubmit?: (data: { reflection?: string; activity?: string }) => void
  onSkip: () => void
}

type ViewState =
  | 'SELECT'
  | 'CELEBRATION'
  | 'REFLECTION'
  | 'ACTIVITIES'
  | 'SUPPORT'

export const MoodCheckinModal: React.FC<MoodCheckinModalProps> = ({
  isOpen,
  onClose: _onClose, // Unused as we use onSkip for closing/dismissing
  onSelect,
  onDetailsSubmit,
  onSkip,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [view, setView] = useState<ViewState>('SELECT')
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [empatheticMessage, setEmpatheticMessage] = useState('')
  const [reflection, setReflection] = useState('')
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [mascotExpression, setMascotExpression] =
    useState<MascotExpression>('happy')

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView('SELECT')
      setSelectedMood(null)
      setCelebrationMessage('')
      setAnnouncement('')
      setReflection('')
      setSelectedActivity(null)
      setMascotExpression('happy')
    }
  }, [isOpen])

  const handleMoodClick = (mood: MoodType) => {
    setSelectedMood(mood)
    const moodLabel = MOODS.find((m) => m.type === mood)?.label
    setAnnouncement(`Mood set to ${moodLabel}`)

    // Update mascot expression immediately
    if (mood === 'HAPPY' || mood === 'PROUD') {
      setMascotExpression('celebrating')
    } else {
      setMascotExpression('concerned')
    }

    // Small delay to show selection before proceeding
    setTimeout(async () => {
      onSelect(mood) // Save data immediately

      if (mood === 'HAPPY' || mood === 'PROUD') {
        // Positive Mood Path
        const confetti = (await import('canvas-confetti')).default

        setView('CELEBRATION')
        setCelebrationMessage(
          CONGRATS_MESSAGES[
            Math.floor(Math.random() * CONGRATS_MESSAGES.length)
          ]
        )
        setAnnouncement('Celebration! ' + celebrationMessage)

        // Fire confetti
        const duration = 2000
        const end = Date.now() + duration

        const frame = () => {
          const confettiFn = confetti as any
          confettiFn({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ED9DFF', '#FFD600', '#00C853'], // Vora brand colors
          })
          confettiFn({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ED9DFF', '#FFD600', '#00C853'],
          })

          if (Date.now() < end) {
            requestAnimationFrame(frame)
          }
        }
        frame()

        // Auto close after 2 seconds
        setTimeout(() => {
          onSkip()
        }, 2000)
      } else {
        // Negative mood path
        const randomMsg =
          EMPATHETIC_MESSAGES[
            Math.floor(Math.random() * EMPATHETIC_MESSAGES.length)
          ]
        setEmpatheticMessage(randomMsg)
        setView('REFLECTION')
        setAnnouncement(`${randomMsg}. Reflection step.`)
      }
    }, 400)
  }

  const handleReflectionSkip = () => {
    setReflection('')
    setView('ACTIVITIES')
    setMascotExpression('happy')
    setAnnouncement('What would help? Select a calming activity.')
  }

  const handleReflectionContinue = () => {
    if (reflection.trim()) {
      onDetailsSubmit?.({ reflection })
    }
    setView('ACTIVITIES')
    setMascotExpression('happy')
    setAnnouncement('What would help? Select a calming activity.')
  }

  const handleActivitySkip = () => {
    setView('SUPPORT')
    setMascotExpression('waving')
    setAnnouncement('You got this! Skipped activity.')
    setTimeout(() => onSkip(), 2500)
  }

  const handleActivityContinue = () => {
    if (selectedActivity) {
      onDetailsSubmit?.({ reflection, activity: selectedActivity })
    }
    setView('SUPPORT')
    setMascotExpression('waving')
    setAnnouncement('You got this!')
    setTimeout(() => onSkip(), 2500)
  }

  const handleBack = () => {
    if (view === 'ACTIVITIES') {
      setView('REFLECTION')
      setMascotExpression('concerned')
      setAnnouncement('Back to reflection.')
    } else if (view === 'REFLECTION') {
      setView('SELECT')
      setSelectedMood(null)
      setMascotExpression('happy')
      setAnnouncement('Back to mood selection.')
    }
  }

  // Determine title based on view
  let modalTitle = 'How do you feel?'
  if (view === 'CELEBRATION') modalTitle = 'Great Job!'
  if (view === 'REFLECTION') modalTitle = empatheticMessage
  if (view === 'ACTIVITIES') modalTitle = 'What would help?'
  if (view === 'SUPPORT') modalTitle = 'You Got This!'

  return (
    <Modal isOpen={isOpen} onClose={onSkip} title={modalTitle} size="md">
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      <div
        className={view === 'CELEBRATION' ? styles.mascotWrapper : undefined}
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <Mascot size={120} expression={mascotExpression} />
      </div>

      {view === 'SELECT' && (
        <div className={styles.modalContent}>
          <p className={styles.subtitle}>
            Checking in with your mood helps you understand your habits better.
          </p>

          <div className={styles.moodGrid}>
            {MOODS.map((mood) => (
              <button
                key={mood.type}
                type="button"
                className={clsx(
                  styles.moodItem,
                  selectedMood === mood.type && styles.moodItemActive
                )}
                onClick={() => handleMoodClick(mood.type)}
                aria-pressed={selectedMood === mood.type}
                aria-label={mood.label}
              >
                <span className={styles.emoji} aria-hidden="true">
                  {mood.emoji}
                </span>
                <span className={styles.moodLabel}>{mood.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.footer}>
            <button className={styles.skipBtn} onClick={onSkip}>
              Skip for now, just mark as done
            </button>
          </div>
        </div>
      )}

      {view === 'CELEBRATION' && (
        <div className={styles.celebrationContent}>
          <h3 className={styles.congratsMessage}>{celebrationMessage}</h3>
        </div>
      )}

      {view === 'REFLECTION' && (
        <div className={styles.reflectionContent}>
          <textarea
            className={styles.reflectionArea}
            placeholder="What's making you feel this way?"
            maxLength={500}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            aria-label="Reflection text"
          />
          <div
            className={clsx(
              styles.charCounter,
              reflection.length >= 500 && styles.limitReached
            )}
          >
            {reflection.length}/500
          </div>
          <div className={styles.buttonGroup}>
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <div style={{ flex: 1 }}></div>
            <Button variant="ghost" onClick={handleReflectionSkip}>
              Skip
            </Button>
            <Button onClick={handleReflectionContinue}>Continue</Button>
          </div>
        </div>
      )}

      {view === 'ACTIVITIES' && (
        <div className={styles.activityContent}>
          <div className={styles.activityGrid}>
            {CALMING_ACTIVITIES.map((activity) => (
              <button
                key={activity.id}
                type="button"
                className={clsx(
                  styles.activityCard,
                  selectedActivity === activity.id &&
                    styles.activityCardSelected
                )}
                onClick={() => setSelectedActivity(activity.id)}
                aria-pressed={selectedActivity === activity.id}
              >
                <div className={styles.activityIcon}>{activity.icon}</div>
                <div className={styles.activityLabel}>{activity.label}</div>
              </button>
            ))}
          </div>
          <div className={styles.buttonGroup}>
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <div style={{ flex: 1 }}></div>
            <Button variant="ghost" onClick={handleActivitySkip}>
              Skip
            </Button>
            <Button
              disabled={!selectedActivity}
              onClick={handleActivityContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {view === 'SUPPORT' && (
        <div className={styles.supportContent}>
          <h3 className={styles.supportMessage}>We&apos;re rooting for you!</h3>
        </div>
      )}
    </Modal>
  )
}
