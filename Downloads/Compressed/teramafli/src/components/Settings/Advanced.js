import React from 'react'

function Advanced() {
  return (
    <>
      <div className="px-4 md:px-10 mt-[13.5rem] mb-3 mx-auto  sm:ml-[14rem] sm:mt-[20.4rem] sm:mb-[3rem] md:ml-[12.5rem] md:mt-[20rem] md:mb-[10rem] lg:mt-[19.5rem] lg:mb-[10.5rem] lg:ml-[17rem]" id="containerAccount">
        <div className="p-6 px-0 sm:px-5 md:px-0  2xl:px-6   xl:px-2 lg:px-0 shadow-blue-500 shadow-lg bg-white md:ml-5 lg:ml-14 xl:ml-32 ml-0 w-[15rem]  sm:w-[21rem] lg:w-[34rem]   rounded-md -mt-60  ring-1 ring-blue-600/50">
          <div className="text-center text-xl text-blue-700 mb-11 font-bold font-serif">Set up Terama exactly how you want it</div>
          <div className="px-4 flex space-x-12 mb-10">
            <div className="flex-col font-bold text-purple-700">My terama App</div>
            <div className="flex-col">
              <select id="" className="bg-gray-50 focus:outline-none focus:ring-2 focus:border-blue-700 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option selected>TeramaFlix</option>
                <option>TeramaPro</option>
              </select>
            </div>
          </div>
          <div className="px-4 flex space-x-8 mb-10">
            <div className="flex-col font-bold text-purple-700">Change password</div>
            <div className="lg:flex lg:space-x-2">
              <div className="lg:flex-col mb-3">
                <input type="password" placeholder="Older password" className="bg-gray-50 focus:outline-none focus:ring-2 focus:border-blue-700 border border-gray-300  text-gray-900 sm:text-sm rounded-lg w-28 sm:w-44 lg:w-36 p-2.5" />
              </div>
              <div className="lg:flex-col mb-3">
                <input type="password" placeholder="New password" className="bg-gray-50 focus:outline-none focus:ring-2 focus:border-blue-700 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-28 sm:w-44 lg:w-36 p-2.5" />
              </div>
              <div className="lg:flex-col">
                <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">Change</button>
              </div>

            </div>
          </div>
          <div className="px-4 font-bold text-blue-600 cursor-pointer">Delete channel</div>
        </div>

      </div>
    </>
  )
}

export default Advanced