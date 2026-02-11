'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Mascot } from '@/components/ui/Mascot'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { FAB } from '@/components/ui/FAB'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { DatePicker } from '@/components/ui/DatePicker'
import { HabitCard } from '@/components/habit/HabitCard'
import { HabitWizard } from '@/components/habit/HabitWizard'
import { EditHabitModal } from '@/components/habit/EditHabitModal'
import { MoodCheckinModal, MoodType } from '@/components/mood/MoodCheckinModal'
import DashboardLayout from '@/components/layout/DashboardLayout'
import styles from './page.module.css'

interface Category {
  id: string
  name: string
  icon: string
  sortOrder: number
}

interface Habit {
  id: string
  name: string
  color: string
  isCompleted: boolean
  streakCount?: number
  categoryId: string
  category: Category
}

export default function Home() {
  const { data: session, status } = useSession()
  const queryClient = useQueryClient()
  const [mounted, setMounted] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null)
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false)
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    setSelectedDate(new Date())
  }, [])

  // Greeting based on time of day
  const greeting = useMemo(() => {
    if (!mounted) return ''
    const hour = (selectedDate || new Date()).getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [mounted, selectedDate])

  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  const formattedMonth = selectedDate ? format(selectedDate, 'yyyy-MM') : ''

  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ['habits', formattedDate],
    queryFn: async () => {
      const res = await fetch(`/api/habits?date=${formattedDate}`)
      if (!res.ok) throw new Error('Failed to fetch habits')
      return res.json()
    },
    enabled: !!session && !!selectedDate,
  })

  // Fetch completion dates for calendar dots
  const { data: completionData } = useQuery<{ dates: string[] }>({
    queryKey: ['completions', formattedMonth],
    queryFn: async () => {
      const res = await fetch(`/api/completions/dates?month=${formattedMonth}`)
      if (!res.ok) throw new Error('Failed to fetch completion dates')
      return res.json()
    },
    enabled: !!session && !!selectedDate,
  })

  // Completion Mutation
  const toggleMutation = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string
      completed: boolean
    }) => {
      const method = completed ? 'POST' : 'DELETE'
      const url = `/api/habits/${id}/complete${!completed ? `?date=${formattedDate}` : ''}`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: completed ? JSON.stringify({ date: formattedDate }) : undefined,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update habit')
      }
      return res.json()
    },
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ['habits', formattedDate] })
      const previousHabits = queryClient.getQueryData(['habits', formattedDate])

      if (previousHabits) {
        const newHabits = (previousHabits as Habit[]).map((h) =>
          h.id === id ? { ...h, isCompleted: completed } : h
        )
        queryClient.setQueryData(['habits', formattedDate], newHabits)
      }

      return { previousHabits }
    },
    onError: (err, variables, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(
          ['habits', formattedDate],
          context.previousHabits
        )
      }
      console.error('Toggle failed:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', formattedDate] })
    },
  })

  // Mood Mutation
  const moodMutation = useMutation({
    mutationFn: async ({ id, mood }: { id: string; mood: MoodType }) => {
      const res = await fetch('/api/mood-checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitId: id,
          date: formattedDate,
          mood,
        }),
      })
      if (!res.ok) throw new Error('Failed to save mood')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', formattedDate] })
    },
  })

  const handleToggle = (id: string, completed: boolean) => {
    if (completed) {
      // Mark as complete and open mood modal after delay
      toggleMutation.mutate({ id, completed })
      setActiveHabitId(id)
      setTimeout(() => setIsMoodModalOpen(true), 500)
    } else {
      // Just mark as incomplete
      toggleMutation.mutate({ id, completed })
    }
  }

  const handleMoodSelect = (mood: MoodType) => {
    if (activeHabitId) {
      moodMutation.mutate({ id: activeHabitId, mood })
    }
    setIsMoodModalOpen(false)
    setActiveHabitId(null)
  }

  const handleMoodSkip = () => {
    setIsMoodModalOpen(false)
    setActiveHabitId(null)
  }

  // Group habits by category
  const groupedHabits = useMemo(() => {
    const groups: Record<string, { category: Category; items: Habit[] }> = {}

    habits.forEach((habit) => {
      const catId = habit.categoryId
      if (!groups[catId]) {
        groups[catId] = { category: habit.category, items: [] }
      }
      groups[catId].items.push(habit)
    })

    return Object.values(groups).sort(
      (a, b) => a.category.sortOrder - b.category.sortOrder
    )
  }, [habits])

  const completionRate = useMemo(() => {
    if (habits.length === 0) return 0
    const completed = habits.filter((h) => h.isCompleted).length
    return (completed / habits.length) * 100
  }, [habits])

  if (status === 'unauthenticated') {
    return null // Handled by middleware or root layout redirect
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Header Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeText}>
            <h1>
              {greeting}, {session?.user?.name || 'Voran'}! ✨
            </h1>
            <p>Ready to crush your goals today?</p>
            <div className={styles.progressSection}>
              <ProgressBar progress={completionRate} label="Today's Progress" />
            </div>
          </div>
          <Mascot
            size={100}
            expression={
              completionRate === 100
                ? 'happy'
                : completionRate > 50
                  ? 'motivated'
                  : 'neutral'
            }
          />
        </section>

        {/* Date Navigation */}
        {/* Date Navigation */}
        {mounted && selectedDate ? (
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={(date) => setSelectedDate(date)}
            completionDates={completionData?.dates || []}
          />
        ) : (
          <div style={{ height: '56px', marginBottom: '24px' }} />
        )}

        {/* Habits List */}
        <section className={styles.habitSection}>
          {isLoading ? (
            <div className={styles.loadingGrid}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ) : habits.length === 0 ? (
            <EmptyState
              title="No habits scheduled"
              description="It looks like you have nothing planned for this date. Time to start a new habit?"
              actionLabel="Create First Habit"
              onAction={() => setIsWizardOpen(true)}
              mascotExpression="sleeping"
            />
          ) : (
            groupedHabits.map((group) => (
              <div key={group.category.id} className={styles.categoryGroup}>
                <div className={styles.categoryHeader}>
                  <span>{group.category.icon}</span>
                  <h3>{group.category.name}</h3>
                </div>
                <div className={styles.habitGrid}>
                  {group.items.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onToggle={handleToggle}
                      onEdit={(id) => {
                        setEditingHabitId(id)
                        setIsEditModalOpen(true)
                      }}
                      onDetails={(id) => console.log('Go to details:', id)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* FAB for creation */}
        <FAB onClick={() => setIsWizardOpen(true)} />

        <HabitWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
        />

        <EditHabitModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingHabitId(null)
          }}
          habitId={editingHabitId}
        />

        <MoodCheckinModal
          isOpen={isMoodModalOpen}
          onClose={handleMoodSkip}
          onSelect={handleMoodSelect}
          onSkip={handleMoodSkip}
        />
      </div>

      <style jsx global>{`
        /* Global bounce animation for icons if needed */
        @keyframes vora-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </DashboardLayout>
  )
}
