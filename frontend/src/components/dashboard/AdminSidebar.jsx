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
import { useAuth } from "../../context/authContext";

const AdminSidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { user } = useAuth();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
        className={`bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 z-40 transition-transform duration-300 ease-in-out w-64 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="bg-teal-600 h-12 flex items-center justify-center">
          <h3 className="text-2xl text-center font-pacific">Employee MS</h3>
        </div>
        <div className="px-4 overflow-y-auto h-full pb-4">
          {adminNavItems.map((item, index) => {
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

export default AdminSidebar;
