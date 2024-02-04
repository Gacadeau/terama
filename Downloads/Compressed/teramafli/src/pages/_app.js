import '@/styles/globals.css'
import '@/styles/Player.css'
import '@/styles/Short.css'
import '@/styles/Admin.css'
import '@/styles/swiper.css'
import '@/styles/controls.css'
import '@/styles/fonts.css'
import { SessionProvider } from '@/components/context/Auth'
import Navbar from '@/components/Navs/Navbar'
import Messagerie from '@/components/Messages/Messagerie'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react'
import { LoadProvider } from '@/components/context/loading'
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import Load from '@/components/Load'

export default function App({ Component, pageProps }) {
  const [blur, setBlur] = useState(false)
  const [load, setLoad] = useState(true)
  const [online, setOnline] = useState(true);
  const router = useRouter();
  
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

//useEffect(() => {
  
//  if(!online){
//    router.push('/downloads');
// }
// else{
//    console.log('you are online');
//  }
//},[online]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      setLoad(true)
    };

    const handleRouteStart = (url) => {
      setLoad(false)
    };

    const handleRouteEnd = (url) => {
      setLoad(true)
    };

    router.events.on('routeChangeStart', handleRouteStart);
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeError', handleRouteEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeError', handleRouteEnd);
    };
  }, [router.events]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          })
          .catch(err => {
            console.log('Service Worker registration failed: ', err);
          });
      });
    }


  }, []);

  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />)
  }

  const sideAllOpened = (state) => {
    setBlur(state)
  }
  return (
    <SessionProvider>
      <LoadProvider>
        <div className="font-quicksand">
          <div className="wrapper relative w-full h-full bg-gray-100   pt-1 overflow-x-hidden ">
            <Navbar sideAllOpened={sideAllOpened} />
            <div className={`Acceuilcontainer ${blur ? 'blur' : {}}  w-full  justify-center items-center  bg-gray-100 flex flex-col h-full `}>
              <div className={`container w-[100%] h-[100%] lg:px-6    bg-white lg:p-4 lg:rounded  flex flex-col justify-center`}>
                <Component {...pageProps} />
                <Messagerie />
              </div>
            </div>
          </div>
        </div>
        <Load load={load} />
        <ToastContainer />
      </LoadProvider>
    </SessionProvider>
  )
}
