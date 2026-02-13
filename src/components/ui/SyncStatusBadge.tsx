'use client'

import React, { useEffect, useState } from 'react'
import { CloudOff, RefreshCw } from 'lucide-react'
import { useSyncStatus } from '@/hooks/useSyncStatus'
import styles from './SyncStatusBadge.module.css'
import { clsx } from 'clsx'
import { useToast } from '@/components/ui/Toast'

export function SyncStatusBadge() {
    const { pendingCount } = useSyncStatus()
    const { showToast } = useToast()
    const [isSyncing, setIsSyncing] = useState(false)
    const [lastCount, setLastCount] = useState(0)

    useEffect(() => {
        if (lastCount > 0 && pendingCount === 0) {
            // Sync completed
            setIsSyncing(false)
            showToast('All your offline changes have been saved!', 'success')
        } else if (pendingCount > lastCount) {
            // New items added while offline
            setIsSyncing(false)
        } else if (pendingCount > 0 && pendingCount < lastCount) {
            // Items are being synced
            setIsSyncing(true)
        }
        setLastCount(pendingCount)
    }, [pendingCount, lastCount, showToast])

    if (pendingCount === 0) return null

    return (
        <div
            className={clsx(styles.badge, isSyncing && styles.syncing)}
            title={`${pendingCount} pending syncs`}
        >
            {isSyncing ? (
                <RefreshCw size={14} className={styles.spin} />
            ) : (
                <CloudOff size={14} />
            )}
            <span className={styles.count}>{pendingCount}</span>
        </div>
    )
}
