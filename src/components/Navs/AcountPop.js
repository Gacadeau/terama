import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';
function AcountPop({auto}) {
    const router = useRouter()
    const handleLoggout =  async () =>{
      localStorage.removeItem('token')
      router.push('/login')
    }
  return (
    <>
     <div id="setMenu" className="absolute right-0 lg:fixed top-10 z-30 mt-4 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:right-0 lg:right-0" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
            <div className="py-1 w-full" role="none">
            {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
            <div className="flex flex-row items-center hover:bg-gray-300 hover:border-1 hover:border-gray-400 w-100 justify-start px-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <Link href={`/profile?c=${auto.uniid}`} className="block px-2 py-2 text-sm text-gray-700" id="menu-item-0">My Account</Link>
            </div>
            <div className="flex flex-row items-center hover:bg-gray-300 hover:border-1 hover:border-gray-400 justify-start px-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
                </svg>
                <Link href="/settings" className="block px-2 py-2 text-sm text-gray-700" id="menu-item-1">Settings </Link>
            </div>
            <div className="flex flex-row items-center hover:bg-gray-300 hover:border-1 hover:border-gray-400 justify-start px-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
                <Link href="/channel/create" className="block px-2 py-2 text-sm text-gray-700" id="menu-item-1">Create Channel</Link>
            </div>
            <div className="flex flex-row items-center hover:bg-gray-300 hover:border-1 hover:border-gray-400 justify-start px-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <div><button type="submit" onClick={()=>handleLoggout()} className="block w-full px-2 py-2 text-left text-sm text-gray-700" role="" tabIndex="-1" id="menu-item-3">Sign out</button></div>
            </div>
            
        </div>  
        </div> 
    </>
  )
}

export default AcountPop