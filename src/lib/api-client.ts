import { addToQueue } from './sync-db'

export async function apiFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
        options.method || 'GET'
    )

    // If online, try fetching normally
    if (typeof navigator !== 'undefined' && navigator.onLine) {
        try {
            const response = await fetch(url, options)

            // If server returns conflict (409), we might need to handle it
            // but for background sync, it's mostly handled during replay.

            return response
        } catch (error) {
            // If network error occurred despite being "online"
            if (isMutation) {
                await queueMutation(url, options)
                return new Response(JSON.stringify({ queued: true }), {
                    status: 202,
                    headers: { 'Content-Type': 'application/json' },
                })
            }
            throw error
        }
    }

    // If offline
    if (isMutation) {
        await queueMutation(url, options)

        // Notify Service Worker about new queued item if Background Sync is not supported
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SYNC_QUEUED' })
        }

        return new Response(JSON.stringify({ queued: true }), {
            status: 202,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    // For GET requests when offline, we rely on the Service Worker's cache
    return fetch(url, options)
}

async function queueMutation(url: string, options: RequestInit) {
    const headers: Record<string, string> = {}
    if (options.headers) {
        new Headers(options.headers).forEach((value, key) => {
            headers[key] = value
        })
    }

    await addToQueue({
        url,
        method: options.method || 'POST',
        body: typeof options.body === 'string' ? options.body : null,
        headers,
    })

    // Register for Background Sync if available
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready
        try {
            // @ts-ignore - sync is not in all types
            await registration.sync.register('sync-mutations')
        } catch (err) {
            console.error('Background Sync registration failed:', err)
        }
    }
}
