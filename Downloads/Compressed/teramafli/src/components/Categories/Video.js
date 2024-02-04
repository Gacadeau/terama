import Image from 'next/image'
import Link from 'next/link'
import React,{useState,useEffect} from 'react'

function Video({video}) {
    const [imageBlobUrl, setImageBlobUrl] = useState('/img/thumb.jpg');
  const [profBlobUrl, setProfBlobUrl] = useState('/img/logo.png');
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/Thumbnails/${video.Image}`);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setImageBlobUrl(blobUrl);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    const fetchProfile = async (photo) => {
      try {
        if(photo){
          const response = await fetch(`/Thumbnails/${photo}`);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setProfBlobUrl(blobUrl);
        }else{
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
  }, [video])
  return (
    <>
        <div className=" ">
            <div className="imag w-[100%] h-[170px] rounded  overflow-hidden">
                <Link href={`/Watch?v=${video.uniid} `}>
                    <Image  src={imageBlobUrl} width={100} height={100} className="w-[100%]  h-[100%] object-cover" alt="Thumbnail de la vidéo"/>
                </Link>
            </div>
            <Link href={`/profile?c=${video.Uuid}`}>
                <div className="flex space-x-1 justify-start mb-4">
                    <Image  width={100} height={100} className="lg:w-9 w-9 lg:h-9 h-9 my-1 ml-15 rounded-full " src={profBlobUrl} alt="Photo de profil de l'utilisateur"/>
                <div className="flex flex-col  space-y-2">
                    <div className="right-1">
                        <h10 className="text-sm font-medium">{video.Title}</h10><br/>
                        <span className="text-sm">{video.PageName}</span>
                    </div>
                </div>
                </div>
            </Link>
        </div>
    </>
  )
}

export default Video