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
// import {AiOutlineFileText} from 'react-icons/ai'

// const AdminSidebar = () => {
//   return (
//     <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
//       <div className="bg-teal-600 h-12 flex items-center justify-center">
//         <h3 className="text-2xl text-center font-pacific">Employee MS</h3>
//       </div>
//       <div className="px-4">
//         <NavLink
//           to="/admin-dashboard"
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
//           to="/admin-dashboard/employees"
//           className={({ isActive }) =>
//             `${
//               isActive ? "bg-teal-500 " : " "
//             } flex items-center space-x-4 block py-2.5 px-4 rounded`
//           }
//         >
//           <FaUsers />
//           <span>Employee</span>
//         </NavLink>
//         <NavLink
//           to="/admin-dashboard/departments"
//           className={({ isActive }) =>
//             `${
//               isActive ? "bg-teal-500 " : " "
//             } flex items-center space-x-4 block py-2.5 px-4 rounded`
//           }
//         >
//           <FaBuilding />
//           <span>Department</span>
//         </NavLink>
//         <NavLink
//           to="/admin-dashboard/leaves"
//           className={({ isActive }) =>
//             `${
//               isActive ? "bg-teal-500 " : " "
//             } flex items-center space-x-4 block py-2.5 px-4 rounded`
//           }
//         >
//           <FaCalendarAlt />
//           <span>Leave</span>
//         </NavLink>
//         <NavLink
//           to="/admin-dashboard/salary/add"
//           className={({ isActive }) =>
//             `${
//               isActive ? "bg-teal-500 " : " "
//             } flex items-center space-x-4 block py-2.5 px-4 rounded`
//           }
//         >
//           <FaMoneyBillWave />
//           <span>Salary</span>
//         </NavLink>
//         <NavLink
//           to={`/admin-dashboard/attendance`}
//           className={({ isActive }) =>
//             `${
//               isActive ? "bg-teal-500 " : " "
//             } flex items-center space-x-4 block py-2.5 px-4 rounded`
//           }
//         >
//           <FaRegCalendarAlt />
//           <span>Attendance</span>
//         </NavLink>
//         <NavLink
//           to={`/admin-dashboard/attendance-report`}
//           className={({ isActive }) =>
//             `${
//               isActive ? "bg-teal-500 " : " "
//             } flex items-center space-x-4 block py-2.5 px-4 rounded`
//           }
//         >
//           <AiOutlineFileText />
//           <span>Attendance Report</span>
//         </NavLink>
//         <NavLink
//           to="/admin-dashboard/setting"
//           className="flex items-center space-x-4 block py-2.5 px-4 rounded"
//         >
//           <FaCogs />
//           <span>Settings</span>
//         </NavLink>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;

import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";

const AdminSidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen, isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const { user } = useAuth();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isExpanded = !isSidebarCollapsed;

  const adminNavItems = [
    {
      to: "/admin-dashboard",
      icon: FaTachometerAlt,
      label: "Dashboard",
      end: true,
    },
    {
      to: "/admin-dashboard/employees",
      icon: FaUsers,
      label: "Employee",
    },
    {
      to: "/admin-dashboard/departments",
      icon: FaBuilding,
      label: "Department",
    },
    {
      to: "/admin-dashboard/leaves",
      icon: FaCalendarAlt,
      label: "Leave",
    },
    {
      to: "/admin-dashboard/salary/add",
      icon: FaMoneyBillWave,
      label: "Salary",
    },
    {
      to: "/admin-dashboard/attendance",
      icon: FaChartLine,
      label: "Attendance",
    },
    {
      to: "/admin-dashboard/attendance-report",
      icon: FaFileAlt,
      label: "Attendance Report",
    },
    {
      to: "/admin-dashboard/setting",
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
        className={`bg-gray-800 text-white h-screen fixed left-0 top-16 bottom-0 z-40 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isExpanded ? "md:w-64" : "md:w-16"} w-64`}
      >
        {/* Header: User profile area (avatar, name, role badge). Avatar remains in collapsed view */}
        <div className="h-16 flex items-center px-3">
          {isExpanded ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold ring-2 ring-white/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{user?.name || 'User'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-teal-100 text-xs truncate">{user?.role === 'admin' ? 'System Administrator' : 'Employee'}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/20 text-white tracking-wider">{(user?.role || 'USER').toUpperCase()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold ring-2 ring-white/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Items */}
        <div className="px-2 overflow-y-auto h-full pb-4 space-y-1">
          {adminNavItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.to}
                className={({ isActive }) =>
                  `${
                    isActive 
                      ? "bg-teal-500 text-white shadow-lg" 
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } flex items-center rounded-lg transition-all duration-200 group ${
                    isExpanded ? "px-3 py-3 space-x-3" : "px-2 py-3 justify-center"
                  }`
                }
                end={item.end}
                onClick={closeMobileMenu}
                title={!isExpanded ? item.label : ""}
              >
                <Icon className={`flex-shrink-0 ${isExpanded ? "w-5 h-5" : "w-6 h-6"}`} />
                {isExpanded && (
                  <span className="whitespace-nowrap font-medium">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
