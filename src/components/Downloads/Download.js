// Dans votre composant React
import React, { useState, useEffect } from 'react';
import Cached from '../Cacheds/Cached'

const CachedVideos = () => {
  const [cachedVideos, setCachedVideos] = useState([]);

const getVideoNameFromHeaders = (headers) => {
  const contentDispositionHeader = headers.get('Content-Disposition');
  if (contentDispositionHeader) {
    const match = contentDispositionHeader.match(/filename=(.+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  }
  return 'Unknown';
};

const getFileInformationFromHeaders = (headers) => {
  const fileInfoHeader = headers.get('X-File-Info');
  if (fileInfoHeader) {
    return JSON.parse(fileInfoHeader);
  }
  return {
          Body:Unknown,
          Cat:Unknown,
          CatPage:Unknown,
          Categorie:Unknown,
          Category:Unknown,
          Channel:Unknown,
          Cover:Unknown,
          Created_at:Unknown,    
          Hours:Unknown,        
          ID:Unknown,
          Image:Unknown,       
          Likes:Unknown, 
          Mail:Unknown, 
          NextVideo:Unknown, 
          PageName:Unknown, 
          PageCreated:Unknown,
          Photo:Unknown,
          Short:Unknown,
          User:Unknown,
          UserId:Unknown,
          Uuid:Unknown,
          Video:Unknown,
          Views:Unknown,
          Visible:Unknown,
          uniid:Unknown
  };
};


  useEffect(() => {
    const loadCachedVideos = async () => {
      try {
        // Charger la liste des vidéos depuis le cache
        const cache = await caches.open('downloaded-videos-cache');
        const requests = await cache.keys();

        const videoInfoPromises = requests.map(async (request, index) => {
          const url = request.url;
          const response = await cache.match(request);
          
          // Ajoutez ces lignes pour afficher la réponse du cache dans la console
          console.log('Cache Response:', response);

          const name = getVideoNameFromHeaders(response.headers);
          const fileInfo = getFileInformationFromHeaders(response.headers);
          const videoBlob = await response.blob();

          return { url, name, blob: videoBlob, ...fileInfo };
        });

        // Wait for all promises to resolve
        const videoInfoArray = await Promise.all(videoInfoPromises);
        setCachedVideos(videoInfoArray);
        console.log('videos:', videoInfoArray);
      } catch (error) {
        console.error('Error loading cached videos:', error);
      }
    };

    loadCachedVideos();
  }, []); // Empty dependency array means this effect runs once after the initial render

  console.log('videos1:', cachedVideos);

  return (
    <>

      <div className="Uploads flex flex-col w-full h-full bg-white rounded-3xl">
        <div className="uploadsContainer w-full h-full pt-6 overflow-y-auto">
          {cachedVideos.length > 0 && cachedVideos.map((video, index) => (
            <React.Fragment key={video.name}>
              <Cached key={video.ID} video={video} />
              {index === cachedVideos.length - 1 && <hr className="mb-5" />} 
            </React.Fragment>
          ))}
        </div>
      </div> 

    </>
 );
};

export default CachedVideos;
