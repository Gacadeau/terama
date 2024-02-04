import React, {useState,useContext,useEffect} from 'react'
import Video from './Video'
import PopAddVideo from './PopAddVideo'
import ProgressCircle from './ProgressCircle';
import Upload from './Uploads';
import { SessionContext } from '../context/Auth';
function UploadDrop() {
  const auth = useContext(SessionContext)
  const [addvid, setAddvid] = useState(false)
  const [auto, setAuto] = useState(12);
  const [isEmpty, setEmpty] = useState(true)
  const [percentage, setPercentage] = useState(false);
  const [videos, setVideos] = useState([])
  const [uploads, setUploads] = useState(null)
  const handleaddvid = (stat)=>{
      setAddvid(stat)
  }
  const fetchUploads = async () =>{
    const user = auth.session;
    const response = await fetch(`/api/posts/hidePosts/${user.ID}`)
    const data = await response.json()
    if(data.length == 0) {
    }
    else {
      setUploads(data)
    }
}
  useEffect(() => {
    if(auth.session){
      setAuto(auth.session)
      fetchUploads()
      const fetchVideos = async () =>{
            const user = auth.session
            const response = await fetch(`/api/posts/allPost/${user.ID}/0/25`)
            const data = await response.json()
            if(data.length == 0) {
              setEmpty(true)
            }
            else {
              setEmpty(false)
              setVideos(data)
            }
      }
      fetchVideos()
    }   
  }, [auth])
  const handleUpload = async (videos) => {
    setAddvid(false);
    setPercentage(true)
    const formData = new FormData();
    formData.append('user', auto.ID);
  
    for (let i = 0; i < videos.length; i++) {
      const fileSize = videos[i].size
      if (fileSize>18944000) {
        formData.append(`short`, 0);
      } else {
        formData.append(`short`, 1);
      }
      formData.append(`video${i}`, videos[i]);
    }
  
    const xhr = new XMLHttpRequest();
  
    // Suivre la progression
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        console.log(percentage)
      }
    });
  
    // Gestion de la fin de la requête
    xhr.onload = () => {
      if (xhr.status === 200) {
        // La requête a réussi
        const responseData = JSON.parse(xhr.responseText);
        if(responseData.success){
          fetchUploads()
          setPercentage(false)
        }
      } else {
        // La requête a échoué
        console.error('Erreur lors de l\'envoi des vidéos');
      }
    };
  
    // Gestion des erreurs pendant la requête
    xhr.onerror = () => {
      console.error('Erreur réseau lors de la requête');
    };
  
    // Ouvrir et envoyer la requête
    xhr.open('POST', '/api/upload', true);
    xhr.send(formData);
  };
  

  const handleRemoveVideo = (videoId)=>{
    const newVideos = videos.filter(item=>item.ID !== videoId)
    setVideos(newVideos)
  }
  const handleRemoveUpload = (videoId)=>{
    const newUploads = uploads.filter(item=>item.ID !== videoId)
    if(newUploads.length === 0){
      setUploads(null)
    }else{
      setUploads(newUploads)
    }
  }

  return (
    <>
       <div className="vidManager flex flex-row justify-between">
          <h2 className="text-[1.5rem] font-semibold">Video Manager</h2>
          <button onClick={()=>handleaddvid(true)} className="addVid flex flex-row justify-center items-center bg-blue-500 h-10 hover:bg-blue-900 duration-1000  px-4 md:py-2 md:mr-6 mt-2 text-sm md:text-base font-semibold   rounded-l-full rounded-r-none  text-white  ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path strokeLinejoin="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>                  
            <span className="btn-add-video">Add video</span> 
          </button>
        </div>
          <div className="  w-full flex flex-col relative min-h-[500px]"> 
            {
              addvid ?
              <>
              <div className="filmcontainer flex flex-wrap  blur mt-3 gap-[1rem]">
              {isEmpty ? <h2 className="text-[1.5rem] font-semibold">Upload Videos Here !! </h2> : null}
              {
                videos?.map(video => (
                  <Video key={video.ID} video={video} handleRemoveVideo={handleRemoveVideo} />
                ))
              }
              </div>
              <PopAddVideo handleaddvid={handleaddvid} handleUpload={handleUpload} />
              </>
              :
              <div className="filmcontainer flex flex-wrap mt-3 gap-[1rem]">
                {isEmpty ? <h2 className="text-[1.5rem] font-semibold">Upload Videos Here !! </h2> : null}
                {
                  videos?.map(video=>{
                    return <Video key={video.ID} video={video} handleRemoveVideo={handleRemoveVideo}/>
                  })
                }
              </div>
            }
            
              <div className='w-[100%] flex justify-end'>
              {
               percentage && (<ProgressCircle percentage={percentage} />)
              }
              {
              uploads ? 
              <Upload key={uploads.ID} videos={uploads} handleRemoveUpload={handleRemoveUpload} />
              :
               null
              }
               
              </div>
            
          
        </div>
    </>
  )
}

export default UploadDrop