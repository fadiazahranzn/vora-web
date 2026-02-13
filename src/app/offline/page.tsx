'use client'

import React, { useEffect, useState } from 'react'
import { Mascot } from '@/components/mascot/Mascot'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import styles from './OfflinePage.module.css'

export default function OfflinePage() {
    const [pendingCount, setPendingCount] = useState<number>(0)
    const [isChecking, setIsChecking] = useState(false)

    useEffect(() => {
        // 1. Online detection and auto-reload
        const handleOnline = () => {
            window.location.reload()
        }

        window.addEventListener('online', handleOnline)

        // 2. Get pending sync count from Service Worker
        const getPendingCount = async () => {
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: 'GET_PENDING_COUNT' })
            }
        }

        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'PENDING_COUNT') {
                setPendingCount(event.data.count)
            }
        }

        navigator.serviceWorker.addEventListener('message', handleMessage)
        getPendingCount()

        // Periodically check if we're back online (fallback for some browsers)
        const interval = setInterval(() => {
            if (navigator.onLine) {
                window.location.reload()
            }
        }, 5000)

        return () => {
            window.removeEventListener('online', handleOnline)
            navigator.serviceWorker.removeEventListener('message', handleMessage)
            clearInterval(interval)
        }
    }, [])

    const handleRetry = () => {
        setIsChecking(true)
        if (navigator.onLine) {
            window.location.reload()
        } else {
            // Simulate check for 1 second
            setTimeout(() => setIsChecking(false), 1000)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.mascotWrapper}>
                    <Mascot
                        size={180}
                        expression="concerned"
                        animate={!isChecking}
                    />
                </div>

                <h1 className={styles.title}>You're offline</h1>

                <p className={styles.description}>
                    Don't worry, your progress is saved! We'll sync everything once you're back online.
                </p>

                {pendingCount > 0 && (
                    <div className={styles.syncIndicator}>
                        <Badge variant="info">
                            {pendingCount} action{pendingCount !== 1 ? 's' : ''} pending sync
                        </Badge>
                    </div>
                )}

                <div className={styles.actions}>
                    <Button
                        onClick={handleRetry}
                        size="lg"
                        isLoading={isChecking}
                        variant="primary"
                    >
                        Retry Connection
                    </Button>
                </div>

                <p className={styles.footer}>
                    Check your internet connection or Wi-Fi settings.
                </p>
            </div>
        </div>
    )
}
