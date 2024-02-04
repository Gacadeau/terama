import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePeriod } from '../Hooks/usePeriod'
import Image from 'next/image'
function OtherVideo({ video }) {
  const period = usePeriod(video.Created_at)
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
    fetchImage()

  }, [video])
  return (
    <>
      <div id="items " className="flex flex-col">
        <div className="imag md:w-[270px] w-full md:h-[170px]  h-[200px] rounded  overflow-hidden">
          {
            video.Short == 1 ?
              <Link href={`/short`}>
                <Image width={100} height={100} src={imageBlobUrl} className="w-[100%]  h-[100%] object-cover" alt="fisrt video" />
              </Link>
              :
              <Link href={`/Watch?v=${video.uniid}`}>
                <Image width={100} height={100} src={imageBlobUrl} className="w-[100%]  h-[100%] object-cover" alt="fisrt video" />
              </Link>
          }
        </div>
        <div className="ggg sm:w-45 lg:w-53 details bg-gray-200 text-gray-700 relative bottom-2  flex flex-col rounded-b-xl">
          <div className="flex justify-center"><h3 className=" h-8 overflow-hidden py-2 text-base ">{video.Title}</h3></div>
          <div className="flex flex-row justify-between p-1 px-4 pb-3">
            <span className=" text-xs ">{video.Views} vues</span>
            <span className=" text-xs" >{period}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default OtherVideo