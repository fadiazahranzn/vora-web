import React from 'react'
import styles from './Toggle.module.css'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  id,
}) => {
  const generatedId = React.useId()
  const toggleId = id || generatedId

  return (
    <label
      htmlFor={toggleId}
      className={`${styles.label} ${disabled ? styles.disabled : ''}`}
    >
      <input
        type="checkbox"
        id={toggleId}
        className={styles.input}
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
      />
      <span className={`${styles.switch} ${checked ? styles.checked : ''}`}>
        <span className={styles.thumb} />
      </span>
      {label && <span>{label}</span>}
    </label>
  )
}
