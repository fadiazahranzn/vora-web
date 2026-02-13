import React, { useId } from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  multiline?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, helperText, multiline = false, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const inputClasses = [
      styles.input,
      error ? styles.error : '',
      multiline ? styles.textarea : '',
      className
    ].filter(Boolean).join(' ');

    const ariaDescribedBy = [
      error ? errorId : '',
      helperText ? helperId : ''
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.container}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {multiline ? (
            <textarea
              id={inputId}
              ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
              className={inputClasses}
              aria-invalid={!!error}
              aria-describedby={ariaDescribedBy || undefined}
              {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
            />
          ) : (
            <input
              id={inputId}
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              className={inputClasses}
              aria-invalid={!!error}
              aria-describedby={ariaDescribedBy || undefined}
              {...props as React.InputHTMLAttributes<HTMLInputElement>}
            />
          )}
        </div>
        {error && (
          <span id={errorId} className={styles.errorText} role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={helperId} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
