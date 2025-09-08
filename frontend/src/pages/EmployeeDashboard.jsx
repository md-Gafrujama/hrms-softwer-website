// import React from 'react'
// import Sidebar from '../components/EmployeeDashboard/Sidebar'
// import {Outlet} from 'react-router-dom'
// import Navbar from '../components/dashboard/Navbar'

// const EmployeeDashboard = () => {
//   return (
//     <div className='flex'>
//       <Sidebar />
//       <div className='flex-1 ml-64 bg-gray-100 h-screen'>
//         <Navbar />
//         <Outlet />
//       </div>
//     </div>
//   )
// }

// export default EmployeeDashboard
import React, { useState } from 'react'
import Sidebar from '../components/EmployeeDashboard/Sidebar'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/dashboard/Navbar'

const EmployeeDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log('Mobile menu state:', isMobileMenuOpen); // Debug log

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      <div className='flex-1 transition-all duration-300 w-full md:ml-64'>
        <Navbar 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
        <div className='p-4 lg:p-6 overflow-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard