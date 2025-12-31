import React from 'react'

const SummeryCard = ({icon,text,number,color}) => {
  return (
    <div className='rounded flex bg-white shadow-sm hover:shadow-md transition-shadow'>
        <div className={`text-xl sm:text-2xl md:text-3xl flex justify-center ${color} items-center bg-teal-600 text-white px-3 sm:px-4`}>
              {icon}
        </div>
        <div className='pl-3 sm:pl-4 py-2 sm:py-3 flex-1'>
            <p className='text-sm sm:text-base md:text-lg font-semibold text-gray-700'>{text}</p>
            <p className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900'>{number}</p>
        </div>
    </div>
  )
}

export default SummeryCard