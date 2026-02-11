'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { clsx } from 'clsx'

interface FABProps {
  onClick: () => void
  icon?: React.ReactNode
  label?: string
  className?: string
}

export const FAB: React.FC<FABProps> = ({
  onClick,
  icon = <Plus size={24} />,
  label = 'Create',
  className = '',
}) => {
  return (
    <button
      className={clsx('vora-fab', className)}
      onClick={onClick}
      aria-label={label}
    >
      {icon}
      <style jsx>{`
        .vora-fab {
          position: fixed;
          bottom: calc(var(--vora-space-6) + var(--vora-bottomnav-height, 0px));
          right: var(--vora-space-6);
          width: 56px;
          height: 56px;
          border-radius: var(--vora-radius-full);
          background: var(--vora-color-accent-primary);
          color: var(--vora-color-text-inverse);
          border: none;
          box-shadow: var(--vora-shadow-lg);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--vora-duration-fast) var(--vora-easing-default);
          z-index: var(--vora-z-sticky);
        }
        .vora-fab:hover {
          transform: scale(1.1) rotate(90deg);
          box-shadow: var(--vora-shadow-xl);
          background: var(--vora-color-accent-hover);
        }
        .vora-fab:active {
          transform: scale(0.9);
        }
      `}</style>
    </button>
  )
}
