// Service worker: rende l'app installabile e utilizzabile offline.
// Bump questa costante ad ogni deploy per invalidare la cache precedente.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `prompt-manager-${CACHE_VERSION}`;

// Solo asset same-origin: le risorse CDN vengono gestite a runtime
// (stale-while-revalidate) per non far fallire l'install su una CDN lenta/offline.
const APP_SHELL = [
    './',
    './index.html',
    './stile.css',
    './main.js',
    './EventManager.js',
    './ModalManager.js',
    './PromptGenerator.js',
    './PromptService.js',
    './UIRenderer.js',
    './promptFactory.js',
    './config.js',
    './manifest.json',
    './icon.svg',
    './icon-192.png',
    './icon-512.png',
    './icon-192-maskable.png',
    './icon-512-maskable.png',
    './apple-touch-icon.png',
    './prompts/armonizzazione.js',
    './prompts/revisione.js',
    './data/linkAI.js',
    './data/patternScritturaAI.js',
    './data/toneProfiles.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    if (url.origin === self.location.origin) {
        // App shell: network-first, così un utente online vede subito gli aggiornamenti,
        // con fallback alla cache quando è offline.
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html')))
        );
        return;
    }

    // Librerie da CDN: stale-while-revalidate, per funzionare offline dopo la prima visita.
    event.respondWith(
        caches.match(request).then((cached) => {
            const network = fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() => cached);
            return cached || network;
        })
    );
});
