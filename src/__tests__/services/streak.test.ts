import { describe, it, expect } from 'vitest'
import { calculateStreaks } from '@/lib/services/streak'
import { Habit, HabitCompletion } from '@prisma/client'

// Helper to create habit
const createHabit = (overrides: Partial<Habit> = {}): Habit => ({
  id: 'habit-1',
  userId: 'user-1',
  categoryId: 'cat-1',
  name: 'Test Habit',
  color: 'blue',
  frequency: 'DAILY',
  weeklyDays: [],
  monthlyDates: [],
  targetValue: 1,
  targetUnit: null,
  reminderTime: null,
  isActive: true,
  sortOrder: 0,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date(),
  deletedAt: null,
  ...overrides,
})

// Helper to create completion
const createCompletion = (dateStr: string): HabitCompletion => ({
  id: Math.random().toString(),
  habitId: 'habit-1',
  userId: 'user-1',
  date: new Date(dateStr), // UTC
  value: 1,
  completedAt: new Date(dateStr),
  deletedAt: null,
})

describe('Streak Calculation Service', () => {
  it('should return 0 streaks for no completions', () => {
    const habit = createHabit()
    const result = calculateStreaks(habit, [])
    expect(result).toEqual({
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
    })
  })

  // --- DAILY HABITS ---

  it('should calculate streak for consecutive daily completions (including today)', () => {
    const habit = createHabit({ frequency: 'DAILY' })
    const today = new Date('2023-10-27T12:00:00Z') // Ref date
    // Completions: Today(27), Yesterday(26), DayBefore(25)
    const completions = [
      createCompletion('2023-10-25'),
      createCompletion('2023-10-26'),
      createCompletion('2023-10-27'),
    ]
    const result = calculateStreaks(habit, completions, today)
    expect(result.currentStreak).toBe(3)
    expect(result.longestStreak).toBe(3)
  })

  it('should continue streak from yesterday if today is pending (DAILY)', () => {
    const habit = createHabit({ frequency: 'DAILY' })
    const today = new Date('2023-10-27T12:00:00Z')
    // Completions: Yesterday(26), DayBefore(25). Today(27) is missing.
    const completions = [
      createCompletion('2023-10-25'),
      createCompletion('2023-10-26'),
    ]
    const result = calculateStreaks(habit, completions, today)
    expect(result.currentStreak).toBe(2)
    // Longest streak logic: checks full scheduled range.
    // If today is scheduled but missed, max streak is still 2.
    expect(result.longestStreak).toBe(2)
  })

  it('should break streak if yesterday is missing (DAILY)', () => {
    const habit = createHabit({ frequency: 'DAILY' })
    const today = new Date('2023-10-27T12:00:00Z')
    // Completions: Today(27), DayBefore(25). Yesterday(26) missing.
    const completions = [
      createCompletion('2023-10-25'),
      createCompletion('2023-10-27'),
    ]
    const result = calculateStreaks(habit, completions, today)
    expect(result.currentStreak).toBe(1) // Just today
    expect(result.longestStreak).toBe(1) // Max run was 1 (25) or 1 (27)
  })

  // --- WEEKLY HABITS ---

  it('should handle WEEKLY habits (MWF) - ignoring non-scheduled days', () => {
    const habit = createHabit({
      frequency: 'WEEKLY',
      weeklyDays: [0, 2, 4], // Mon, Wed, Fri
    })
    // 2023-10-23 (Mon), 2023-10-25 (Wed), 2023-10-27 (Fri)
    const today = new Date('2023-10-27T12:00:00Z') // Fri

    // Completions: Mon(23), Wed(25). Fri(27) is missing (pending)
    const completions = [
      createCompletion('2023-10-23'),
      createCompletion('2023-10-25'),
    ]
    const result = calculateStreaks(habit, completions, today)

    // Tue and Thu are gaps in calendar but NOT scheduled, so they don't break streak.
    // Streak: Mon(yes) -> Wed(yes) -> Fri(no but today).
    // Current streak = 2.
    expect(result.currentStreak).toBe(2)
    expect(result.longestStreak).toBe(2)
  })

  it('should break streak if a scheduled day is missed (WEEKLY)', () => {
    const habit = createHabit({
      frequency: 'WEEKLY',
      weeklyDays: [0, 2, 4], // Mon, Wed, Fri
    })
    // Mon(23), Wed(25), Fri(27)
    const today = new Date('2023-10-27T12:00:00Z') // Fri

    // Completions: Mon(23), Fri(27). Wed(25) MISSING.
    const completions = [
      createCompletion('2023-10-23'),
      createCompletion('2023-10-27'),
    ]
    const result = calculateStreaks(habit, completions, today)

    // Streak breaks at Wed.
    // Fri is completed -> streak 1.
    expect(result.currentStreak).toBe(1)
    expect(result.longestStreak).toBe(1)
  })

  // --- MONTHLY HABITS ---

  it('should handle MONTHLY habits', () => {
    const habit = createHabit({
      frequency: 'MONTHLY',
      monthlyDates: [1, 15],
    })
    // Oct 1, Oct 15.
    const today = new Date('2023-10-20T12:00:00Z')

    // Completed Oct 1, Oct 15.
    const completions = [
      createCompletion('2023-10-01'),
      createCompletion('2023-10-15'),
    ]
    const result = calculateStreaks(habit, completions, today)

    expect(result.currentStreak).toBe(2)
  })

  // --- TIMEZONE ROBUSTNESS ---

  it('should correctly handle timezone offsets between DB and Local', () => {
    const habit = createHabit({ frequency: 'DAILY' })

    // Simulate user in EST (UTC-5).
    // User says "I completed on Oct 26".
    // DB stores "2023-10-26T00:00:00Z".
    // User checks app at Oct 27 00:01 EST (which is Oct 27 05:01 UTC)
    // Or Oct 26 23:00 EST (which is Oct 27 04:00 UTC)

    // Case 1: Reference Date (Today) is Oct 26 23:00 EST.
    // In UTC, it is Oct 27.
    // But `calculateStreaks` treats `today` as LOCAL date of current user?
    // No, our service normalizes `referenceDate` to Local YYYY-MM-DD.
    // Then parses as UTC.

    // If we pass a Mock Date representing "Oct 27 04:00Z" (which is Oct 26 23:00 EST if server offset applied).
    // BUT `format(date, ...)` uses SYSTEM timezone.
    // In test environment (JSDOM/Node), timezone might be UTC or Local.
    // Use a fixed reference date that is clearly one day.

    const refDate = new Date('2023-10-27T12:00:00Z')
    // If execution env is UTC, local date is Oct 27.
    // If execution env is EST, local date is Oct 27 (07:00).
    // So `format` returns "2023-10-27".

    const completion = createCompletion('2023-10-27') // matches

    const result = calculateStreaks(habit, [completion], refDate)
    expect(result.currentStreak).toBe(1)
  })
})
