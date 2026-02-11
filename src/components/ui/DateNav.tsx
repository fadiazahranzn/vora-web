'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format, addDays, subDays, isSameDay } from 'date-fns'

interface DateNavProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  disabled?: boolean
}

export const DateNav: React.FC<DateNavProps> = ({
  selectedDate,
  onDateChange,
  disabled = false,
}) => {
  const isToday = isSameDay(selectedDate, new Date())

  const handlePrev = () => onDateChange(subDays(selectedDate, 1))
  const handleNext = () => onDateChange(addDays(selectedDate, 1))
  const handleToday = () => onDateChange(new Date())

  return (
    <div className="vora-date-nav">
      <div className="vora-date-display">
        <button
          className="vora-date-btn"
          onClick={handlePrev}
          disabled={disabled}
          title="Previous day"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="vora-date-current">
          <Calendar size={18} className="vora-date-icon" />
          <span className="vora-date-text">
            {isToday ? 'Today' : format(selectedDate, 'EEE, MMM d')}
          </span>
          {!isToday && (
            <button className="vora-today-chip" onClick={handleToday}>
              Today
            </button>
          )}
        </div>

        <button
          className="vora-date-btn"
          onClick={handleNext}
          disabled={disabled}
          title="Next day"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <style jsx>{`
        .vora-date-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--vora-space-6);
        }
        .vora-date-display {
          display: flex;
          align-items: center;
          background: var(--vora-color-bg-secondary);
          padding: var(--vora-space-1) var(--vora-space-2);
          border-radius: var(--vora-radius-full);
          gap: var(--vora-space-2);
        }
        .vora-date-current {
          display: flex;
          align-items: center;
          gap: var(--vora-space-2);
          padding: 0 var(--vora-space-4);
          min-width: 140px;
          justify-content: center;
        }
        .vora-date-icon {
          color: var(--vora-color-accent-primary);
        }
        .vora-date-text {
          font-weight: var(--vora-font-weight-semibold);
          color: var(--vora-color-text-primary);
          white-space: nowrap;
        }
        .vora-date-btn {
          background: transparent;
          border: none;
          color: var(--vora-color-text-secondary);
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--vora-radius-full);
          transition: background var(--vora-duration-fast);
        }
        .vora-date-btn:hover:not(:disabled) {
          background: var(--vora-color-bg-tertiary);
          color: var(--vora-color-accent-primary);
        }
        .vora-date-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .vora-today-chip {
          font-size: 10px;
          background: var(--vora-color-accent-primary);
          color: var(--vora-color-text-inverse);
          border: none;
          padding: 2px 6px;
          border-radius: var(--vora-radius-full);
          cursor: pointer;
          margin-left: var(--vora-space-2);
        }
      `}</style>
    </div>
  )
}
