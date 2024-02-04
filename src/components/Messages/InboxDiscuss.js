import React from 'react'

function InboxDiscuss({body}) {
  return (
    <>
        <div  className="flex flex-col space-y-3 text-left">
          <div>
            <span  className="bg-purple-800 text-white p-3 text-base rounded-r-lg rounded-t-2xl rounded-br-xl flex h-auto max-w dark:text-white dark:bg-gray-800"> 
              {body}
            </span>
          </div>
        </div>
    </>
  )
}

export default InboxDiscuss