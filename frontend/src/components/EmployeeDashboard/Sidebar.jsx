// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaBuilding,
//   FaCalendarAlt,
//   FaCogs,
//   FaMoneyBillWave,
//   FaRegCalendarAlt,
//   FaTachometerAlt,
//   FaUsers,
// } from "react-icons/fa";
// import { useAuth } from "../../context/authContext";

// const Sidebar = () => {
//     const {user} = useAuth()
//   return (
//     <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
//       <div className="bg-teal-600 h-12 flex items-center justify-center">
//         <h3 className="text-2xl text-center font-pacific">Employee MS</h3>
//       </div>
//       <div className="px-4">
//         <NavLink
//           to="/employee-dashboard"
//           className={({ isActive }) =>
//             `${
//               isActive ? "bg-teal-500 " : " "
//             } flex items-center space-x-4 block py-2.5 px-4 rounded`
//           }
//           end
//         >
//           <FaTachometerAlt />
//           <span>Dashboard</span>
//         </NavLink>
//         <NavLink
//           to={`/employee-dashboard/profile/${user._id}`}
//           className={({ isActive }) =>
//             `${
//               isActive ? "bg-teal-500 " : " "
//             } flex items-center space-x-4 block py-2.5 px-4 rounded`
//           }
//         >
//           <FaUsers />
//           <span>My Profile</span>
//         </NavLink>
//         <NavLink
//           to={`/employee-dashboard/leaves/${user._id}`}
//           className={({ isActive }) =>
//             `${
//               isActive ? "bg-teal-500 " : " "
//             } flex items-center space-x-4 block py-2.5 px-4 rounded`
//           }
//         >
//           <FaBuilding />
//           <span>Leaves</span>
//         </NavLink>
//         <NavLink
//           to={`/employee-dashboard/salary/${user._id}`}
//           className={({ isActive }) =>
//             `${
//               isActive ? "bg-teal-500 " : " "
//             } flex items-center space-x-4 block py-2.5 px-4 rounded`
//           }
//         >
//           <FaCalendarAlt />
//           <span>Salary</span>
//         </NavLink>
        
//         <NavLink
//           to="/employee-dashboard/setting"
//           className={({ isActive }) =>
//             `${
//               isActive ? "bg-teal-500 " : " "
//             } flex items-center space-x-4 block py-2.5 px-4 rounded`
//           }
//         >
//           <FaCogs />
//           <span>Settings</span>
//         </NavLink>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { user } = useAuth();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    {
      to: "/employee-dashboard",
      icon: FaTachometerAlt,
      label: "Dashboard",
      end: true,
    },
    {
      to: `/employee-dashboard/profile/${user._id}`,
      icon: FaUsers,
      label: "My Profile",
    },
    {
      to: `/employee-dashboard/leaves/${user._id}`,
      icon: FaBuilding,
      label: "Leaves",
    },
    {
      to: `/employee-dashboard/salary/${user._id}`,
      icon: FaCalendarAlt,
      label: "Salary",
    },
    {
      to: "/employee-dashboard/setting",
      icon: FaCogs,
      label: "Settings",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 z-40 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "w-64" : "w-0 lg:w-64"
        } overflow-hidden`}
      >
        <div className="bg-teal-600 h-12 flex items-center justify-center">
          <h3 className="text-2xl text-center font-pacific">Employee MS</h3>
        </div>
        <div className="px-4 overflow-y-auto h-full pb-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.to}
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500 " : " "
                  } flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-teal-600 transition-colors duration-200`
                }
                end={item.end}
                onClick={closeMobileMenu}
              >
                <Icon className="flex-shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;