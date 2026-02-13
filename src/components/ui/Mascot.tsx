'use client'

import React, { useState, useEffect } from 'react'
import styles from './Mascot.module.css'

export type MascotExpression =
  | 'happy'
  | 'neutral'
  | 'motivated'
  | 'sleeping'
  | 'proud'
  | 'concerned'
  | 'cheering'
  | 'supportive'

interface MascotProps {
  size?: number
  expression?: MascotExpression
  className?: string
}

const MascotSVG: React.FC<{ expression: MascotExpression }> = ({
  expression,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.svg}
      role="img"
      aria-label={`Mascot feeling ${expression}`}
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
      ) : expression === 'proud' || expression === 'cheering' ? (
        <>
          {/* Happy closed eyes / Cheering eyes */}
          <path
            d="M30 45 Q 35 40 40 45"
            stroke="var(--vora-color-text-primary)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M60 45 Q 65 40 70 45"
            stroke="var(--vora-color-text-primary)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : expression === 'concerned' ? (
        <>
          {/* Concerned eyes */}
          <circle
            cx="35"
            cy="45"
            r="3"
            fill="var(--vora-color-text-primary)"
          />
          <circle
            cx="65"
            cy="45"
            r="3"
            fill="var(--vora-color-text-primary)"
          />
          {/* Eyebrows */}
          <path
            d="M30 38 L 40 40"
            stroke="var(--vora-color-text-secondary)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M70 38 L 60 40"
            stroke="var(--vora-color-text-secondary)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {/* Default eyes */}
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
      {(expression === 'happy' || expression === 'supportive') && (
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
      {(expression === 'motivated' || expression === 'proud') && (
        <path
          d="M35 65 Q 50 78 65 65"
          stroke="var(--vora-color-accent-primary)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {expression === 'cheering' && (
        <path
          d="M35 65 Q 50 80 65 65 Z"
          fill="var(--vora-color-accent-primary)"
          stroke="var(--vora-color-accent-primary)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      )}
      {expression === 'concerned' && (
        <path
          d="M40 70 Q 50 65 60 70"
          stroke="var(--vora-color-text-secondary)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* Accessories */}
      {expression === 'cheering' && (
        <>
          {/* Arms up */}
          <path
            d="M 15 60 Q 5 40 20 25"
            stroke="var(--vora-color-accent-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 85 60 Q 95 40 80 25"
            stroke="var(--vora-color-accent-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
      {expression === 'supportive' && (
        <>
          {/* Hugging Arms */}
          <path
            d="M 20 70 Q 30 80 40 80"
            stroke="var(--vora-color-accent-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 80 70 Q 70 80 60 80"
            stroke="var(--vora-color-accent-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
    </svg>
  )
}

export const Mascot: React.FC<MascotProps> = ({
  size = 80,
  expression = 'happy',
  className = '',
}) => {
  const [currentExp, setCurrentExp] = useState<MascotExpression>(expression)
  const [prevExp, setPrevExp] = useState<MascotExpression | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle expression changes with crossfade
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (expression !== currentExp) {
      if (prefersReducedMotion) {
        setCurrentExp(expression)
        setPrevExp(null)
      } else {
        setPrevExp(currentExp)
        setCurrentExp(expression)
        setIsAnimating(true)

        const timer = setTimeout(() => {
          setIsAnimating(false)
          setPrevExp(null)
        }, 300)

        return () => clearTimeout(timer)
      }
    }
  }, [expression, currentExp])

  return (
    <div
      className={`${styles.mascot} ${className}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
      }}
    >
      {/* Current Expression (Bottom Layer) */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <MascotSVG expression={currentExp} />
      </div>

      {/* Previous Expression (Top Layer - Fading Out) */}
      {isAnimating && prevExp && (
        <div
          className={styles.fadeout}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <MascotSVG expression={prevExp} />
        </div>
      )}
    </div>
  )
}
