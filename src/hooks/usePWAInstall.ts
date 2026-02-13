'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
    prompt(): Promise<void>
}

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstallable, setIsInstallable] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)
    const [shouldShowPrompt, setShouldShowPrompt] = useState(false)

    useEffect(() => {
        // 1. Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            (navigator as any).standalone ||
            document.referrer.includes('android-app://')
        setIsInstalled(isStandalone)

        // 2. Increment session count
        const sessions = parseInt(localStorage.getItem('vora-pwa-sessions') || '0', 10)
        localStorage.setItem('vora-pwa-sessions', (sessions + 1).toString())

        // 3. Handle beforeinstallprompt
        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            setIsInstallable(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        // 4. Handle appinstalled
        const installedHandler = () => {
            setIsInstalled(true)
            setIsInstallable(false)
            setDeferredPrompt(null)
            localStorage.setItem('vora-pwa-never-show', 'true')
        }

        window.addEventListener('appinstalled', installedHandler)

        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
            window.removeEventListener('appinstalled', installedHandler)
        }
    }, [])

    useEffect(() => {
        if (isInstalled) {
            setShouldShowPrompt(false)
            return
        }

        const sessions = parseInt(localStorage.getItem('vora-pwa-sessions') || '0', 10)
        const neverShow = localStorage.getItem('vora-pwa-never-show') === 'true'
        const dismissedUntil = parseInt(localStorage.getItem('vora-pwa-dismissed-until') || '0', 10)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

        const now = Date.now()
        const isCooldownActive = now < dismissedUntil

        // logic for showing prompt:
        // - 2+ sessions
        // - not neverShow
        // - not in cooldown
        // - (isInstallable OR isIOS)
        if (sessions >= 2 && !neverShow && !isCooldownActive && (isInstallable || isIOS)) {
            setShouldShowPrompt(true)
        } else {
            setShouldShowPrompt(false)
        }
    }, [isInstallable, isInstalled])

    const handleInstall = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
            setDeferredPrompt(null)
            setIsInstallable(false)
        }
    }

    const handleNotNow = () => {
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
        localStorage.setItem('vora-pwa-dismissed-until', (Date.now() + sevenDaysInMs).toString())
        setShouldShowPrompt(false)
    }

    const handleDontShowAgain = () => {
        localStorage.setItem('vora-pwa-never-show', 'true')
        setShouldShowPrompt(false)
    }

    return {
        isInstallable,
        isInstalled,
        shouldShowPrompt,
        handleInstall,
        handleNotNow,
        handleDontShowAgain,
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    }
}
