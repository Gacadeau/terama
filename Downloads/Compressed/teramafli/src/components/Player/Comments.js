import React, { useState, useEffect, useContext } from 'react'
import { SessionContext } from '../context/Auth'
import Comment from './Comment'

function Comments({ video }) {
  const [comments, setComments] = useState([])

  const fetchComments = async (uuid) => {
    const response = await fetch(`/api/comments/${uuid}`)
    const data = await response.json()
    if (data[0]) {
      setComments(data)
    }
  }

  useEffect(() => {
    const fetchCommentsInterval = setInterval(() => {
      fetchComments(video.uniid)
    }, 6000000) // Fetch comments every 5 seconds

    fetchComments(video.uniid)

    return () => {
      clearInterval(fetchCommentsInterval)
    }

  }, [video.uniid])


  // Afficher un message de chargement lorsque uniid est indéfini
  if (!video) {
    return (<div>Loading...</div>)
  }


  return (
    <>
      <div className="allUserComment lg:flex flex-col overflow-auto">
        {comments?.map(comment => (
          <Comment key={comment.ID} comment={comment} />
        ))}
        {comments == [[]] ? <h1 className='text-red-900'>no comments</h1> : ''
        }
      </div>
    </>
  )
}

export default Comments