import React from 'react'

function SentDiscuss({body}) {
  return (
    <>
        <div  className="space-y-3 text-left">
          <div  className="bg-purple-600 text-white p-3 text-base rounded-l-md rounded-tl-2xl rounded-br-lg inline-block h-auto max-w"> 
            {body}
          </div>
        </div> 
    </>
  )
}

export default SentDiscuss