import Link from 'next/link'
import React from 'react';
function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

function Upload({videos,handleRemoveUpload}) { 
  const deletePost = async (id,video,image) =>{
    const response = await fetch(`/api/posts/deletePost/${id}/${video}/${image}`)
    const data = await response.json()
    if(data.success){
      handleRemoveUpload(id)
    }
  }
  return (
    <>
      <div  className="video-list h-[150px] min-w-[40%] max-w-[100%] bg-gray-100 p-4 overflow-auto space-y-2">
        {
          videos?.map(video =>{
          return (
            <>
            <div key={video.ID} className="video1  flex flex-row justify-between items-center space-x-4 bg-gray-300 p-4 rounded">
              <Link  href={`/editvideo/${video.uniid}`} >
                <div className="flex flex-row items-end">
                  <span className="text-[1.2rem] font-semibold" style={{ whiteSpace: 'nowrap' }}>
                    {truncateText(video.Title, 25)}
                  </span>
                </div>
              </Link>
              <svg onClick={()=> deletePost(video.ID,video.video,video.Image)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  strokeWidth="1.5" stroke="currentColor"  className="remove-video hover:bg-blue-500 rounded-full w-5 h-5 cursor-pointer">
                <path  strokeLinecap="round"  strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </>
          )
          })
        }
      </div>

    </>
  )
}
export default Upload