import React from 'react'

const SummaryCard = ({icon, text, number, color}) => {
  return (
    <div className="rounded flex bg-white dark:bg-black border border-gray-200 dark:border-white/20">
        <div className={`text-3xl flex justify-center items-center ${color} text-white px-4`}>
            {icon}
        </div>
        <div className="pl-4 py-1">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{text}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{number}</p>
        </div>
    </div>
  )
}
export default SummaryCard