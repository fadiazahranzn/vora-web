'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
    LayoutDashboard,
    CheckSquare,
    BarChart2,
    User,
} from 'lucide-react'
import styles from './BottomNav.module.css'

const NAV_ITEMS = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className={styles.bottomNav} aria-label="Mobile Navigation">
            <ul className={styles.navList}>
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <li key={item.href} className={styles.navItem}>
                            <Link
                                href={item.href}
                                className={clsx(styles.navLink, isActive && styles.active)}
                            >
                                <div className={styles.iconWrapper}>
                                    <Icon size={20} />
                                    {isActive && <div className={styles.activeDot} />}
                                </div>
                                <span className={styles.label}>{item.label}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
