'use client'

import React, { useEffect } from 'react'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { Mascot } from '../mascot/Mascot'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { useToast } from '../ui/Toast'
import { useSession } from 'next-auth/react'
import styles from './PWAInstallPrompt.module.css'

export default function PWAInstallPrompt() {
    const { data: session } = useSession()
    const {
        shouldShowPrompt,
        handleInstall,
        handleNotNow,
        handleDontShowAgain,
        isIOS,
    } = usePWAInstall()
    const { showToast } = useToast()

    const onInstallClick = async () => {
        try {
            await handleInstall()
            // Note: appinstalled event handler in hook will show the toast
        } catch (error) {
            console.error('Installation failed', error)
        }
    }

    // Handle successful installation toast
    useEffect(() => {
        const handler = () => {
            showToast('Vora installed! Access it from your home screen.', 'success')
        }
        window.addEventListener('appinstalled', handler)
        return () => window.removeEventListener('appinstalled', handler)
    }, [showToast])

    if (!session || !shouldShowPrompt) return null

    return (
        <BottomSheet
            isOpen={shouldShowPrompt}
            onClose={handleNotNow}
            title="Install Vora"
        >
            <div className={styles.container}>
                <div className={styles.mascotWrapper}>
                    <Mascot expression="pointing" size="md" />
                </div>

                <div className={styles.content}>
                    <h2 className={styles.title}>Install Vora</h2>
                    <p className={styles.description}>
                        Install Vora on your device for a better experience and offline access.
                    </p>
                </div>

                {isIOS ? (
                    <div className={styles.iosInstructions}>
                        <div className={styles.iosStep}>
                            <span>1. Tap the Share button</span>
                            <div className={styles.icon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2">
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                    <polyline points="16 6 12 2 8 6" />
                                    <line x1="12" y1="2" x2="12" y2="15" />
                                </svg>
                            </div>
                        </div>
                        <div className={styles.iosStep}>
                            <span>2. Scroll down and tap "Add to Home Screen"</span>
                            <div className={styles.icon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <line x1="12" y1="8" x2="12" y2="16" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.actions}>
                        <Button
                            onClick={onInstallClick}
                            className={styles.installButton}
                            variant="primary"
                            size="lg"
                        >
                            Install Vora
                        </Button>
                    </div>
                )}

                <div className={styles.secondaryActions}>
                    <button className={styles.textButton} onClick={handleNotNow}>
                        Not now
                    </button>
                    <button className={styles.textButton} onClick={handleDontShowAgain}>
                        Don't show again
                    </button>
                </div>
            </div>
        </BottomSheet>
    )
}
