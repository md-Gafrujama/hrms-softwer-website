// import React from 'react'
// import { useAuth } from '../context/authContext'
// import AdminSidebar from '../components/dashboard/AdminSidebar'
// import Navbar from '../components/dashboard/Navbar'
// import AdminSummary from '../components/dashboard/AdminSummary'
// import { Outlet } from 'react-router-dom'

// const AdminDashboard = () => {
//   const {user} = useAuth()
 
//   return (
//     <div className='flex'>
//       <AdminSidebar />
//       <div className='flex-1 ml-64 bg-gray-100 h-screen'>
//         <Navbar />
//         <Outlet />
//       </div>
//     </div>
//   )
// }

// export default AdminDashboard

import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import AdminSidebar from '../components/dashboard/AdminSidebar'
import Navbar from '../components/dashboard/Navbar'
import AdminSummary from '../components/dashboard/AdminSummary'
import { Outlet } from 'react-router-dom'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  console.log('Admin Mobile menu state:', isMobileMenuOpen); // Debug log

  return (
    <div className='flex min-h-screen bg-gray-100 dark:bg-black dark:text-white relative'>
      <AdminSidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <div className={`flex-1 transition-all duration-300 w-full flex flex-col ${!isSidebarCollapsed ? 'md:ml-64' : 'md:ml-16'}`}>
        <Navbar 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
        <div className='flex-1 p-4 lg:p-6 overflow-auto mt-16'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

