const CACHE_NAME = 'mon-site-cache-v1';
const cacheName = 'downloaded-videos-cache';
const imageCacheName = 'downloaded-images-cache';
const video_Metadata_Url = 'metadata-video';

const urlsToCache = ['/downloads'];

self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.video_Url.endsWith('.mp4')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchedResponse) => {
          console.log(`Video fetched: ${event.request.video_Url}`);
          return fetchedResponse;
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('message', (event) => {
  console.log('Message received:', event.data);

  if (event.data && event.data.type === 'CACHE_VIDEO') {
    const { video_Url, video_Image, metadata } = event.data;
    
    const newUrl = 'https://terama.vercel.app/Watch?v=' + metadata.uniid;
    
    // Mise en cache de la vidéo
    caches.open(cacheName).then((cache) => {
      cache.add(video_Url);
      console.log(`Video cached: ${video_Url}`);
    })
    .then(() => {
      // Mise en cache de l'image
      fetch(video_Image)
      .then((imageResponse) => {
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image`);
        }
        return caches.open(imageCacheName)
          .then((imageCache) => {
            imageCache.put(video_Image, imageResponse.clone());
            console.log('Image cached successfully.');
          });
      })
      .then(() => {
        // Mise en cache des métadonnées de la vidéo
        const metadataResponse = new Response(JSON.stringify(metadata));
        return caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(video_Metadata_Url, metadataResponse);
            console.log('Metadata cached successfully.');
          });
      })
      .then(() => {
        // Mise en cache de la nouvelle URL
        return fetch(newUrl)
          .then((newResponse) => {
            return new Promise((resolve) => {
              const newResponseClone = newResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(newUrl, newResponseClone);
                console.log(`New URL cached: ${newUrl}`);
                resolve();
              });
            });
          });
      })
      .catch((error) => {
        console.error('Cache error:', error);
      });
    });
  }
});
