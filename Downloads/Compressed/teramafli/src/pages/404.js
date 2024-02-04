// Importez les composants nécessaires
import Title from '@/components/Title';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function NotFound() {
  const [logo, setLogo] = useState('/logo/TeramaFlixpic.png')
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const resp = await fetch('/logo/TeramaFlixpic.png');
        const blob = await resp.blob();
        setLogo(URL.createObjectURL(blob))
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    fetchLogos()
  }, [])
  return (
    <>
      <Title title="404 Not Found" />
      <div className="bg-gradient-to-br from-teal-500 via-indigo-500 to-purple-500 text-white h-screen flex items-center justify-center">
        <div className="mx-2 grid grid-cols-1 place-items-center rounded-md w-[22rem] md:w-[28rem]  lg:w-[32rem] h-[24rem] bg-white shadow-md">
          <div className="flex items-center space-x-6">
            <div className='w-[7rem] h-[7rem] md:w-[9rem] md:h-[9rem] lg:w-[10rem] lg:h-[10rem] mx-auto rounded-full'>
                  <Image src={logo} width={280} height={280} alt="logo" className="w-[7rem] h-[7rem] md:w-[9rem] md:h-[9rem] lg:w-[10rem] lg:h-[10rem]" />
            </div>
            <h1 className="text-6xl font-bold text-indigo-800">404</h1>
          </div>
          <div>
           <p className="text-lg text-black font-semibold mx-4">Oops! It seems like you &apos; ve entered a wrong galaxy.</p>
          </div>
          <Link href="/" >
            <div className='flex items-center w-[8rem] rounded-md hover:bg-blue-300 bg-blue-400 justify-center'>
              <span className="text-purple-600 hover:text-purple-700 text-md font-semibold py-3">Go Back Home</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotFound;

NotFound.getLayout = function pageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}
