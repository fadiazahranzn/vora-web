import React from 'react'

interface CardProps {
  variant?: 'static' | 'interactive' | 'expandable' | 'selectable'
  selected?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string // Add className
}

export function Card({
  variant = 'static',
  selected,
  onClick,
  children,
  className = '',
}: CardProps) {
  const isClickable = variant !== 'static'

  // Base classes directly mapped from global CSS
  const classes = [
    'vora-card',
    `vora-card--${variant}`,
    selected ? 'vora-card--selected' : '',
    isClickable ? 'vora-card--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter') onClick?.()
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}
