'use client'

import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import styles from './page.module.css'

import DashboardLayout from '@/components/layout/DashboardLayout'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <p>You are not signed in. Redirecting...</p>
        </Card>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className={styles.dashboardGrid}>
        <Card className={styles.welcomeCard}>
          <h1>Dashboard Overview</h1>
          <p>
            Welcome back,{' '}
            <strong>{session.user?.name || session.user?.email}</strong>!
          </p>
          <p>This is where your habit tracking journey continues.</p>
        </Card>

        {/* Placeholder for future Habit Cards */}
        <div className={styles.statsGrid}>
          <Card className={styles.statCard}>
            <h3>Total Habits</h3>
            <p className={styles.statValue}>12</p>
          </Card>
          <Card className={styles.statCard}>
            <h3>Daily Streak</h3>
            <p className={styles.statValue}>5 Days</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
