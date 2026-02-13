import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    iconOnly = false,
    disabled,
    ...props
  }, ref) => {
    const classes = [
      styles.button,
      styles[variant],
      styles[size],
      isLoading ? styles.loading : '',
      iconOnly ? styles.iconOnly : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <span className={styles.spinner} role="status" aria-label="Loading" />}
        {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        {!isLoading && !iconOnly && <span className={styles.content}>{children}</span>}
        {!isLoading && iconOnly && children}
        {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
