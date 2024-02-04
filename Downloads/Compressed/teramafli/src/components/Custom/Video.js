import Link from 'next/link'
import Image from 'next/image'
import React,{useState,useEffect} from 'react'
function Video({video,handleRemoveVideo}) {
    const deletePost = async (id,video,image) =>{
        const response = await fetch(`/api/posts/deletePost/${id}/${video}/${image}`)
        const data = await response.json()
        if(data.success){
          handleRemoveVideo(id)
        }
    }
    const [imageBlobUrl, setImageBlobUrl] = useState('/img/thumb.jpg');
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
    if(video.Image){fetchImage()}
  }, [video])
  return (
    <>
    {
        video.Image && (
            <div className="videocontainer w-[230px] h-[230px]  ">
            <div className="imag w-[100%] h-[70%] rounded  overflow-hidden">
                <Link href={`/details/post?v=${video.uniid}`}>
                    <Image src={imageBlobUrl} alt="photo9" width={150} height={150} className="w-[100%]  h-[100%] object-cover"/>
                </Link>
            </div>
            <Link href="">
                <div className="flex space-x-1 justify-start mb-0">
                    <div className="right-1">
                        <p className="text-sm font-medium">{video.Title}</p><br/>
                    </div>
                </div>
            </Link>
            <div className="btn-remove-edit flex justify-between">
            <button onClick={()=>deletePost(video.ID,video.Video,video.Image)} className="searchBtn bg-red-500 h-10 hover:bg-red-900 duration-1000  px-3 md:py-2 md:mr-6 text-sm md:text-base    rounded  text-white   ">
                remove
            </button>
            <Link href={`/editvideo/${video.uniid}`}>
                <button className="searchBtn bg-blue-500 h-10 hover:bg-blue-900 duration-1000  px-3 md:py-2 md:mr-6  text-sm md:text-base   rounded  text-white   ">
                edit
                </button>
            </Link>
            </div>
        </div>
        )
    }
        
    </>
  )
}

export default Video