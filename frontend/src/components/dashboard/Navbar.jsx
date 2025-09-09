// import React from 'react'
// import { useAuth } from '../../context/authContext'

// const Navbar = () => {
//     const {user, logout} = useAuth()
//   return (
//     <div className='flex items-center text-white justify-between h-12 bg-teal-600 px-5'>
//         <p >Welcome {user.name}</p>
//         <button className='px-4 py-1 bg-teal-700 hover:bg-teal-800' onClick={logout}>Logout</button>
//     </div>
//   )
// }

// export default Navbar
import React from 'react'
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext.jsx'

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen, isSidebarCollapsed, setIsSidebarCollapsed }) => {
    const { user, logout } = useAuth()
    
    const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hamburger clicked!'); // Debug log
        
        // Mobile: open/close overlay sidebar
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            return;
        }
        // Desktop: collapse/expand
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };
    
    return (
        <div className='flex items-center text-white justify-between h-16 bg-gradient-to-r from-teal-600 to-teal-700 px-6 shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-teal-500/20'>
            {/* Left Section - Hamburger Menu & Welcome */}
            <div className='flex items-center space-x-4'>
                {/* Hamburger Menu Button - Always visible */}
                <button
                    type="button"
                    className="p-3 text-white hover:bg-teal-500/30 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-opacity-50 border border-teal-400/20 hover:border-teal-300/40 backdrop-blur-sm shadow-md hover:shadow-lg"
                    onClick={toggleMenu}
                    style={{ minWidth: '44px', minHeight: '44px' }}
                    title={'Menu'}
                >
                    <FaBars size={20} />
                </button>
                
                {/* Welcome message - enhanced styling */}
                <div className='flex flex-col'>
                    <p className='text-xs text-teal-100 font-medium uppercase tracking-wide'>
                        Welcome back
                    </p>
                    <p className='text-lg font-semibold text-white truncate max-w-[200px] sm:max-w-[300px]'>
                        {user.name}
                    </p>
                </div>
            </div>
            
            {/* Right Section - User Actions */}
            <div className='flex items-center space-x-3'>
                {/* User Avatar/Initial */}
                <div className='hidden sm:flex items-center justify-center w-10 h-10 bg-teal-500/20 rounded-full border border-teal-300/30'>
                    <span className='text-teal-100 font-semibold text-sm'>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                </div>
                
                {/* Logout button - enhanced styling */}
                <button 
                    type="button"
                    className='group relative px-4 py-2 sm:px-5 sm:py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex-shrink-0 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/20'
                    onClick={logout}
                >
                    <span className='flex items-center space-x-2'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className='hidden sm:inline'>Logout</span>
                    </span>
                    <span className='pointer-events-none absolute -inset-px rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-white/30'></span>
                </button>
            </div>
        </div>
    )
}


export default Navbar