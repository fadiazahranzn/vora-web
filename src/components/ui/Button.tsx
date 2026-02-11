import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'full'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  children,
  disabled,
  className = '',
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseClass = 'vora-btn'
  const variantClass = `vora-btn--${variant}`
  const sizeClass =
    size === 'full' || fullWidth ? 'vora-btn--full' : `vora-btn--${size}`
  const loadingClass = isLoading ? 'vora-btn--loading' : ''

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${loadingClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="vora-btn__spinner" aria-label="Loading" />
      ) : (
        <>
          {leftIcon && <span className="vora-btn__icon">{leftIcon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
