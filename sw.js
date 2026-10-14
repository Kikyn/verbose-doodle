// sw.js — Service Worker para almacenamiento en caché de recursos estáticos

const CACHE_NAME = 'boutique-pos-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './app.js',
    './db.js',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/dexie/dist/dexie.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
