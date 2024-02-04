import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Video from '../Home/Video';

function Categorie({ cat }) {
  const router = useRouter();
  const [videos, setVideos] = useState([]);

  const fetchVideos = async (Uniid) => {
    const response = await fetch(`/api/categorie/${Uniid}/0/4`);
    const data = await response.json();
    if (data[0]) setVideos(data);
  };

  const handlePush = (category) => {
    router.push(`/categorie/${category}`);
  };

  useEffect(() => {
    fetchVideos(cat);
  }, [cat]);

  if (videos == null) return <div>Loading ...</div>;
  if(videos.length === 0) return null
  return (
    <>
      <div className="flex-row space-y-0">
        <div className="flex flex-row justify-between items-center px-6 py-3">
          <div className='text-black'><b>{cat}</b></div>
          {videos.length > 4 && (
            <div onClick={() => handlePush(cat)}>
              <button className="text-blue-500 hover:bg-gray-200 rounded-2xl px-2 cursor-pointer">
                View more
              </button>
            </div>
          )
          }
        </div>
        <div className="filmcontainerCat mt-3 gap-[1rem]">
          {videos.map((video) => (
            <Video key={video} video={video} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Categorie;