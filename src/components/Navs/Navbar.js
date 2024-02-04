import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import Sidebar from './Sidebar'
import { SessionContext } from '../context/Auth'
import { useRouter } from 'next/router'
import Image from 'next/image'
import SearchDrop from './SearchDrop'
import SmDrop from './smDrop'
import AcountPop from './AcountPop'
import { useRef } from 'react';
import LinearIndeterminate from '../Bar'
import { formatDistanceToNow, parseISO } from 'date-fns';

function Navbar(props) {
  const router = useRouter()
  const auto = useContext(SessionContext)
  const [searchd, setSearchd] = useState("")
  const [acPop, setAcPop] = useState(false)
  const [searches, setSearches] = useState()
  const [sideAll, setSideAll] = useState('active')
  const [smSearch, setSmSearch] = useState(false)
  const [notif_pop, setpop_notif] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifCounter, setNotifCounter] = useState(0);
  const [liste_notification, setliste] = useState([]);
  const [profBlobUrl, setProfBlobUrl] = useState('/img/logo.png');
  const [logo1, setLogo1] = useState('/logo/TeramaFlixpic.png')
  const [logo2, setLogo2] = useState('/logo/TeramaFlixnam.png')
  const [create, setCreate] = useState('/img/create_video.png')
  const compoRef = useRef(null);
  const sideBarRef = useRef(null);
  const notifRef = useRef(null);
  const SearchInput2Ref = useRef(null);
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


  const handleSideAll = () => {
    if (sideAll === 'active') {
      setSideAll('')
      props.sideAllOpened(true)
    }
    else {
      setSideAll('active')
      props.sideAllOpened(false)
    }

  }

  const handleAcPop = () => {
    setAcPop(acPop => !acPop);
  }

  const handleSmsearch = () => {
    setSmSearch(smSearch => !smSearch);
  }

  const fetchSearches = async (search) => {
    if (search !== '') {
      const response = await fetch('/api/results/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search: search, start: 0, limit: 10 }),
      });
      const data = await response.json()
      if (data[0]) {
        setSearches(data)
      }
    }
  }

  const handleSearch = (search) => {
    setSearchd(search)
    fetchSearches(search)
  }

  const handlegetSecrhed = () => {
    router.push(`/results?results=${searchd}`)
  }

  //evenement pour  cacher le box d'account en cliquant n'importe où dans le DOM
  const cacher_composant = (event) => {
    if (compoRef.current && !compoRef.current.contains(event.target)) {
      setAcPop(false);
    }
  };

  //evenement pour  cacher siderbar et floue en cliquant n'importe où dans le DOM
  const cacher_sideBarAll = (event) => {
    if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
      setSideAll('active');
      props.sideAllOpened(false);
    }
  };

  //evenement pour  cacher composant des notifications en cliquant n'importe où dans le DOM
  const cacher_Notifications = (event) => {
    if (notifRef.current && !notifRef.current.contains(event.target)) {
      setIsNotificationOpen(false);
    }
  };

  //evenement pour  cacher composant searchInput2 en cliquant n'importe où dans le DOM
  const cacher_searchInput2 = (event) => {
    if (SearchInput2Ref.current && !SearchInput2Ref.current.contains(event.target)) {
      setSmSearch(false);
    }
  };
  useEffect(() => {
    if(online){
    const fetchLogos = async () => {
      try {
        const resp1 = await fetch('/logo/TeramaFlixpic.png');
        const resp2 = await fetch('/logo/TeramaFlixnam.png');
        const respc = await fetch('/img/create_video.png');
        const blob1 = await resp1.blob();
        const blob2 = await resp2.blob();
        const blobc = await respc.blob();
        setLogo1(URL.createObjectURL(blob1))
        setLogo2(URL.createObjectURL(blob2))
        setCreate(URL.createObjectURL(blobc))
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    fetchLogos()
    const fetchProfile = async (photo) => {
      try {
        if (photo) {
          const response = await fetch(`/Thumbnails/${photo}`);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setProfBlobUrl(blobUrl);
        } else {
          const response = await fetch(`/img/logo.png`);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setProfBlobUrl(blobUrl);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    if (auto.session) {
      fetchProfile(auto.session.Photo)
    }
  }
  }, [auto])

  useEffect(() => {
    if(online){
      const available_notifications = async () => {
        if(auto.session)
        {
          try {
           const response = await fetch(`/api/notifications/${auto.session.ID}`);
           if (response.ok) {
             const data = await response.json();
             setliste(data);
           }
         } catch (error) {
           console.log("Error => " + error);
         }
        }
         
       };
       available_notifications();
       const interval = setInterval(() => {
         available_notifications();
         fetchNotifications()
       }, 60000);
       return () => clearInterval(interval);
    }
    
  }, [auto]);

  //useEffect pour cacher le box d'account en cliquant n'importe où dans le DOM
  useEffect(() => {
    document.addEventListener('click', cacher_composant);

    return () => {
      document.removeEventListener('click', cacher_composant);
    };
  }, []);
  //useEffect pour  cacher siderbar et floue en cliquant n'importe où dans le DOM
  useEffect(() => {
    document.addEventListener('click', cacher_sideBarAll);

    return () => {
      document.removeEventListener('click', cacher_sideBarAll);
    };
  }, []);

  //useEffect pour  pour  cacher composant des notifications en cliquant n'importe où dans le DOM
  useEffect(() => {
    document.addEventListener('click', cacher_Notifications);

    return () => {
      document.removeEventListener('click', cacher_Notifications);
    };
  }, []);

  //useEffect pour  pour  cacher composant searchInput2 en cliquant n'importe où dans le DOM
  useEffect(() => {
    document.addEventListener('click', cacher_searchInput2);

    return () => {
      document.removeEventListener('click', cacher_searchInput2);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/countNotification/${auto.session.ID}`);
      if (response.ok) {
        const data = await response.json();
        setNotifCounter(data.length);
      }
    } catch (error) {
      console.log("Error => " + error);
    }
  }
  const viewed_notification = async () => {
    try {
      await fetch(`/api/showNotifications/${auto.session.ID}`);
    } catch (error) {
      console.log("Error => " + error);
    }
  };

  const handleNotificationClick = () => {
    if (isNotificationOpen) {
      setIsNotificationOpen(false);
    } else {
      setIsNotificationOpen(true);
      viewed_notification()
    }
  };

  return (
    <>
      <header className=" relative h-[60px] z-1" >
        <div className="headercontainer shadow-lg  lg:pl-2  w-[100%] bg-white fixed right-0 lef-0 top-0 z-20 ">
          <LinearIndeterminate />
          <nav className="flex sm:flex-row  max-h-16 sm:sticky sm:top-0 flex-row sm:items-center sm:justify-between items-center justify-between     pb-2   ">
            <div className="flex   flex-row justify-center items-center  w-[40%] md:w-[30%] lg:w-[20%] relative  overflow-hidden ">

              <div ref={sideBarRef} onClick={handleSideAll} className="menuCloser cursor-pointer z-50 abso/lute lef/t-0 sm:static absolute left-1 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 md:w-10 md:h-10 font-bold text-purple-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </div>

              <div className="logo ml-4 flex-initial flex flex-col sm:flex-row sm:items-center sm:justify-start w-10 h-11 sm:w-64 sm:h-full items-center justify-center sm:static ml-/10 ">
                <Link href="/"> <Image width={80} height={80} src={logo1} className=" w-8 h-8 sm:w-[2.8rem] sm:h-[2.8rem] my-1" alt="logo" /></Link>
                <Link href="/"> <Image width={90} height={90} src={logo2} alt="logo" className=" hidden sm:block w-[4rem] h-[1rem] sm:w-[8rem] sm:h-[1rem] " /></Link>
              </div>

            </div>
            <div className="searche-here searchDiv sm:flex flex-1  sm:justify-center sm:items-center lg:w-64 lg:h-full max-w-max items-center justify-center mr-6 p-0">
              <input id="search" type="search"
                className=" min-w-min h-9 border-none ring-2 ring-blue-500  rounded-l-full pl-3 pr-5 hidden md:block focus:outline-none "
                placeholder="Search here..."
                name="search"
                onChange={(e) => handleSearch(e.target.value)}
                value={searchd} />
              <button id="searchBtn" className=" md:bg-blue-500 h-10 md:hover:bg-blue-900 duration-1000  md:px-4 md:py-2   font-semibold   md:rounded-r-full md:rounded-l-none text-black md:text-white items-center justify-center hidden md:block ">
                <svg onClick={handlegetSecrhed} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path strokeLinejoin="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {!auto.session || auto.session === "unlogged" ?

              <div className="buttons  flex flex-initial sm:flex sm:items-center sm:justify-end items-center justify-end mr-4 w-full sm:w-64 h-full   ">
                <Link href='/login' className="bg-blue-500 text-white text-sm md: font-medium rounded-md  md:px-3 px-2 md:py-2 py-1 flex items-center justify-center hover:bg-blue-600">Login</Link>
              </div>
              :
              <div className="buttons  flex flex-initial sm:flex space-x-3 sm:items-center sm:justify-center items-center justify-center w-full sm:w-64 h-full   ">
                <button ref={SearchInput2Ref} onClick={handleSmsearch} id="searchBtn" className=" hover:bg-gray-200 hover:rounded-full w-10 h-10 md:hidden block">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
                <Link href='/upload'>
                  <button id="image" className="hover:bg-gray-200 flex rounded-full items-center p-1 lg:w-10 lg:h-10 md:w-8 md:h-6 w-8 h-8">
                    <Image width={80} height={80} className="lg:w-full lg:h-full w-full  h-full   my-1 ml-15 "
                      src={create} alt="create_video" />
                  </button>
                </Link>

                <button ref={notifRef} className="p-0 ml-4">
                  <div className="hover:bg-gray-200 rounded-full w-11 h-11 relative">
                    <svg onClick={handleNotificationClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="w-full h-full ">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    {notifCounter > 0 && (
                      <span className="absolute top-2 right-[8%] flex justify-center items-center   bg-red-500 text-white w-fit p-1 h-4  rounded-full text-[80%]">
                        {notifCounter}
                      </span>
                    )}
                  </div>
                </button>

                <button ref={compoRef} id="image" className="p-0">
                  <Image width={80} height={80} className="w-8 h-8 rounded-full" title={`${auto.session.PageName}`}
                    src={profBlobUrl} alt='profile' onClick={() => handleAcPop()} />
                </button>
              </div>
            }

          </nav>
        </div>
      </header>


      {isNotificationOpen && (
        <div
          id="setNotification"
          className="absolute right-4 lg:fixed top-10 z-10 mt-4 w-[14rem] h-[16rem] sm:w-[18rem]  lg:h-[27rem]  overflow-y-auto origin-top-right rounded-md bg-white sm:right-12 lg:right-12"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <div className="notificationList w-full  grid grid-cols-1">
            {liste_notification.map((notification) => (
              <div key={notification.id} className=''>
                <Link href="" >
                  <div className="flex justify-center space-x-1  hover:bg-gray-300 mx-1 mt-4 rounded-sm">
                    <div className="w-[2.5rem] h-[2.5] sm:w-[3.5rem] sm:h-[3.5rem] mt-2 rounded-full">
                      {
                        notification.photo ?
                          <Image width={80} height={80}
                            className="w-[2.5rem] h-[2.5] sm:w-[3.5rem] sm:h-[3.5rem] rounded-full"
                            src={`/Thumbnails/${notification.photo}`}
                            alt='notice' />
                          :
                          <Image width={80} height={80}
                            className="w-[2.5rem] h-[2.5] sm:w-[3.5rem] sm:h-[3.5rem] rounded-full"
                            src={`/logo/player.jpg`}
                            alt='notice' />
                      }
                    </div>
                    <div className="flex-col w-[11rem] sm:w-[14rem] max-h-[6.8rem] ">
                      {
                        notification.typenotif === "subscribe" &&
                        <p className="text-sm font-medium text-gray-900 line-clamp-3 p-1">
                          <span className='text-md font-bold mx-1'>{notification.Prenom} </span>
                          subscribed to your channel
                        </p>
                      }
                      {
                        notification.typenotif === "like" &&
                        <Link href={`/Watch?v=${notification.uniid}`}>
                          <p className="text-sm font-medium text-gray-900 line-clamp-3 p-1">
                            <span className='text-md font-bold mx-1'>{notification.Prenom} </span>
                            liked  your video {notification.title}
                          </p>
                        </Link>
                      }
                      {
                        notification.typenotif === "comment" &&
                        <Link href={`/Watch?v=${notification.uniid}`}>
                          <p className="text-sm font-medium text-gray-900 line-clamp-3 p-1">
                            <span className='text-md font-bold mx-1'>{notification.Prenom} </span>
                            commented  your video <span className='text-xs p-1 font-bold'>{notification.title}</span>
                          </p>
                        </Link>
                      }
                      <span className='text-md p-1 font-bold'>{formatDistanceToNow(parseISO(notification.delay))} ago</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}



            {/* {liste_notification.map((notification) => (
                  <li key={notification.id} className="pt-3 pb-0 sm:pt-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Image width={80} height={80} 
                          className="w-10 h-10 rounded-full" 
                          src={notification.photo ? `/Thumbnails/${notification.photo}` : `/img/notify.png`}
                          alt='notice'/>
                        
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                           {notification.Prenom}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {notification.typenotif !== "subscribe" &&
                            notification.postid && (
                              <>
                                Reacted to your <Link href={"/"}> post </Link>
                              </>
                            )}
                          {notification.typenotif == "subscribe" &&
                            "Subscribed to your channel"}
                        </p>
                      </div>
                    </div>
                  </li>
                ))} */}
          </div>


        </div>
      )}

      {smSearch ?
        <div className="searche-here Searchinput2 transition-all bg-blue-500 px-2 top-14 left-9  sm:top-16 sm:left-[4.5rem]  md:top-14 md:hidden  z-50 fixed w-[80%] rounded-md h-12 flex flex-row space-x-2 items-center  overflow-hidden">
          <input type="search"
            className=" w-full h-full border-none ring-2 focus:outline-none ring-blue-500  pl-3 pr-5"
            placeholder="search here ..."
            onChange={(e) => handleSearch(e.target.value)}
            value={searchd}
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>

        </div> : null
      }
      <div id="setNotification" className="absolute right-0 lg:fixed top-10 z-30 mt-4 hidden w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:right-0 lg:right-0" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
        <div className="notificationList py-1 w-full" role="none">
          <div className="flex flex-row items-center hover:bg-gray-300 hover:border-1 hover:border-gray-400 justify-start px-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
            </svg>
            <Link href={`/results?results=${searchd}`} className="block px-2 py-2 text-sm text-gray-700" id="menu-item-1">Settings & Leonce </Link>
          </div>
        </div>
      </div>

      <div id="searchedprop" className=" z-20 left-[40%] mt-14 w-[20%] sm:top-0 fixed  h-auto  overflow-hide bg-blue-100 rounded-md"></div>
      <div id="setting" style={{ display: "flex", marginRight: 70 + "px", background: "black" }}>
      </div>

      <Sidebar sideAll={sideAll} />
      {acPop ? <AcountPop auto={auto.session} /> : null}
      {searchd == "" ? null :
        <>
          <SearchDrop searches={searches} searched={searchd} />
          <SmDrop searches={searches} searched={searchd} />
        </>
      }
    </>
  )
}
export default Navbar


