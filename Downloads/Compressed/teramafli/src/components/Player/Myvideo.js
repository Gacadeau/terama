import React from 'react'
import styles from '@/styles/Player.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { usePeriod } from '../Hooks/usePeriod'
function Myvideo({ video }) {
  const period = usePeriod(video.Created_at)
  return (
    <>
      <div className={`${styles.videocontainer}`}>
        <div className="imag md:w-[270px] w-full md:h-[170px]  h-[200px] rounded  overflow-hidden ">
          {
            video.Short == 1 ?
              <Link href={`/short`}>
                <Image src={`${process.env.NEXT_PUBLIC_URL}/Thumbnails/${video.Image}`}
                  width={800} height={800}
                  className="w-[100%]  h-[100%] object-fit" alt="videos"
                  priority={true} placeholder='blur'
                  blurDataURL="data:image/png;base64,...(base64-encoded image data)" />
              </Link>
              :
              <Link href={`/Watch?v=${video.uniid}`}>
                <Image src={`${process.env.NEXT_PUBLIC_URL}/Thumbnails/${video.Image}`}
                  width={800} height={800} alt='video'
                  className="video w-[100%]  h-[100%] object-fit"
                  priority={true} placeholder='blur'
                  blurDataURL="data:image/png;base64,...(base64-encoded image data)" />
              </Link>
          }
        </div>
        <Link href={`/profile?c=${video.uniid}`}>
          <div className="videoName font-semibold lg:text-[18px] text-[18px]">{video.Title}</div>
          <div className="profilChannel  flex justify-start items-center space-x-2  cursor-pointer ">
            {
              video.Photo ?
                <Image width={500} height={500} alt='profile'
                  className=" w-10  h-10 my-1 ml-15 rounded-full "
                  src={`${process.env.NEXT_PUBLIC_URL}/Thumbnails/${video.Photo}`}
                  priority={true} placeholder='blur'
                  blurDataURL="data:image/png;base64,...(base64-encoded image data)" />
                :
                <Image width={500} height={500} alt='profile'
                  className=" w-10  h-10 my-1 ml-15 rounded-full "
                  src={`/img/logo.png`}
                  priority={true} placeholder='blur'
                  blurDataURL="data:image/png;base64,...(base64-encoded image data)" />
            }
            <div className="flex flex-col  space-y-2">
              <div className="right-5">
                <div className="text-md text-slate-900 opacity-90  font-bold">{video.PageName}</div>
                <span className="text-xs text-slate-900 opacity-70 font-semibold">{video.Views} Views  {period}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  )
}

export default Myvideo