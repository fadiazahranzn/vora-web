'use client'

import React, { useState, useEffect } from 'react'
import styles from './Mascot.module.css'
import { clsx } from 'clsx'

export type MascotExpression =
  | 'happy'
  | 'waving'
  | 'celebrating'
  | 'encouraging'
  | 'concerned'
  | 'pointing'

interface MascotProps {
  expression?: MascotExpression
  size?: 'sm' | 'md' | 'lg' | number
  animate?: boolean
  className?: string
}

const SIZE_MAP = {
  sm: 64,
  md: 120,
  lg: 200,
}

const MascotSVG: React.FC<{
  expression: MascotExpression
  animate: boolean
}> = ({ expression, animate }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.svg}
      role="img"
      aria-label={`Mascot feeling ${expression}`}
    >
      {/* Shadow */}
      <ellipse cx="100" cy="185" rx="50" ry="8" fill="rgba(0,0,0,0.05)" />

      {/* Main Body / Head */}
      <rect
        x="40"
        cy="40"
        width="120"
        height="110"
        rx="40"
        fill="var(--vora-color-bg-primary)"
        stroke="var(--vora-color-accent-primary)"
        strokeWidth="6"
      />

      {/* Glow effect */}
      <rect
        x="48"
        cy="48"
        width="104"
        height="94"
        rx="34"
        stroke="var(--vora-color-accent-subtle)"
        strokeWidth="2"
        opacity="0.5"
      />

      {/* Expression Specific Elements */}
      <g className={clsx(animate && styles.animateBounce)}>
        {/* Eyes */}
        {expression === 'celebrating' ? (
          <>
            <path
              d="M70 85 L85 70 L100 85"
              stroke="var(--vora-color-accent-primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M115 85 L130 70 L145 85"
              stroke="var(--vora-color-accent-primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : expression === 'concerned' ? (
          <>
            <circle
              cx="80"
              cy="85"
              r="8"
              fill="var(--vora-color-text-primary)"
            />
            <circle
              cx="120"
              cy="85"
              r="8"
              fill="var(--vora-color-text-primary)"
            />
            <path
              d="M70 70 L90 75"
              stroke="var(--vora-color-text-secondary)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M130 70 L110 75"
              stroke="var(--vora-color-text-secondary)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle
              cx="80"
              cy="85"
              r="9"
              fill="var(--vora-color-accent-primary)"
            />
            <circle
              cx="120"
              cy="85"
              r="9"
              fill="var(--vora-color-accent-primary)"
            />
            {/* Eye glint */}
            <circle cx="83" cy="82" r="3" fill="white" />
            <circle cx="123" cy="82" r="3" fill="white" />
          </>
        )}

        {/* Mouth */}
        {expression === 'happy' ||
        expression === 'waving' ||
        expression === 'pointing' ? (
          <path
            d="M85 115 Q100 130 115 115"
            stroke="var(--vora-color-accent-primary)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        ) : expression === 'celebrating' ? (
          <path
            d="M85 110 Q100 135 115 110 Z"
            fill="var(--vora-color-accent-primary)"
          />
        ) : expression === 'encouraging' ? (
          <path
            d="M90 120 H110"
            stroke="var(--vora-color-accent-primary)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M90 125 Q100 115 110 125"
            stroke="var(--vora-color-text-secondary)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </g>

      {/* Arms & Assets */}
      {expression === 'waving' && (
        <g className={clsx(animate && styles.animateWave)}>
          <path
            d="M160 110 L185 85"
            stroke="var(--vora-color-accent-primary)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle
            cx="185"
            cy="85"
            r="10"
            fill="var(--vora-color-accent-primary)"
          />
        </g>
      )}

      {expression === 'pointing' && (
        <g className={clsx(animate && styles.animatePoint)}>
          <path
            d="M160 110 L190 110"
            stroke="var(--vora-color-accent-primary)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M180 100 L195 110 L180 120"
            fill="var(--vora-color-accent-primary)"
          />
        </g>
      )}

      {expression === 'celebrating' && (
        <>
          {/* Sparkles */}
          <path d="M40 30 L45 20 L50 30 L40 30" fill="#FFD600" />
          <path d="M150 40 L160 30 L170 40 L150 40" fill="#FFD600" />
        </>
      )}
    </svg>
  )
}

export const Mascot: React.FC<MascotProps> = ({
  expression = 'happy',
  size = 'md',
  animate = true,
  className = '',
}) => {
  const [currentExp, setCurrentExp] = useState<MascotExpression>(expression)
  const [prevExp, setPrevExp] = useState<MascotExpression | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size]

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (expression !== currentExp) {
      if (prefersReducedMotion) {
        setCurrentExp(expression)
      } else {
        setPrevExp(currentExp)
        setCurrentExp(expression)
        setIsTransitioning(true)

        const timer = setTimeout(() => {
          setIsTransitioning(false)
          setPrevExp(null)
        }, 300)

        return () => clearTimeout(timer)
      }
    }
  }, [expression, currentExp])

  const animationClass = clsx(
    animate && expression === 'waving' && styles.animateWave,
    animate && expression === 'celebrating' && styles.animateJump,
    animate && expression === 'pointing' && styles.animatePoint,
    animate && expression === 'encouraging' && styles.animateEncourage,
    animate && expression === 'happy' && styles.animateBounce
  )

  return (
    <div
      className={clsx(styles.mascotContainer, className, animationClass)}
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
    >
      <div className={styles.mascotBase}>
        <MascotSVG expression={currentExp} animate={animate} />
      </div>

      {isTransitioning && prevExp && (
        <div
          className={clsx(
            styles.mascotBase,
            styles.fadeExit,
            styles.fadeExitActive
          )}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <MascotSVG expression={prevExp} animate={false} />
        </div>
      )}
    </div>
  )
}
