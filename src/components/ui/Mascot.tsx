'use client'

import React from 'react'

interface MascotProps {
  size?: number
  expression?: 'happy' | 'neutral' | 'motivated' | 'sleeping'
  className?: string
}

export const Mascot: React.FC<MascotProps> = ({
  size = 80,
  expression = 'happy',
  className = '',
}) => {
  return (
    <div
      className={`vora-mascot ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="vora-mascot-svg"
      >
        {/* Body */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="var(--vora-color-accent-subtle)"
          stroke="var(--vora-color-accent-primary)"
          strokeWidth="3"
        />

        {/* Eyes */}
        {expression === 'sleeping' ? (
          <>
            <path
              d="M30 45 Q 35 50 40 45"
              stroke="var(--vora-color-text-secondary)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M60 45 Q 65 50 70 45"
              stroke="var(--vora-color-text-secondary)"
              strokeWidth="2"
              fill="none"
            />
          </>
        ) : (
          <>
            <circle
              cx="35"
              cy="45"
              r="4"
              fill="var(--vora-color-text-primary)"
            />
            <circle
              cx="65"
              cy="45"
              r="4"
              fill="var(--vora-color-text-primary)"
            />
          </>
        )}

        {/* Mouth */}
        {expression === 'happy' && (
          <path
            d="M40 65 Q 50 75 60 65"
            stroke="var(--vora-color-accent-primary)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {expression === 'neutral' && (
          <path
            d="M42 68 H 58"
            stroke="var(--vora-color-text-secondary)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        {expression === 'motivated' && (
          <path
            d="M40 60 Q 50 70 60 60"
            stroke="var(--vora-color-accent-primary)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )}
      </svg>

      <style jsx>{`
        .vora-mascot {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--vora-duration-normal)
            var(--vora-easing-bounce);
        }
        .vora-mascot:hover {
          transform: scale(1.1) rotate(5deg);
        }
        .vora-mascot-svg {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}
