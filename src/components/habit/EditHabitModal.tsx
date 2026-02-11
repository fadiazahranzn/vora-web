'use client'

import React, { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { Lock, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { updateHabitSchema } from '@/lib/validations/habit'
import styles from './EditHabitModal.module.css'

const COLORS = [
  '#EF4444',
  '#EC4899',
  '#A855F7',
  '#6366F1',
  '#3B82F6',
  '#06B6D4',
  '#14B8A6',
  '#22C55E',
  '#84CC16',
  '#EAB308',
  '#F97316',
  '#71717A',
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface Category {
  id: string
  name: string
  icon: string
}

interface Habit {
  id: string
  name: string
  categoryId: string
  color: string
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  targetValue?: number
  targetUnit?: string
  weeklyDays?: number[]
  monthlyDates?: number[]
  reminderTime?: string
}

interface EditHabitModalProps {
  isOpen: boolean
  onClose: () => void
  habitId: string | null
}

export const EditHabitModal: React.FC<EditHabitModalProps> = ({
  isOpen,
  onClose,
  habitId,
}) => {
  const queryClient = useQueryClient()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      return res.json()
    },
    enabled: isOpen,
  })

  const { data: habit, isLoading } = useQuery<Habit>({
    queryKey: ['habit', habitId],
    queryFn: async () => {
      const res = await fetch(`/api/habits/${habitId}`)
      if (!res.ok) throw new Error('Failed to fetch habit')
      return res.json()
    },
    enabled: !!habitId && isOpen,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateHabitSchema),
  })

  // Pre-populate form when habit data loads
  useEffect(() => {
    if (habit) {
      reset({
        name: habit.name,
        categoryId: habit.categoryId,
        color: habit.color,
        frequency: habit.frequency,
        targetValue: habit.targetValue || 1,
        targetUnit: habit.targetUnit || '',
        weeklyDays: habit.weeklyDays || [],
        monthlyDates: habit.monthlyDates || [],
        reminderTime: habit.reminderTime || '',
      })
    }
  }, [habit, reset])

  const selectedColor = watch('color')
  const frequency = watch('frequency')
  const weeklyDays = watch('weeklyDays') || []
  const monthlyDates = watch('monthlyDates') || []

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update habit')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['habit', habitId] })
      onClose()
      // TODO: Show success toast
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete habit')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      onClose()
      setShowDeleteConfirm(false)
      // TODO: Show success toast
    },
  })

  const onSubmit = (data: any) => {
    updateMutation.mutate(data)
  }

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  if (!habitId) return null

  return (
    <>
      <Modal
        isOpen={isOpen && !showDeleteConfirm}
        onClose={onClose}
        title="Edit Habit"
        size="md"
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className={styles.editModal}>
            <div className={styles.formSection}>
              {/* Habit Name */}
              <Input
                label="Habit Name"
                placeholder="e.g. Drink Water"
                {...register('name')}
                error={errors.name?.message as string}
              />

              {/* Category */}
              <div className="vora-form-field">
                <label className="vora-label">Category</label>
                <select
                  className={styles.categorySelect}
                  {...register('categoryId')}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className={styles.errorText}>
                    {errors.categoryId.message as string}
                  </p>
                )}
              </div>

              {/* Color Theme */}
              <div className="vora-form-field">
                <label className="vora-label">Color Theme</label>
                <div className={styles.colorGrid}>
                  {COLORS.map((c) => (
                    <div
                      key={c}
                      className={clsx(
                        styles.colorSwatch,
                        selectedColor === c && styles.colorSwatchSelected
                      )}
                      onClick={() => setValue('color', c)}
                    >
                      <div
                        className={styles.colorSwatchInner}
                        style={{ backgroundColor: c }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequency (Locked) */}
              <div className="vora-form-field">
                <label className="vora-label">
                  Frequency (Cannot be changed)
                </label>
                <div className={styles.frequencyBadge}>
                  <Lock size={14} />
                  <span>{frequency}</span>
                </div>
              </div>

              {/* Conditional Fields Based on Frequency */}
              {frequency === 'DAILY' && (
                <div className="vora-flex-row vora-gap-4">
                  <div style={{ flex: 1 }}>
                    <Input
                      label="Goal Value"
                      type="number"
                      {...register('targetValue', { valueAsNumber: true })}
                      error={errors.targetValue?.message as string}
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <Input
                      label="Unit"
                      placeholder="e.g. glasses"
                      {...register('targetUnit')}
                    />
                  </div>
                </div>
              )}

              {frequency === 'WEEKLY' && (
                <div className="vora-form-field">
                  <label className="vora-label">On which days?</label>
                  <div className={styles.dayGrid}>
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <button
                        key={i}
                        type="button"
                        className={clsx(
                          styles.dayBtn,
                          weeklyDays.includes(i) && styles.dayBtnSelected
                        )}
                        onClick={() => {
                          const current = [...weeklyDays]
                          const index = current.indexOf(i)
                          if (index > -1) current.splice(index, 1)
                          else current.push(i)
                          setValue('weeklyDays', current.sort())
                        }}
                      >
                        {DAYS[i]}
                      </button>
                    ))}
                  </div>
                  {errors.weeklyDays && (
                    <p className={styles.errorText}>
                      {errors.weeklyDays.message as string}
                    </p>
                  )}
                </div>
              )}

              {frequency === 'MONTHLY' && (
                <div className="vora-form-field">
                  <label className="vora-label">On which dates?</label>
                  <div className={styles.dateGrid}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                      <button
                        key={date}
                        type="button"
                        className={clsx(
                          styles.dateBtn,
                          monthlyDates.includes(date) && styles.dateBtnSelected
                        )}
                        onClick={() => {
                          const current = [...monthlyDates]
                          const index = current.indexOf(date)
                          if (index > -1) current.splice(index, 1)
                          else current.push(date)
                          setValue(
                            'monthlyDates',
                            current.sort((a, b) => a - b)
                          )
                        }}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                  {errors.monthlyDates && (
                    <p className={styles.errorText}>
                      {errors.monthlyDates.message as string}
                    </p>
                  )}
                </div>
              )}

              {/* Reminder Time */}
              <div className="vora-form-field">
                <label className="vora-label">Reminder Time (Optional)</label>
                <input
                  type="time"
                  className={styles.timeInput}
                  {...register('reminderTime')}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <Button
                type="button"
                variant="ghost"
                leftIcon={<Trash2 size={18} />}
                onClick={() => setShowDeleteConfirm(true)}
                className={styles.deleteBtn}
              >
                Delete Habit
              </Button>

              <div className="vora-flex-row vora-gap-4">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={updateMutation.isPending}>
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Habit"
        size="sm"
      >
        <div className="vora-flex-col vora-gap-6">
          <p>
            Delete <strong>{habit?.name}</strong>? This action cannot be undone.
          </p>
          <div className="vora-flex-row vora-gap-4 vora-justify-between">
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
              leftIcon={<Trash2 size={18} />}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
