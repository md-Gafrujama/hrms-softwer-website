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

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const { user, logout } = useAuth()
    
    const toggleMobileMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hamburger clicked!'); // Debug log
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    
    return (
        <div className='flex items-center text-white justify-between h-12 bg-teal-600 px-5 shadow-md relative z-50'>
            {/* Hamburger Menu Button */}
            <div className='flex items-center space-x-4'>
                <button
                    type="button"
                    className="block md:hidden p-2 text-white hover:bg-teal-700 rounded transition-colors duration-200 focus:outline-none border border-transparent hover:border-teal-300"
                    onClick={toggleMobileMenu}
                    style={{ minWidth: '40px', minHeight: '40px' }}
                >
                    {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                </button>
                
                {/* Welcome message - responsive text */}
                <p className='text-sm sm:text-base truncate'>
                    <span className='hidden sm:inline'>Welcome </span>
                    <span className='font-medium'>{user.name}</span>
                </p>
            </div>
            
            {/* Logout button - responsive */}
            <button 
                type="button"
                className='px-3 py-1 sm:px-4 sm:py-1 text-xs sm:text-sm bg-teal-700 hover:bg-teal-800 rounded transition-colors duration-200 flex-shrink-0' 
                onClick={logout}
            >
                Logout
            </button>
        </div>
    )
}


export default Navbar