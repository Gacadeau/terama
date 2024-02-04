import React, { useState, useEffect, useContext, useRef } from 'react'
import Link from 'next/link';
import { SessionContext } from '../context/Auth';
import Upload from './Uploads';
import Image from 'next/image';
import { useRouter } from 'next/router';

function EditVideo({ uuid }) {
  const router = useRouter()
  const videoRef = useRef(null);
  const [videoBlobUrl, setVideoBlobUrl] = useState('');
  const auth = useContext(SessionContext)
  const [videos, setVideos] = useState(null)
  const [imageBlobUrl, setImageBlobUrl] = useState('/img/logo.png');
  const [erroImage, seterroImage] = useState('')
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    cat: "",
    user: "",
    id: "",
    image: null,
    video: "",
    oldimage: ""
  });

  useEffect(() => {
    if (auth.session) {
      const fetchVideos = async () => {
        const response = await fetch(`/api/posts/editPost/${uuid}`);
        const data = await response.json();
        if (data) {
          setFormData((prevFormData) => ({
            title: data.Title,
            desc: data.Body,
            cat: data.CatId,
            user: data.User,
            id: data.ID,
            oldimage: data.Image,
            video: data.Video,
          }));
          fetchImage(data.Image)
          fetchVideo(data.Video)
        }
      };
      const fetchImage = async (image) => {
        try {
          const response = await fetch(`/Thumbnails/${image}`);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setImageBlobUrl(blobUrl);
        } catch (error) {
        }
      };
      const fetchUploads = async () => {
        const user = await auth;
        const response = await fetch(`/api/posts/hidePosts/${user.ID}`);
        const data = await response.json();
        if (data.length === 0) {
          // Faites quelque chose si les données sont videos
        } else {
          setVideos(data);
        }
      };

      const fetchVideo = async (video) => {
        try {
          const response = await fetch(`/Videos/${video}`);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setVideoBlobUrl(blobUrl);
        } catch (error) {
          console.error('Error fetching video:', error);
        }
      };
      fetchVideos();
      fetchUploads();
    }
  }, [auth, uuid]);

  const handleSubmit = async () => {
    if (videoRef.current) {
      if (formData.image && formData.oldimage != 'NULL') {
        const form = new FormData()
        form.append('title', formData.title)
        form.append('desc', formData.desc)
        form.append('cat', formData.cat)
        form.append('user', formData.user)
        form.append('id', formData.id)
        form.append('image', formData.image)
        form.append('oldimage', formData.oldimage)
        if (!isNaN(videoRef.current.duration)) {
          if (videoRef.current.duration > 80 && videoRef.current.videoWidth < videoRef.current.videoHeight) {
            form.append('short', 1)
          } else {
            form.append('short', 0)
          }
          // Envoyer les données à l'API pour les insérer dans la base de données
          const response = await fetch('/api/posts/addPost', {
            method: 'POST',
            body: form
          });

          // Vérifier si la création de l'utilisateur a réussi
          if (response.ok) {
            const post = await response.json();
            if (post.message) {
              router.push('/upload')
            }
            // Réinitialiser le formulaire
            setFormData({
              ...formData,
              title: ""
            })
            setFormData({ ...formData, desc: "" })
            setFormData({ ...formData, cat: "" })
            setFormData({ ...formData, image: null })
          } else {
            console.error(`Failed to create user: ${response.status} ${response.statusText}`);
          }
        }
      }else{
        seterroImage('Image Is required')
      }
    }
  }
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 ">
        <div className="description flex  flex-col md:w-[50%]  space-y-4">
          <label htmlFor="title">Title</label>
          <input type="text" id="title"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            value={formData.title}
            className=" border-2 border-blue-500 h-10 rounded" />
          <label htmlFor="textarea">Description</label>
          <textarea id="textarea" cols="30" rows="5"
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            value={formData.desc}
            className="border-2 border-blue-500  rounded"></textarea>
          <label htmlFor="Categorie">Categories</label>
          <select
            id="Categorie"
            value={formData.Categorie}
            onChange={(e) => setFormData({ ...formData, cat: e.target.value })}
            className="border-2 border-blue-500 h-10 rounded"
          >
            <option value="">-- Select Category --</option>
            <option value="ct1">Music</option>
            <option value="ct2">Films</option>
            <option value="ct3">Comedie</option>
            <option value="ct4">Saison</option>
          </select>
          <span className='text-red-600'>{erroImage}</span>
          <div className="flex flex-row space-x-4 md:max-w-[60%]">
            <div className="flex flex-row space-x-4">
              <h2>Thumbnails</h2>
              <label htmlFor="thumnail">
                <span className="bg-blue-500 p-2 text-white rounded text-base ">upload</span>
              </label>
            </div>
            
            <input className='hidden'
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} type="file" id="thumnail" />
            {formData.oldimage && (
              <div className="imag w-[100%] h-[170px] rounded overflow-hidden">
                <Image width={80} height={80}
                  src={imageBlobUrl}
                  className="w-[100%] h-[100%] object-cover"
                  alt="thumb"
                />
              </div>
            )}
            {formData.image && (
              <div className="imag w-[100%] h-[170px] rounded overflow-hidden">
                <Image width={80} height={80}
                  src={URL.createObjectURL(formData.image)}
                  className="w-[100%] h-[100%] object-cover"
                  alt="thumb"
                />
              </div>
            )}

          </div>

          <button onClick={handleSubmit} className="bg-blue-500 p-2 text-white rounded ">save</button>

        </div>
        <div className="detail md:w-[50%] flex flex-col space-y-6 items-center">
          <div className="  h-[170px]">
            <div className="imag w-[100%] h-[170px] rounded  overflow-hidden">
              <video ref={videoRef} src={videoBlobUrl} className="w-[100%]  h-[100%] object-cover" alt="" controls />
            </div>
          </div>
          <div className="detail-details flex flex-col  space-y-2 ">
            <span>Title : Brave</span>
            <span >Link : <Link title={`${process.env.NEXT_PUBLIC_URL}Watch/${uuid}`} className='text-blue-500 hover:underline underline-offset-4' href={`/Watch?v=${uuid}`}>{process.env.NEXT_PUBLIC_URL}Watc...</Link></span>
          </div>
        </div>
      </div>

      {
        videos ? <Upload videos={videos} /> : null}
    </>
  )
}

export default EditVideo