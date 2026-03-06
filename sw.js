const CACHE_NAME = 'pk-fx-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './szinpad.jpg'
];

// Telepítéskor elmentjük a fontos fájlokat
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Régi cache-ek takarítása, ha frissítjük az appot
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Hálózati kérések elfogása (Network First stratégia)
self.addEventListener('fetch', (event) => {
  // A Firebase adatbázis hívásokat nem cacheljük, azokat hagyjuk békén
  if (event.request.url.includes('firebasedatabase.app') || event.request.url.includes('google.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Ha van net, lementjük a legfrissebb verziót a memóriába
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Ha nincs net, odaadjuk a legutolsó elmentett verziót
        return caches.match(event.request);
      })
  );
});
