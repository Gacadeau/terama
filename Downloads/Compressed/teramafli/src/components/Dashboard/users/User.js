import Link from 'next/link'
import React,{useState,useEffect} from 'react'
import Image from 'next/image'

function User({user}) {
    const [profBlobUrl, setProfBlobUrl] = useState('/img/logo.png');
    useEffect(() => {
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
      fetchProfile(user.Photo)
  
    }, [user])
  return (
    <>
      <Link href={`/dashboard/users?user=${user.uniid}`}>
        <div  className="user1 flex flex-row justify-between items-center px-6 mb-6 cursor-pointer">
            <div  className="flex flex-row items-center space-x-3">
                <div  className=" w-10 h-10 xl:w-12 xl:h-12 rounded-full overflow-hidden">
                  <Image width={100} height={100} src={profBlobUrl}  className="" alt="profile"/>
                </div>
                <div  className="flex flex-col">
                    <h1  className="font-semibold">{user.PageName} </h1>
                </div>
            </div>
        </div>
      </Link>
    </>
  )
}

export default User