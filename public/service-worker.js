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
      uniid
    } = event.data;

    const newUrl = 'https://terama.vercel.app/Watch?v=' + uniid;

    caches.open(CACHE_NAME).then((cache) => {
      cache.add(newUrl);
      console.log(`URL cached: ${newUrl}`);
    });

    // Mise en cache de la vidéo
    caches.open(cacheName).then((cache) => {
      // Cachez l'URL de la vidéo avec le bon type de contenu
      const videoResponse = new Response(null, {
        headers: { 'Content-Type': 'video/mp4' }
      });
      cache.put(url, videoResponse);
      console.log(`Video cached: ${url}`);

      // Cachez l'image du vidéo
      fetch(video_Image).then((response) => {
        cache.put(video_Image, response.clone());
        console.log('Image cached successfully.');
      });

      // Création d'un objet contenant toutes les données du vidéo
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
        uniid
      };

      // Cachez les données du vidéo
      cache.put(url, new Response(JSON.stringify(videoCacheData)));
      console.log('Video data cached successfully.');
    }).catch((error) => {
      console.error('Cache error:', error);
    });
  }
});
