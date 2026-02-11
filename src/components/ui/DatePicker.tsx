'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import {
  format,
  addDays,
  subDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { clsx } from 'clsx'
import styles from './DatePicker.module.css'

interface DatePickerProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  completionDates?: string[] // Array of YYYY-MM-DD dates with completions
  disabled?: boolean
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  completionDates = [],
  disabled = false,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(selectedDate)
  const calendarRef = useRef<HTMLDivElement>(null)

  const isSelectedToday = isSameDay(selectedDate, new Date())

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false)
      }
    }

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCalendarOpen])

  const handlePrev = () => onDateChange(subDays(selectedDate, 1))
  const handleNext = () => onDateChange(addDays(selectedDate, 1))
  const handleToday = () => {
    onDateChange(new Date())
    setIsCalendarOpen(false)
  }

  const toggleCalendar = () => {
    if (!disabled) {
      setIsCalendarOpen(!isCalendarOpen)
      setCalendarMonth(selectedDate)
    }
  }

  const handleDateSelect = (date: Date) => {
    onDateChange(date)
    setIsCalendarOpen(false)
  }

  const handlePrevMonth = () => setCalendarMonth(subMonths(calendarMonth, 1))
  const handleNextMonth = () => setCalendarMonth(addMonths(calendarMonth, 1))

  // Generate calendar days
  const monthStart = startOfMonth(calendarMonth)
  const monthEnd = endOfMonth(calendarMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  // Check if date has completions
  const hasCompletion = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return completionDates.includes(dateStr)
  }

  // Check if date is within ±1 year
  const today = new Date()
  const minDate = subDays(today, 365)
  const maxDate = addDays(today, 365)
  const isDateDisabled = (date: Date) => date < minDate || date > maxDate

  return (
    <div className={styles.datePickerContainer}>
      <div className={styles.dateNav}>
        <button
          className={styles.navBtn}
          onClick={handlePrev}
          disabled={disabled}
          title="Previous day"
        >
          <ChevronLeft size={20} />
        </button>

        <div style={{ position: 'relative' }}>
          <div className={styles.dateDisplay} onClick={toggleCalendar}>
            <Calendar size={18} className={styles.dateIcon} />
            <span className={styles.dateText}>
              {isSelectedToday ? 'Today' : format(selectedDate, 'EEE, MMM d')}
            </span>
          </div>

          {isCalendarOpen && (
            <div className={styles.calendarPopup} ref={calendarRef}>
              <div className={styles.calendarHeader}>
                <h3 className={styles.calendarTitle}>
                  {format(calendarMonth, 'MMMM yyyy')}
                </h3>
                <div className={styles.monthNav}>
                  <button
                    className={styles.monthNavBtn}
                    onClick={handlePrevMonth}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    className={styles.monthNavBtn}
                    onClick={handleNextMonth}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className={styles.weekDays}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                  (day) => (
                    <div key={day} className={styles.weekDay}>
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className={styles.daysGrid}>
                {calendarDays.map((day, index) => {
                  const isSelected = isSameDay(day, selectedDate)
                  const isDayToday = isToday(day)
                  const isOtherMonth = !isSameMonth(day, calendarMonth)
                  const isDisabled = isDateDisabled(day)
                  const hasCompletionDot = hasCompletion(day)

                  return (
                    <button
                      key={index}
                      className={clsx(
                        styles.dayCell,
                        isSelected && styles.dayCellSelected,
                        isDayToday && styles.dayCellToday,
                        isOtherMonth && styles.dayCellOtherMonth,
                        isDisabled && styles.dayCellDisabled
                      )}
                      onClick={() => !isDisabled && handleDateSelect(day)}
                      disabled={isDisabled}
                    >
                      {format(day, 'd')}
                      {hasCompletionDot && !isOtherMonth && (
                        <span className={styles.completionDot} />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <button
          className={styles.navBtn}
          onClick={handleNext}
          disabled={disabled}
          title="Next day"
        >
          <ChevronRight size={20} />
        </button>

        {!isSelectedToday && (
          <button className={styles.todayChip} onClick={handleToday}>
            Today
          </button>
        )}
      </div>
    </div>
  )
}
