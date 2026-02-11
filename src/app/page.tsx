'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import styles from './page.module.css'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h1>Vora Dashboard</h1>
        {session ? (
          <div className={styles.userInfo}>
            <p>
              Welcome back,{' '}
              <strong>{session.user?.name || session.user?.email}</strong>!
            </p>
            <p>You are now signed in.</p>
            <Button
              variant="secondary"
              onClick={() => signOut({ callbackUrl: '/login' })}
              style={{ marginTop: '20px' }}
            >
              Log Out
            </Button>
          </div>
        ) : (
          <p>You are not signed in. Redirecting...</p>
        )}
      </Card>
    </div>
  )
}
