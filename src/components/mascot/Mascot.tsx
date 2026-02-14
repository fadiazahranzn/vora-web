'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
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
}> = ({ expression }) => {
  return (
    <div className={styles.svg} style={{ position: 'relative' }}>
      <Image
        src="/images/mascot.webp"
        alt={`Mascot feeling ${expression}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
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
        <MascotSVG expression={currentExp} />
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
          <MascotSVG expression={prevExp} />
        </div>
      )}
    </div>
  )
}
