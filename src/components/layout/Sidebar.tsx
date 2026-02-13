'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
    LayoutDashboard,
    CheckSquare,
    BarChart2,
    User,
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun,
} from 'lucide-react'
import styles from './Sidebar.module.css'
import CategorySidebar from './CategorySidebar'

const NAV_ITEMS = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    // Initialize collapse state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sidebar-collapsed')
        if (saved !== null) {
            setIsCollapsed(saved === 'true')
        }

        const savedTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark'
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    const toggleCollapse = () => {
        const newState = !isCollapsed
        setIsCollapsed(newState)
        localStorage.setItem('sidebar-collapsed', String(newState))
    }

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
    }

    return (
        <aside
            className={clsx(styles.sidebar, isCollapsed && styles.collapsed)}
            aria-label="Main Sidebar"
        >
            <div className={styles.header}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>✨</span>
                    {!isCollapsed && <span className={styles.logoText}>Vora</span>}
                </div>
                <button
                    onClick={toggleCollapse}
                    className={styles.collapseBtn}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={clsx(styles.navLink, isActive && styles.active)}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <Icon size={20} className={styles.icon} />
                                    {!isCollapsed && <span className={styles.label}>{item.label}</span>}
                                    {isActive && !isCollapsed && <div className={styles.activeIndicator} />}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {!isCollapsed && (
                <div className={styles.categorySection}>
                    <CategorySidebar />
                </div>
            )}

            <div className={styles.footer}>
                <button
                    onClick={toggleTheme}
                    className={styles.themeToggle}
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    {!isCollapsed && (
                        <span className={styles.label}>
                            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                        </span>
                    )}
                </button>
            </div>
        </aside>
    )
}
