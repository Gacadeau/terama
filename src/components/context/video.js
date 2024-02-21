import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { SessionContext } from './Auth';
const VideoContext = React.createContext();

function VideoProvider(props) {
  const auto = useContext(SessionContext)
  const router = useRouter()
  const [video, setVideo] = useState(null);
  const [online, setOnline] = useState(true);

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
      name: 'Unknown',
      body: 'Unknown',
      page: 'Unknown',
      profil: 'Unknown',
      create: 'Unknown',
      Uuid: 'Unknown',
      uniid: 'Unknown',
    };
  };

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    }
  }, []);

  useEffect(() => {
    async function fetchData(post, user) {
      let data;
      try {
        if (online) {
          console.log('online:', online);
          const response = await fetch(`/api/posts/watch/${post}/0/${user}`);
          data = await response.json();
          console.log('dataonline:', data);
        } else {
          console.log('online:', online);
          const cache = await caches.open('downloaded-videos-cache');
          const requests = await cache.keys();

          const videoInfoPromises = requests.map(async (request, index) => {
            const url = request.url;
            const response = await cache.match(request);

            console.log('Cache Response:', response);

            const name = getVideoNameFromHeaders(response.headers);
            const fileInfo = getFileInformationFromHeaders(response.headers);
            const videoBlob = await response.blob();

            return { url, name, blob: videoBlob, ...fileInfo };
          });

          data = await Promise.all(videoInfoPromises);
          console.log('dataoffline:', data);
        }

        if (data && data[0]) {
          setVideo(data[0]);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    }

    if (router.query.v && auto.session) {
      if (auto.session === 'unlogged') {
        fetchData(router.query.v, 0);
      } else {
        fetchData(router.query.v, auto.session.ID);
      }
    }
  }, [router.query.v, auto, online]);

  return (
    <VideoContext.Provider
      value={{
        video,
      }}>
      {props.children}
    </VideoContext.Provider>
  );
}

export { VideoProvider, VideoContext };
