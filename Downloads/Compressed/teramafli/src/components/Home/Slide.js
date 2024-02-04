import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
function Slide({video}) {
  return (
    <>
    <div className='flex justify-center'>
        <div className="swiper-slide ">
        <div className="">
            <div className="imag sm:h-[170px] h-[250px] rounded overflow-hidden  ">
              <Link href={`/Watch?v=${video.uniid}`}>
                  <Image src={`${process.env.NEXT_PUBLIC_URL}/Thumbnails/${video.Image}`} 
                  width={800} height={800} alt='video' 
                  className="video w-[100%]  h-[100%] object-fit"
                  priority={true} placeholder='blur'
                  blurDataURL="data:image/png;base64,...(base64-encoded image data)"/>
              </Link>
            </div>
            <p className="font-bold text-slate-900 text-md ">{video.Title} </p>
            <Link href={`/profile?c=${video.Uuid}`}>
                <div className="flex  justify-start items-center space-x-2 mb-4">
                    {
                      video.Photo ? 
                      <Image width={500} height={500} alt='profile' 
                      className=" w-10  h-10 my-1 ml-15 rounded-full " 
                      src={`${process.env.NEXT_PUBLIC_URL}/Thumbnails/${video.Photo}`} 
                      priority={true} placeholder='blur'
                      blurDataURL="data:image/png;base64,...(base64-encoded image data)"/>
                      :
                      <Image width={500} height={500} alt='profile' 
                      className=" w-10  h-10 my-1 ml-15 rounded-full " 
                      src={`/img/logo.png`} priority={true} 
                      placeholder='blur'
                      blurDataURL="data:image/png;base64,...(base64-encoded image data)"/>
                    }
                <div className="flex flex-col  space-y-2">
                    <div className="right-1">
                        <h1 className="text-sm text-slate-900 opacity-80  font-semibold">{video.PageName}</h1><br/>
                    </div>
                </div>
                </div>
            </Link>
        </div>
      </div>
    </div>
    </>
  )
}

export default Slide