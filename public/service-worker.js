const CACHE_NAME = 'mon-site-cache-v1';
const cacheName = 'downloaded-videos-cache';

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
  if (event.request && event.request.url && event.request.url.endsWith('.mp4')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchedResponse) => {
          console.log(`Video fetched: ${event.request.url}`);
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
    const {
      url,
      video_Image,
      Body,
      Cat,
      CatPage,
      Categorie,
      Category,
      Channel,
      Cover,
      Created_at,
      Hours,
      ID,
      Image,
      Likes,
      Mail,
      NextVideo,
      PageName,
      PageCreated,
      Photo,
      Short,
      Title,
      User,
      UserId,
      Uuid,
      Video,
      Views,
      Visible,
      uniid,
    } = event.data;

    const newUrl = 'https://terama.vercel.app:3000/Watch?v=' + uniid;

    caches.open(CACHE_NAME).then((cache) => {
      cache.add(newUrl);
      console.log(`URL cached: ${newUrl}`);
    });

    // Cache the video with correct Content-Type
    caches.open(cacheName).then(async (cache) => {
      try {
        const videoResponse = await fetch(url);

        if (!videoResponse.ok) {
          throw new Error(`Failed to fetch video: ${url}`);
        }

        const videoBlob = await videoResponse.blob();
        console.log(videoBlob);
        await cache.put(url, new Response(videoBlob, {
          headers: { 'Content-Type': 'video/mp4' }
        }));
        console.log(`Video cached: ${url}`);
      } catch (error) {
        console.error('Error caching video:', error);
      }
    });

    // Cache the video image
    caches.open(cacheName).then((cache) => {
      fetch(video_Image).then((response) => {
        cache.put(video_Image, response.clone());
        console.log('Image cached successfully.');
      });
    });

    // Create video data object
    const videoCacheData = {
      Body,
      Cat,
      CatPage,
      Categorie,
      Category,
      Channel,
      Cover,
      Created_at,
      Hours,
      ID,
      Image,
      Likes,
      Mail,
      NextVideo,
      PageName,
      PageCreated,
      Photo,
      Short,
      Title,
      User,
      UserId,
      Uuid,
      Video,
      Views,
      Visible,
      uniid,
    };

    // Cache the video data as JSON using a unique key
    const videoDataKey = `video-${videoCacheData.uniid}_data`; // Create unique key
    caches.open(cacheName).then((cache) => {
      const videoDataJson = JSON.stringify(videoCacheData);
      return cache.put(videoDataKey, new Response(videoDataJson)); // Added return
    }).then(() => {
      console.log('Video data cached successfully.');
    });
  }
});

