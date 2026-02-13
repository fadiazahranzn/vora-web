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

    // Skip waiting to ensure sw takes control immediately
    self.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
            self.skipWaiting();
        }
    });
} else {
    console.log('Workbox could not be loaded. Caching will not be available.');
}
