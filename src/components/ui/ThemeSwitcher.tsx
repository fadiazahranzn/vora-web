'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { clsx } from 'clsx'
import styles from './ThemeSwitcher.module.css'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const options = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const

  return (
    <div
      className={styles.container}
      role="radiogroup"
      aria-label="Theme preference"
    >
      {options.map((opt) => {
        const Icon = opt.icon
        const isActive = theme === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={clsx(styles.option, isActive && styles.active)}
            aria-checked={isActive}
            role="radio"
            title={opt.label}
          >
            <Icon size={16} />
            <span className={styles.srOnly}>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
