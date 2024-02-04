import Link from 'next/link'
import Image from "next/image";
import {useState,useEffect} from 'react'

function OneVideo({video,handleClick}) {

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
            <div className="videocontainer ">
            <div className="imag w-[270px] h-[170px] rounded  overflow-hidden">
            <Link onClick={() => handleClick(video.uniid)} href={`/dashboard/video?w=${video.uniid}`}>
                    <Image  src={imageBlobUrl}  width={100} height={100} className="w-[100%]  h-[100%] object-cover" alt=""/>
            </Link>
            </div>

            <Link href="">
                <div className="flex space-x-1 justify-start mb-4">
                    {
                        profBlobUrl ? <Image width={100} height={100} src={profBlobUrl}  className="lg:w-9 w-9 lg:h-9 h-9 my-1 ml-15 rounded-full " alt="profil"/>:
                        <Image width={100} height={100} alt="" className="lg:w-9 w-9 lg:h-9 h-9 my-1 ml-15 rounded-full " src="/img/logo.png"/>
                    }
                    <div className="flex flex-col  space-y-2">
                        <div className="right-1">
                            <h10 className="text-sm font-medium"> {video.Title} </h10>
                            <span className="text-sm mt-2"> {video.Nom} </span>
                        </div>
                    </div>
                </div>
            </Link>

        </div>

        </>
    )
}
   
export default OneVideo;