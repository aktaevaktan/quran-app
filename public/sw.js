// Service Worker для OctōPray App
const CACHE_NAME = 'octopray-app-v1';
const urlsToCache = [
  '/',
  '/quran',
  '/prayer-times',
  '/bookmarks',
  '/tasbih',
  '/names',
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем кэшированный ответ если есть
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Обновление кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
