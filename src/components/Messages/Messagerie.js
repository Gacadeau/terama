import React,{useState} from 'react'
import Discuss from './Discuss'
function Messagerie() {
    const [popSms, setPopSms] = useState(false)
    const handlePopsms = state =>{
        setPopSms(state)
    }
  return (
    <>
      <div>
        <div  className="fixed bottom-12 right-4" id="">
          <div  className="flex justify-end mr-8 -mt-14 ">
            <button onClick={()=>handlePopsms(true)} type="button"  className="hover:text-indigo-600 shadow border-2 bg-gray-200 border-gray-300 rounded-full p-2 flex items-center justify-center hover:border-indigo-600" id="btn_a_message">
              <svg fill="none" viewBox="0 0 24 24"  strokeWidth="1.5" stroke="currentColor"   className="w-8 h-8">
                <path  strokeLinecap="round"  strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
              </svg>
              
            </button>
          </div>
        </div>
        {popSms && (
          <Discuss handlePopsms={handlePopsms} />
        )
        }
      </div>
      
    </>
  )
}

export default Messagerie