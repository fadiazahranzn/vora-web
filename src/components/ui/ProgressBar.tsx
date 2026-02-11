'use client'

import React from 'react'
import { clsx } from 'clsx'

interface ProgressBarProps {
  progress: number // 0 to 100
  label?: string
  className?: string
  showValue?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  className = '',
  showValue = true,
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className={clsx('vora-progress-container', className)}>
      <div className="vora-progress-header">
        {label && <span className="vora-progress-label">{label}</span>}
        {showValue && (
          <span className="vora-progress-value">
            {Math.round(normalizedProgress)}%
          </span>
        )}
      </div>
      <div className="vora-progress-track">
        <div
          className="vora-progress-fill"
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>

      <style jsx>{`
        .vora-progress-container {
          width: 100%;
        }
        .vora-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--vora-space-2);
        }
        .vora-progress-label {
          font-size: var(--vora-font-size-body);
          font-weight: var(--vora-font-weight-semibold);
          color: var(--vora-color-text-primary);
        }
        .vora-progress-value {
          font-size: var(--vora-font-size-body);
          font-weight: var(--vora-font-weight-bold);
          color: var(--vora-color-accent-primary);
        }
        .vora-progress-track {
          height: 12px;
          background: var(--vora-color-bg-tertiary);
          border-radius: var(--vora-radius-full);
          overflow: hidden;
        }
        .vora-progress-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--vora-color-accent-primary),
            var(--vora-color-info)
          );
          border-radius: var(--vora-radius-full);
          transition: width var(--vora-duration-slow) var(--vora-easing-default);
        }
      `}</style>
    </div>
  )
}
