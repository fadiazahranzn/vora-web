import { useState, useEffect } from 'react'
import { getQueueCount } from '@/lib/sync-db'

export function useSyncStatus() {
    const [pendingCount, setPendingCount] = useState(0)

    useEffect(() => {
        // Initial count
        getQueueCount().then(setPendingCount)

        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'PENDING_COUNT') {
                setPendingCount(event.data.count)
            }
            if (event.data && event.data.type === 'SYNC_COMPLETED') {
                // Refresh count after sync
                getQueueCount().then(setPendingCount)

                // You could also trigger a toast here if you want it globally
                if (typeof window !== 'undefined' && event.data.count > 0) {
                    // Success toast logic could go here or in the component
                }
            }
        }

        const handleOnline = () => {
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: 'SYNC_QUEUED' })
            }
        }

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', handleMessage)
            window.addEventListener('online', handleOnline)

            // Request update
            navigator.serviceWorker.ready.then((registration) => {
                if (registration.active) {
                    registration.active.postMessage({ type: 'GET_PENDING_COUNT' })
                }
            })
        }

        // Fallback: poll every 10 seconds if no SW message
        const interval = setInterval(() => {
            getQueueCount().then(setPendingCount)
        }, 10000)

        return () => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('message', handleMessage)
                window.removeEventListener('online', handleOnline)
            }
            clearInterval(interval)
        }
    }, [])

    return { pendingCount }
}
