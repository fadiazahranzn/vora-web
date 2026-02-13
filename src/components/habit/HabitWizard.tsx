'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { ChevronRight, ChevronLeft, Save, AlarmClock } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createHabitSchema } from '@/lib/validations/habit'
import { apiFetch } from '@/lib/api-client'
import styles from './HabitWizard.module.css'

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

interface HabitWizardProps {
  isOpen: boolean
  onClose: () => void
}

export const HabitWizard: React.FC<HabitWizardProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1)
  const queryClient = useQueryClient()

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      return res.json()
    },
    enabled: isOpen,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      color: COLORS[4], // Default to Blue
      frequency: 'DAILY',
      targetValue: 1,
      targetUnit: '',
      weeklyDays: [],
      monthlyDates: [],
      reminderTime: '',
    },
  })

  // Set default category if available
  useEffect(() => {
    if (categories.length > 0 && !watch('categoryId')) {
      setValue('categoryId', categories[0].id)
    }
  }, [categories, setValue, watch])

  const frequency = watch('frequency')
  const selectedColor = watch('color')
  const weeklyDays = watch('weeklyDays') || []
  const monthlyDates = watch('monthlyDates') || []

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiFetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create habit')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      onClose()
      reset()
      setStep(1)
      // Note: A real toast would go here.
    },
  })

  const nextStep = async () => {
    let fieldsToValidate: any[] = []
    if (step === 1) fieldsToValidate = ['name', 'categoryId', 'color']
    if (step === 2) {
      fieldsToValidate = ['frequency']
      if (frequency === 'DAILY') fieldsToValidate.push('targetValue')
      if (frequency === 'WEEKLY') fieldsToValidate.push('weeklyDays')
      if (frequency === 'MONTHLY') fieldsToValidate.push('monthlyDates')
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) setStep((s) => s + 1)
  }

  const prevStep = () => setStep((s) => s - 1)

  const onSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className={styles.wizard}>
        {/* Step Indicator */}
        <div className={styles.header}>
          <div className={styles.stepIndicator}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={clsx(
                  styles.stepDot,
                  i <= step && styles.stepDotActive
                )}
              />
            ))}
          </div>
          <h2 className={styles.stepTitle}>
            {step === 1 && 'Basic Details'}
            {step === 2 && 'Frequency'}
            {step === 3 && 'Reminders'}
          </h2>
          <p className={styles.stepDescription}>
            {step === 1 && 'What do you want to achieve?'}
            {step === 2 && 'How often will you do this?'}
            {step === 3 && 'Add an optional daily reminder.'}
          </p>
        </div>

        {/* Step Content */}
        <div className={styles.formSection}>
          {step === 1 && (
            <>
              <Input
                label="Habit Name"
                placeholder="e.g. Drink Water"
                {...register('name')}
                error={errors.name?.message as string}
              />

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
            </>
          )}

          {step === 2 && (
            <>
              <div className={styles.frequencyToggle}>
                {['DAILY', 'WEEKLY', 'MONTHLY'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={clsx(
                      styles.freqBtn,
                      frequency === f && styles.freqBtnActive
                    )}
                    onClick={() => setValue('frequency', f as any)}
                  >
                    {f.charAt(0) + f.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              <div className={styles.conditionalFields}>
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
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(
                        (date) => (
                          <button
                            key={date}
                            type="button"
                            className={clsx(
                              styles.dateBtn,
                              monthlyDates.includes(date) &&
                              styles.dateBtnSelected
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
                        )
                      )}
                    </div>
                    {errors.monthlyDates && (
                      <p className={styles.errorText}>
                        {errors.monthlyDates.message as string}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <div className="vora-flex-col vora-items-center vora-gap-6">
              <AlarmClock size={64} className="vora-text-tertiary" />
              <div className="vora-form-field vora-w-full">
                <label className="vora-label">Reminder Time (Optional)</label>
                <input
                  type="time"
                  className={styles.timeInput}
                  {...register('reminderTime')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={prevStep}
              leftIcon={<ChevronLeft size={18} />}
            >
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          )}

          {step < 3 ? (
            <Button onClick={nextStep} rightIcon={<ChevronRight size={18} />}>
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit(onSubmit)}
              isLoading={mutation.isPending}
              leftIcon={<Save size={18} />}
            >
              Save Habit
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
