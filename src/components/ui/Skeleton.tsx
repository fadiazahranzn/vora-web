'use client'

import React from 'react'
import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
}) => {
  return (
    <div
      className={clsx('vora-skeleton', `vora-skeleton--${variant}`, className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      <style jsx>{`
        .vora-skeleton {
          background: var(--vora-color-bg-tertiary);
          position: relative;
          overflow: hidden;
        }
        .vora-skeleton--circular {
          border-radius: 50%;
        }
        .vora-skeleton--rectangular {
          border-radius: var(--vora-radius-md);
        }
        .vora-skeleton--text {
          border-radius: var(--vora-radius-sm);
          height: 1em;
          margin-bottom: 0.5em;
        }

        .vora-skeleton::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: skeleton-shimmer 1.5s infinite linear;
        }

        @keyframes skeleton-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
