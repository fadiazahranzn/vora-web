import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  leadingIcon?: React.ReactNode
  trailingAction?: React.ReactNode
  className?: string // Add className
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leadingIcon,
      trailingAction,
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div
        className={`vora-input ${error ? 'vora-input--error' : ''} ${className}`}
      >
        <label htmlFor={inputId} className="vora-input__label">
          {label}
        </label>
        <div className="vora-input__container">
          {leadingIcon && <div className="vora-input__icon">{leadingIcon}</div>}
          <input
            ref={ref}
            id={inputId}
            className="vora-input__field"
            aria-invalid={!!error}
            {...props}
          />
          {trailingAction && (
            <div className="vora-input__action">{trailingAction}</div>
          )}
        </div>
        {error && (
          <p className="vora-input__error" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="vora-input__helper">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
