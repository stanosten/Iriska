const CACHE_NAME = 'iriska-cache-v1';

const getBasePath = () => {
  const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, "");
  return scopePath === "/" ? "" : scopePath;
};

const getPrecacheUrls = (basePath) => {
  const root = basePath || "/";
  return [
    root,
    `${basePath}/img/hero_photo1.webp`,
    `${basePath}/img/hero_photo2.webp`,
    `${basePath}/img/studio.webp`
  ];
};

self.addEventListener('install', (event) => {
  const basePath = getBasePath();
  const precacheUrls = getPrecacheUrls(basePath);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(precacheUrls);
      })
      .then(() => self.skipWaiting())
  );
});

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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const basePath = getBasePath();

  // Игнорируем не-GET запросы и сторонние API (например, Yandex Maps)
  if (event.request.method !== 'GET' || event.request.url.includes('api-maps.yandex.ru')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          // Кэшируем только успешные ответы для статики (шрифты, изображения, js, css)
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const url = new URL(event.request.url);
          const isStaticAsset = url.pathname.match(/\.(webp|png|jpg|jpeg|svg|woff2|css|js)$/);
          const nextAssetPath = `${basePath}/_next/static/`;
          const isNextAsset =
            url.pathname.startsWith(nextAssetPath) ||
            (basePath === "" && url.pathname.startsWith('/_next/static/'));

          if (isStaticAsset || isNextAsset) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        });
      })
  );
});
