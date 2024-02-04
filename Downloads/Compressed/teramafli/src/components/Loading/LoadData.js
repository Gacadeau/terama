import React from 'react'
import Data from './Data'

function LoadData() {
  return (
    <>
    <div className='flex flex-row  space-x-2 '>
      <div className={`w-[100%]`}>
        <Data />
      </div>
      <div className={`w-[100%]`}>
        <Data />
      </div>
      <div className={`w-[100%]`}>
        <Data />
      </div>
      <div className={`w-[100%]`}>
        <Data />
      </div>
    </div>
        
    </>
  )
}

export default LoadData