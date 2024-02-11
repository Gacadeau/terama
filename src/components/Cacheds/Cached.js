import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
function Cached({ video }) {
  const [imageBlobUrl, setImageBlobUrl] = useState('/img/thumb.jpg');
  const [profBlobUrl, setProfBlobUrl] = useState('/img/logo.png');
  const [online, setOnline] = useState(true);
  useEffect(()=>{
    const handleOnlineStatusChange = () =>{
      setOnline(navigator.onLine);
    };
    window.addEventListener('online',handleOnlineStatusChange);
    window.addEventListener('offline',handleOnlineStatusChange);
    setOnline(navigator.onLine);
    return () =>{
      window.removeEventListener('online' ,handleOnlineStatusChange);
      window.removeEventListener('offline',handleOnlineStatusChange);
    }

  },[]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if(online){
          const response = await fetch(`/Thumbnails/${video.Image}`);
        }
        else
        {
          const response = await fetch(`${video.video_Image}`);
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setImageBlobUrl(blobUrl);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    const fetchProfile = async (photo) => {
      try {
        if (photo) {
          const response = await fetch(`/Thumbnails/${photo}`);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setProfBlobUrl(blobUrl);
        } else {
          const response = await fetch(`/img/logo.png`);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setProfBlobUrl(blobUrl);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    fetchProfile(video.Photo)
    fetchImage()
  }, [video,online])
  return (
    <>
      <div className="video1 flex flex-row w-full  justify-between md:px-6 mb-6 cursor-pointer ">
        <div className="flex flex-col m-0 md:flex-row h-[260px] md:h-[150px]    bg-gray-100 space/-x-1 md:space-x-5 w-[100%] md:w-[80%] md:rounded-2xl  ">
          <div className="  w-full w-[1/20px] md:w-[250px] h-[210px] md:h-[130px] md:h-[150px] md:rounded-2xl   overflow-hidden">

            {
                <Link href={`/Watch?v=${video.uniid}`}>
                  <Image width={100} height={100} src={imageBlobUrl} className="w-full h-full object-cover" alt="profil" />
                </Link>
            }

          </div>
          <div className="flex flex-col">
            <h1 className="font-semibold text-[1rem] md:text-[1.5rem]">{video.name}</h1>
            <p className="text-sm md:text-base">{video.Body.split('\n').slice(0, 2).join('\n')}</p>
            <Link href={`/profile?c=${video.Uuid}`}>
              <div className="description flex items-center  text-sm">
                <Image width={80} height={80} alt='profile' className="lg:w-10 w-8 lg:h-10 h-8 my-1 ml-15 rounded-full " src={`${process.env.NEXT_PUBLIC_URL}/Thumbnails/${video.Photo}`} />
                <p className="nom ml-2" >{video.page}</p>
              </div>
            </Link>
          </div>

        </div>

      </div>
    </>
  )
}

export default Cached