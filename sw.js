const CACHE_NAME = 'pk-fx-v1';

// Ide soroljuk fel, miket kell a telefonnak elmentenie offline használatra
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './szinpad.jpg' 
];

// 1. Telepítéskor betölti a fájlokat a raktárba
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 2. Amikor a telefon kéri a fájlt, először a raktárban nézzük meg, ne a neten
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});