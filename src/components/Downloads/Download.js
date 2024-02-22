import React, { useState, useEffect } from 'react';
import Cached from '../Cacheds/Cached';

const CachedVideos = () => {
  const [cachedVideos, setCachedVideos] = useState([]);

  useEffect(() => {
    const loadCachedVideos = async () => {
      try {
        const cache = await caches.open('downloaded-videos-cache');
        const requests = await cache.keys();
        
        const videoInfoPromises = requests.map(async (request) => {
          const url = request.url;
          const response = await cache.match(request);

          if (response) {
            const headers = response.headers;
            const name = getVideoNameFromHeaders(headers);
            const fileInfo = await getFileInformationFromCache(response);
            return { url, name, ...fileInfo };
          } else {
            console.log('No cached response found for request:', request);
            return null;
          }
        });

        const videoInfoArray = await Promise.all(videoInfoPromises);
        const filteredVideos = videoInfoArray.filter(video => video !== null && video.url.endsWith('.mp4') );

       // const filteredVideos = videoInfoArray.filter(video => video !== null);
        setCachedVideos(filteredVideos);
        console.log('Videos loaded:', filteredVideos);
      } catch (error) {
        console.error('Error loading cached videos:', error);
      }
    };

    loadCachedVideos();
  }, []);

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

  const getFileInformationFromCache = async (response) => {
    let fileInfo = {};
    try {
      const responseData = await response.clone().json();
      fileInfo = responseData;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      // Handle non-JSON data differently if needed
    }
    return fileInfo;
  };

  return (
    <div className="Uploads flex flex-col w-full h-full bg-white rounded-3xl">
      <div className="uploadsContainer w-full h-full pt-6 overflow-y-auto">
        {cachedVideos.length > 0 && cachedVideos.map((video, index) => (
          <React.Fragment key={video.url}>
            <Cached key={video.url} video={video} />
            {index === cachedVideos.length - 1 && <hr className="mb-5" />} 
          </React.Fragment>
        ))}
      </div>
    </div> 
  );
};

export default CachedVideos;
