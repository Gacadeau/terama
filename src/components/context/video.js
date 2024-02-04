import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { SessionContext } from './Auth';
const VideoContext = React.createContext();

function VideoProvider(props) {
  const auto = useContext(SessionContext)
  const router = useRouter()
  const [video, setVideo] = useState(null);
  const [online, setOnline] = useState(true);

  useEffect(()=>{
    const handleOnlineStatusChange = () =>{
      setOnline(navigator.onLine);
    };

    window.addEventListener('online',handleOnlineStatusChange);
    window.addEventListener('offline',handleOnlineStatusChange);
    setOnline(navigator.onLine);
    return () =>{
      window.removeEventListener('online' ,handleOnlineStatusChange);
      window.removeEventListener('offline',handleOnlineStatusChange);
    }

  },[]);

  useEffect(() => {
    async function fetchData(post, user) {
      if(online){
        const response = await fetch(`/api/posts/watch/${post}/0/${user}`);
        const data = await response.json();
        if (data[0]) setVideo(data[0]);
      } 
    }
    if (router.query.v && auto.session) {
      if(auto.session === 'unlogged'){
        fetchData(router.query.v, 0)
      }else{
        fetchData(router.query.v, auto.session.ID)
      }
    }
    else{
      console.log('Go to  downloads videos!')
    }
  }, [router.query.v,auto,online]); // Ajout des dépendances router.query.v et auto.session

  return (
    <VideoContext.Provider
      value={{
        video,
      }}>
      {props.children}
    </VideoContext.Provider>
  );
}

export { VideoProvider, VideoContext };