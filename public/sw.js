importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
    console.log('Workbox is loaded');

    // Cache names (BR-141 / BR-50)
    const CACHE_PREFIX = 'vora-cache';
    const CACHE_VERSION = 'v1';

    const STATIC_CACHE = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
    const API_CACHE = `${CACHE_PREFIX}-api-${CACHE_VERSION}`;
    const IMAGE_CACHE = `${CACHE_PREFIX}-images-${CACHE_VERSION}`;
    const PAGES_CACHE = `${CACHE_PREFIX}-pages-${CACHE_VERSION}`;

    // Pre-cache core assets (BR-140)
    workbox.precaching.precacheAndRoute([
        { url: '/', revision: CACHE_VERSION },
        { url: '/offline', revision: CACHE_VERSION },
        { url: '/manifest.json', revision: CACHE_VERSION },
        { url: '/icons/apple-icon-180.png', revision: CACHE_VERSION },
        { url: '/icons/favicon-196.png', revision: CACHE_VERSION },
        { url: '/icons/logo.svg', revision: CACHE_VERSION },
        { url: '/icons/manifest-icon-192.maskable.png', revision: CACHE_VERSION },
        { url: '/icons/manifest-icon-512.maskable.png', revision: CACHE_VERSION },
    ]);

    // 1. API responses: Network First (BR-138)
    workbox.routing.registerRoute(
        ({ url }) => url.pathname.startsWith('/api/'),
        new workbox.strategies.NetworkFirst({
            cacheName: API_CACHE,
            networkTimeoutSeconds: 30, // 30-second timeout
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 100, // Max 100 API responses
                    maxAgeSeconds: 24 * 60 * 60, // 24-hour cache max age
                }),
            ],
        })
    );

    // 2. Next.js static assets: Cache First (BR-137)
    workbox.routing.registerRoute(
        ({ url }) => url.pathname.startsWith('/_next/static/'),
        new workbox.strategies.CacheFirst({
            cacheName: STATIC_CACHE,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 200, // Max 200 static assets
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30-day max age
                }),
            ],
        })
    );

    // 3. Images: Cache First (BR-137)
    workbox.routing.registerRoute(
        ({ request }) =>
            request.destination === 'image' ||
            /\.(?:png|jpg|jpeg|svg|gif|ico)$/.test(new URL(request.url).pathname),
        new workbox.strategies.CacheFirst({
            cacheName: IMAGE_CACHE,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 100,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7-day max age
                }),
            ],
        })
    );

    // 4. Navigation requests (HTML pages): Stale While Revalidate (BR-139)
    workbox.routing.registerRoute(
        ({ request }) => request.mode === 'navigate',
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: PAGES_CACHE,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 50,
                }),
            ],
        })
    );

    // Set offline fallback (BR-142)
    workbox.routing.setCatchHandler(async ({ event }) => {
        if (event.request.mode === 'navigate') {
            const offlineKey = workbox.precaching.getCacheKeyForURL('/offline');
            return (await caches.match(offlineKey)) || Response.error();
        }
        return Response.error();
    });

    // 5. Other local assets (fonts, icons): Cache First
    workbox.routing.registerRoute(
        ({ url }) => url.origin === self.location.origin &&
            (url.pathname.startsWith('/fonts/') || url.pathname.startsWith('/icons/')),
        new workbox.strategies.CacheFirst({
            cacheName: STATIC_CACHE,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                }),
            ],
        })
    );

    // Cache versioning and cleanup (BR-141 / BR-50)
    self.addEventListener('activate', (event) => {
        const cacheAllowlist = [STATIC_CACHE, API_CACHE, IMAGE_CACHE, PAGES_CACHE];
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName.startsWith(CACHE_PREFIX) && !cacheAllowlist.includes(cacheName)) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    });

    // --- Background Sync Logic (STORY-004) ---
    const DB_NAME = 'vora-sync-queue';
    const STORE_NAME = 'requests';

    async function openSyncDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };
        });
    }

    async function getQueuedRequests() {
        const db = await openSyncDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => {
                const results = request.result;
                results.sort((a, b) => a.timestamp - b.timestamp);
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async function removeFromSyncQueue(id) {
        const db = await openSyncDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async function updateSyncRetryCount(id, count) {
        const db = await openSyncDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const getReq = store.get(id);
            getReq.onsuccess = () => {
                const data = getReq.result;
                data.retryCount = count;
                store.put(data).onsuccess = () => resolve();
            };
            getReq.onerror = () => reject(getReq.error);
        });
    }

    async function replaySyncQueue() {
        const requests = await getQueuedRequests();
        console.log(`Replaying ${requests.length} queued requests...`);

        for (const req of requests) {
            try {
                const response = await fetch(req.url, {
                    method: req.method,
                    headers: req.headers,
                    body: req.body,
                });

                if (response.ok || response.status === 409) {
                    // Success or Conflict (Conflict handled as per BR-144/last-write-wins)
                    // If 409, server has a newer version, so we discard our older change.
                    await removeFromSyncQueue(req.id);
                } else {
                    // Retry logic (up to 3 times)
                    if (req.retryCount < 3) {
                        await updateSyncRetryCount(req.id, req.retryCount + 1);
                    } else {
                        console.error('Max retries reached for request:', req.id);
                        await removeFromSyncQueue(req.id); // Or move to a "failed" store
                    }
                }
            } catch (error) {
                console.error('Failed to replay request:', req.id, error);
                // Keep in queue for next sync attempt if network error
            }
        }

        // Notify clients that sync is complete
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETED',
                count: requests.length
            });
        });
    }

    // Handle Background Sync API
    self.addEventListener('sync', (event) => {
        if (event.tag === 'sync-mutations') {
            event.waitUntil(replaySyncQueue());
        }
    });

    // Handle online event fallback for browsers without Background Sync
    self.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
            self.skipWaiting();
        }

        if (event.data && event.data.type === 'SYNC_QUEUED') {
            // Check if we should try replaying (if online)
            event.waitUntil(replaySyncQueue());
        }

        if (event.data && event.data.type === 'GET_PENDING_COUNT') {
            getQueuedRequests().then(requests => {
                event.source.postMessage({
                    type: 'PENDING_COUNT',
                    count: requests.length
                });
            });
        }
    });
} else {
    console.log('Workbox could not be loaded. Caching will not be available.');
}
