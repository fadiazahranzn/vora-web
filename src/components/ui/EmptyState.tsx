'use client'

import React from 'react'
import { Mascot } from './Mascot'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  mascotExpression?: 'happy' | 'neutral' | 'motivated' | 'sleeping'
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  mascotExpression = 'neutral',
}) => {
  return (
    <div className="vora-empty-state">
      <Mascot
        size={120}
        expression={mascotExpression}
        className="vora-empty-mascot"
      />
      <h3 className="vora-empty-title">{title}</h3>
      <p className="vora-empty-description">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="vora-empty-action">
          {actionLabel}
        </Button>
      )}

      <style jsx>{`
        .vora-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--vora-space-12) var(--vora-space-6);
          text-align: center;
          background: var(--vora-color-bg-secondary);
          border-radius: var(--vora-radius-xl);
          border: 2px dashed var(--vora-color-border-default);
          margin: var(--vora-space-8) 0;
        }
        .vora-empty-mascot {
          margin-bottom: var(--vora-space-6);
        }
        .vora-empty-title {
          font-size: var(--vora-font-size-h2);
          font-weight: var(--vora-font-weight-bold);
          color: var(--vora-color-text-primary);
          margin-bottom: var(--vora-space-2);
        }
        .vora-empty-description {
          font-size: var(--vora-font-size-body);
          color: var(--vora-color-text-secondary);
          max-width: 300px;
          margin-bottom: var(--vora-space-8);
        }
      `}</style>
    </div>
  )
}
