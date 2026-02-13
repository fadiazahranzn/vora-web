import { test, expect } from '@playwright/test'

test.describe('PWA & Offline Support', () => {
  test('Service Worker Registration', async ({ page }) => {
    await page.goto('/')

    // Check if service worker is registered
    const isServiceWorkerRegistered = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration()
      return !!registration
    })

    expect(isServiceWorkerRegistered).toBe(true)
  })

  test('Offline Fallback Page', async ({ page, context }) => {
    // Go to home page first to ensure SW is installed and caching
    await page.goto('/')

    // Wait for SW to activate and cache (simple wait, in real scenario waiting for specific event is better)
    await page.waitForTimeout(3000)

    // Simulate offline
    await context.setOffline(true)

    // Navigate to a page that hasn't been visited (should fallback to offline.html if not in cache)
    // However, in development mode, SW might not be fully active or behavior differs.
    // Assuming production build style behavior or sufficient dev setup.
    // If it's a SPA, navigation is client-side. We need to force a reload or visit a new URL.
    try {
      await page.goto('/some-non-existent-page-or-random-' + Date.now())
    } catch {
      // Build might fail navigation if offline, but SW should serve fallback
    }

    // Check for offline message
    const offlineMessage = page.getByText("You're offline")
    await expect(offlineMessage).toBeVisible()

    // Check for mascot
    const mascot = page.getByRole('img', { name: /Mascot/i })
    await expect(mascot).toBeVisible()
  })

  test('Manifest Validation via Browser', async ({ page }) => {
    await page.goto('/')
    const manifestUrl = await page.evaluate(() => {
      const link = document.querySelector('link[rel="manifest"]')
      return link ? link.getAttribute('href') : null
    })

    expect(manifestUrl).toBeTruthy()

    const response = await page.request.get(manifestUrl!)
    expect(response.status()).toBe(200)
    const manifest = await response.json()

    expect(manifest.name).toBe('Vora')
    expect(manifest.start_url).toBe('/')
    expect(manifest.display).toBe('standalone')
  })
})
