import Title from '../Title';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Menu, Item, Separator, useContextMenu, Submenu } from 'react-contexify'
import { useRouter } from 'next/router';
import { SessionContext } from '../context/Auth';
import "react-contexify/dist/ReactContexify.css";

const MENU_ID = "menu-id";
function Watching({ videoprops }) {
  const auth = useContext(SessionContext)
  const router = useRouter()
  const videoRef = useRef(null);
  const timelineRef = useRef(null);
  let isCPressed = false;
  const videoContainerRef = useRef(null);
  const [hideCntrl, setHideCntrl] = useState('hidden')
  const [hideBtn, setHideBtn] = useState('')
  const [videoBlobUrl, setVideoBlobUrl] = useState('');
  const [paused, setPaused] = useState("paused")
  const [volumeLevel, setVolumeLevel] = useState("high")
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaybackSpeedMenu, setShowPlaybackSpeedMenu] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState("1")
  const [screen, setScreen] = useState("")
  const [isReady, setIsReady] = useState(false);
  const { show } = useContextMenu({ id: MENU_ID });


  //handle play or pause video
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused && isReady) {
        videoRef.current.play();
        setPaused('');
      } else {
        videoRef.current.pause();
        setPaused('paused');
      }
      setHideBtn('')
      setTimeout(() => {
        setHideBtn('hidden')
      }, 2000);
    }
  };

  // handle mute video
  const toggleMute = () => {
    if (videoRef.current) {
      if (videoRef.current.muted) {
        setVolume(1)
        setVolumeLevel("high")
        videoRef.current.muted = false;
      } else {
        setVolume(0)
        setVolumeLevel("muted")
        videoRef.current.muted = true;
      }
    }
  };
  // change volume 
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  //toggle Playback Speed Menu
  const togglePlaybackSpeedMenu = () => {
    setShowPlaybackSpeedMenu(!showPlaybackSpeedMenu)
  }
  //handle set Playback Speed Value
  const setPlaybackSpeedValue = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowPlaybackSpeedMenu(false);
    }
  }

  // handle set full screen mode
  const handleFullScreen = () => {
    const videoContainer = document.querySelector('.video-container'); // Sélectionnez la classe qui contient votre vidéo

    if (videoContainer) {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        setScreen("")
      } else {
        if (videoContainer.requestFullscreen) {
          videoContainer.requestFullscreen();
        } else if (videoContainer.mozRequestFullScreen) {
          videoContainer.mozRequestFullScreen();
        } else if (videoContainer.webkitRequestFullscreen) {
          videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
          videoContainer.msRequestFullscreen();
        }
        setScreen("full-screen")
      }
    }
  };

  //handle set picture In Picture Element
  const togglePictureInPicture = () => {
    const videoElement = document.querySelector('video');

    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      if (videoElement) {
        videoElement.requestPictureInPicture();
      }
    }
  };

  const handleNext = (next) => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
    router.push(`/Watch?v=${next}`)
  }

  //show or hide controls
  const handleHideCtrl = (state) => {
    setHideCntrl(state)
  }
  //handle update time format
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // handle set Contexte menu 
  function handleItemClick({ event, props, triggerEvent, data }) {
    console.log(event, props, triggerEvent, data);
  }
  function displayMenu(e) {
    // put whatever custom logic you need
    // you can even decide to not display the Menu
    show({
      event: e,
    });
  }
  const handlePrevious = () => {
    router.back();
  }
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(videoUrl)
      .then(() => { })
      .catch(err => { });
  };
  //handle update time



  useEffect(() => {
    const video = videoRef.current
    const handleCanPlay = () => {
      console.log('isReady')
      setIsReady(true);
    };
    const handleProgress = () => {
      const { buffered, duration } = video;
      if (buffered.length) {
        const loaded = buffered.end(0);
        const fraction = loaded / duration;
        console.log(loaded, duration, fraction)
      }
    };
    const handleError = () => {
      console.log("Error !")
    };

    const updateTime = () => {
      if (videoRef.current && !isNaN(videoRef.current.duration) && !isNaN(videoRef.current.currentTime)) {
        setCurrentTime(videoRef.current.currentTime);
        setDuration(videoRef.current.duration);
        const percent = videoRef.current.currentTime / videoRef.current.duration;
        timelineRef.current.style.setProperty("--progress-position", percent);
      }
    };

    if (video) {
      video.addEventListener("timeupdate", updateTime);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('progress', handleProgress);
      video.addEventListener('error', handleError);
    }
    let count = 0;
    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current !== null) {
        if (!videoRef.current.paused) {
          count++;
        }
      }
    }, 1250);

    const handleRouteChange = (url, { shallow }) => {
      if (!shallow) {
        console.log("Hello world", count);
      }
    };
    router.beforePopState();
    router.events.on("routeChangeStart", handleRouteChange);
    if (auth.session) {
      //views and hours 
      if (auth.session && auth.session != "unlogged") {
        const handleAddHours = async () => {
          setVideoBlobUrl('')
          const user = auth.session
          const time = count // Récupérer le temps écoulé réel de la vidéo
          const hours = time / 3600; // Conversion en heures
          const response = await fetch(`/api/reactions/addHours/${videoprops.ID}/${user.ID}/${hours.toFixed(4)}`);
          const data = await response.json();
          updateTime()
          if (data) {

          }
        };
        async function insertViews() {
          const user = auth.session
          const timerId = setTimeout(async () => {  // Ajoutez le mot-clé "async" ici
            const response = await fetch(`/api/reactions/addViews/${videoprops.ID}/${user.ID}`);
            const data = await response.json();
          }, 5000);
        }
        insertViews()

        const handleRouteChange = (url, { shallow }) => {
          if (!shallow) {
            handleAddHours();
          }
        };
        router.beforePopState(handleAddHours);
        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
          router.events.off('routeChangeStart', handleRouteChange);
        };
      }
    }





    const handleKeyPress = (event) => {
      const video = videoRef.current;
      if (video) {
        if (document.activeElement.classList[0] !== "react-input-emoji--input" && document.activeElement.classList[0] !== "searche-here") {
          switch (event.key) {
            case "ArrowRight":
              event.preventDefault()
              video.currentTime += 5; // Avance de 5 secondes
              break;
            case "ArrowLeft":
              event.preventDefault()
              video.currentTime -= 5; // Recule de 5 secondes
              break;
            case "ArrowUp":
              event.preventDefault()
              if (video.volume < 1.0) {
                video.volume = parseFloat((video.volume + 0.1).toFixed(1)); // Augmente le volume par incréments de 0.1
                setVolume(video.volume)
                setVolumeLevel("high")
                if (video.volume <= 0.2) {
                  setVolume(video.volume)
                  setVolumeLevel("low")
                }
              } else if (video.volume === 1.0) {
                setVolume(video.volume)
                setVolumeLevel("high")
              }
              break;
            case "ArrowDown":
              event.preventDefault()
              if (video.volume > 0.0) {
                video.volume = parseFloat((video.volume - 0.1).toFixed(1)); // Diminue le volume par incréments de 0.1
                setVolume(video.volume)
                setVolumeLevel("high")
                if (video.volume <= 0.2) {
                  setVolume(video.volume)
                  setVolumeLevel("low")
                }
              } else if (video.volume === 0.0) {
                setVolume(0)
                setVolumeLevel("muted")
                videoRef.current.muted = true;
              }
              break;

            case "f":
              handleFullScreen()
              break;
            case "m":
              toggleMute()
              break;
            case "+":
              if (video.playbackRate < 2.0) {
                setPlaybackSpeedValue(video.playbackRate + 0.25);
              }
              break;
            case "-":
              if (video.playbackRate > 0.5) {
                setPlaybackSpeedValue(video.playbackRate - 0.25)
              }
              break;
            case "c":
              if (!isCPressed) {
                video.currentTime = 0;
                togglePlay()
                isCPressed = true;
              }
              break;
            case " ":
            case "k": // Espace pour lecture/pause
              event.preventDefault()
              togglePlay()
              break;
            // Ajoutez d'autres cas pour d'autres touches si nécessaire
            default:
              break;
          }
        }
      }
    };
    const handleKeyUp = (event) => {
      if (document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') { } else {
        const video = videoRef.current;
        if (event.key === "c") {
          isCPressed = false;
          video.currentTime = 0;
          togglePlay()
        }
      }

    };
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyUp);


    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyUp);
      router.events.off("routeChangeStart", handleRouteChange);
      video.removeEventListener('canplay', handleCanPlay);
      clearInterval(interval);
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", updateTime);
      }
    };
  }, [auth]);



  useEffect(() => {
    const fetchVideo = async (video) => {
      try {
        const response = await fetch(`/Videos/${video}`);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        if (videoprops.uniid === router.query.v) {
          setVideoBlobUrl(blobUrl);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    // Timeline
    if (timelineRef.current) {
      const timelineContainer = timelineRef.current
      timelineContainer.addEventListener("mousedown", toggleScrubbing)
      document.addEventListener("mouseup", e => {
        if (isScrubbing) toggleScrubbing(e)
      })
    }
    let isScrubbing = false
    let wasPaused
    function toggleScrubbing(e) {
      const timelineContainer = timelineRef.current
      const videoContainer = videoContainerRef.current
      const rect = timelineContainer.getBoundingClientRect()
      const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
      isScrubbing = (e.buttons & 1) === 1
      videoContainer.classList.toggle("scrubbing", isScrubbing)
      if (isScrubbing) {
        wasPaused = videoRef.current.paused
        videoRef.current.pause()
      } else {
        videoRef.current.currentTime = percent * videoRef.current.duration
        if (!wasPaused) videoRef.current.play()
      }

    }
    fetchVideo(videoprops.Video)
  }, [videoprops])
  const videoUrl = `${process.env.NEXT_PUBLIC_URL}/Watch?v=${videoprops.uniid}`;

  if (!videoprops) return null

  return (
    <>
      <Title title={`${videoprops.Title} - TeramaFlix`} />
      <div ref={videoContainerRef}
        onMouseEnter={() => handleHideCtrl('')}
        onMouseLeave={() => handleHideCtrl('hidden')}
        onContextMenu={displayMenu}
        className={`video-container ${paused} ${screen} mini-player w-full lg:w-[100%] rounded relative `}
        data-volume-level={`${volumeLevel}`}>
        <div onClick={togglePlay} className={`controls  play-center absolute  flex justify-center items-center h-full w-full ${hideBtn}`}>
          <button className="play-pause-btn center z-0  bg-blue-500 bg-opacity-90  md:w-20 w-14 md:h-20 h-14  rounded-full cursor-pointer ">
            <svg className="play-icon text-white" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
            <svg className="pause-icon text-white" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
          </button>
        </div>

        <div className={`video-controls-container ${hideCntrl}`}>
          <div ref={timelineRef} className="timeline-container">
            <div className="timeline">
              <div
                className="thumb-indicator" ></div>
            </div>
          </div>

          <div className="controls z-0">
            <button onClick={togglePlay} className="play-pause-btn ">
              <svg className="play-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              </svg>
              <svg className="pause-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
              </svg>
            </button>

            <div onClick={() => handleNext(videoprops.NextVideo)} style={{ backgroundColor: 'black', width: 20 + 'px', height: 20 + 'px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
                <path d="m0 0v6l5-3zm5 3v3h2v-6h-2" fill="currentColor" className='text-gray-300 hover:text-white bg-opacity-90  md:w-22 w-14 md:h-22 h-14  rounded-full cursor-pointer  ' transform="translate(0 1)" />
              </svg>
            </div>


            <div className="volume-container " >
              <button onClick={toggleMute} className="mute-btn">
                <svg className="volume-high-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                </svg>
                <svg className="volume-low-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                </svg>
                <svg className="volume-muted-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                </svg>
              </button>
              <input className="volume-slider" type="range" min="0" max="1" step="any" value={volume} onChange={handleVolumeChange} />
            </div>
            <div className="duration-container">
              <div className="current-time">{formatTime(currentTime)}</div>
              /
              <div className="total-time">{formatTime(duration)}</div>
            </div>
            <div className='speed' >
              {showPlaybackSpeedMenu && (
                <div className="speed-menu absolute right-14 -top-[9rem] z-1  flex flex-col justify-center rounded-md items-center bg-gray-100 w-max px-4 text-slate-800 ">
                  <button onClick={() => setPlaybackSpeedValue(0.5)}>0.5x</button>
                  <button onClick={() => setPlaybackSpeedValue(0.75)}>0.75x</button>
                  <button onClick={() => setPlaybackSpeedValue(1)}>1x</button>
                  <button onClick={() => setPlaybackSpeedValue(1.25)}>1.25x</button>
                  <button onClick={() => setPlaybackSpeedValue(1.5)}>1.5x</button>
                  <button onClick={() => setPlaybackSpeedValue(2)}>2x</button>
                </div>
              )}
              <button className="speed-btn wide-btn " onClick={togglePlaybackSpeedMenu}>
                {playbackSpeed}x
              </button>
            </div>


            <button className="mini-player-btn" onClick={togglePictureInPicture}>
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z" />
              </svg>
            </button>

            <button className="full-screen-btn" onClick={handleFullScreen}>
              <svg className="open" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
              <svg className="close" viewBox="0 0 24 24">
                <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            </button>
          </div>
        </div>
        <video onClick={togglePlay} ref={videoRef} src={`/Videos/${videoprops.Video}`} onEnded={() => handleNext(videoprops.NextVideo)} className='rounded' autoPlay />
        <Menu id={MENU_ID}>
          {videoRef.current && (
            <>
              <Item onClick={togglePlay}>
                <>{videoRef.current.paused ? <span>Play</span> : <span>Pause</span>}</>
              </Item>
              <Item onClick={toggleMute}>
                <>{videoRef.current.muted ? <span>Unmute</span> : <span>Mute</span>}</>
              </Item>
              <Item onClick={() => handleNext(videoprops.NextVideo)}>
                Next
              </Item>
              <Item onClick={handlePrevious}>
                Previous
              </Item>
            </>
          )}
          <Item onClick={handleCopyUrl}>
            Copy video Link
          </Item>
          <Separator />
          <Item disabled>Download Video</Item>
          <Separator />
          <Submenu disabled label="Repeat">
            <Item onClick={handleItemClick}>
              Repeat Once
            </Item>
            <Item onClick={handleItemClick}>Repeat All </Item>
            <Item onClick={handleItemClick}>Begin Playlist</Item>
          </Submenu>
        </Menu>
      </div>
    </>
  )
}

export default Watching