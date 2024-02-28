import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function Cached({ video }) {
  console.log('video cache:', video);
  const [online, setOnline] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null); 

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
    };
  }, []);

  useEffect(() => {
    const getThumbnailFromCache = async () => {
      try {
        const cache = await caches.open('downloaded-videos-cache');
        const response = await cache.match(`/Thumbnails/${video.Image}`);
        if (response) {
          const blob = await response.blob();
          setThumbnailUrl(URL.createObjectURL(blob));
        }
      } catch (error) {
        console.error('Error fetching thumbnail from cache:', error);
      }
    };

    if (!online && video && video.Image) {
      getThumbnailFromCache();
    }
  }, [online, video]);

  const handlePlayVideo = async () => {
    if (!online && video && video.Video) {
      try {
        const cache = await caches.open('downloaded-videos-cache');
        const response = await cache.match(`/Videos/${video.Video}`);
        if (response) {
          const blob = await response.blob();
          const videoUrl = URL.createObjectURL(blob);
          setVideoUrl(videoUrl);
          // Maintenant, vous pouvez lire la vidéo à partir de videoUrl
          console.log('Video URL:', videoUrl);
          // Mettez en œuvre votre propre logique pour lire la vidéo ici
        }
      } catch (error) {
        console.error('Error fetching video from cache:', error);
      }
    }
  };

  const watchVideoLink = online ? `/Watch?v=${video.uniid}` : videoUrl;

  return (
    <>
      <div className="video1 flex flex-row w-full justify-between md:px-6 mb-6 cursor-pointer" onClick={handlePlayVideo}>
        <div className="flex flex-col m-0 md:flex-row h-[260px] md:h-[150px] bg-gray-100 space-x-1 md:space-x-5 w-[100%] md:w-[80%] md:rounded-2xl">
          <div className="w-full w-[250px] h-[210px] md:h-[130px] md:h-[150px] md:rounded-2xl overflow-hidden">
           
            <Link href={watchVideoLink}>
              {thumbnailUrl ? (
                <Image
                  width={100}
                  height={100}
                  src={thumbnailUrl}
                  className="w-full h-full object-cover"
                  alt="thumbnail"
                />
              ) : (
                <Image
                  width={100}
                  height={100}
                  src={`/Thumbnails/${video.Image}`}
                  className="w-full h-full object-cover"
                  alt="thumbnail"
                />
              )}
            </Link>
          </div>
          <div className="flex flex-col">
            <h1 className="font-semibold text-[1rem] md:text-[1.5rem]">{video.Title}</h1>
            <p className="text-sm md:text-base">{video.Body ? video.Body.split('\n').slice(0, 2).join('\n') : ''}</p>
            <Link href={`/profile?c=${video.Uuid}`}>
              <div className="description flex items-center text-sm">
                <Image
                  width={80}
                  height={80}
                  alt="profile"
                  className="lg:w-10 w-8 lg:h-10 h-8 my-1 ml-15 rounded-full"
                  src={`/Thumbnails/${video.Photo}`}
                />
                <p className="nom ml-2">{video.page}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cached;
