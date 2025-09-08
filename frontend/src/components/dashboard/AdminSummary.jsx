// import React, { useEffect, useState } from "react";
// import SummaryCard from "./SummaryCard";
//  const baseURL = import.meta.env.VITE_API_URL;

// import {
//   FaBuilding,
//   FaCheckCircle,
//   FaFileAlt,
//   FaHourglassHalf,
//   FaMoneyBillWave,
//   FaTimesCircle,
//   FaUsers,
// } from "react-icons/fa";
// import axios from 'axios'

// const AdminSummary = () => {
//   const [summary, setSummary] = useState(null)

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const summary = await axios.get(`${baseURL}/api/dashboard/summary`, {
//           headers : {
//             "Authorization" : `Bearer ${localStorage.getItem('token')}`
//           }
//         })
//         console.log(summary.data)
//         setSummary(summary.data)
//       } catch(error) {
//         if(error.response) {
//           alert(error.response.data.error)
//         }
//         console.log(error.messsage)
//       }
//     }
//     fetchSummary()
//   }, [])

//   if(!summary) {
//     return <div> Loading...</div>
//   }

//   return (
//     <div className="p-6">
//       <h3 className="text-2xl font-bold">Dashboard Overview</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//         <SummaryCard
//           icon={<FaUsers />}
//           text="Total Employees"
//           number={summary.totalEmployees}
//           color="bg-teal-600"
//         />
//         <SummaryCard
//           icon={<FaBuilding />}
//           text="Total Departments"
//           number={summary.totalDepartments}
//           color="bg-yellow-600"
//         />
//         <SummaryCard
//           icon={<FaMoneyBillWave />}
//           text="Monthly Salary"
//           number={`$${summary.totalSalary}`}
//           color="bg-red-600"
//         />
//       </div>

//       <div className="mt-12">
//         <h4 className="text-center text-2xl font-bold">Leave Details</h4>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//           <SummaryCard
//             icon={<FaFileAlt />}
//             text="Leave Applied"
//             number={summary.leaveSummary.appliedFor}
//             color="bg-teal-600"
//           />
//           <SummaryCard
//             icon={<FaCheckCircle />}
//             text="Leave Approved"
//             number={summary.leaveSummary.approved}
//             color="bg-green-600"
//           />
//           <SummaryCard
//             icon={<FaHourglassHalf />}
//             text="Leave Pending"
//             number={summary.leaveSummary.pending}
//             color="bg-yellow-600"
//           />
//           <SummaryCard
//             icon={<FaTimesCircle />}
//             text="Leave Rejected"
//             number={summary.leaveSummary.rejected}
//             color="bg-red-600"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSummary;
import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";

const baseURL = import.meta.env.VITE_API_URL;

import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";
import axios from 'axios'

const AdminSummary = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true)
        
        // Get auth token
        const token = localStorage.getItem('token')
        const headers = {
          "Authorization": `Bearer ${token}`
        }

        // Fetch all data concurrently
        const [
          dashboardSummary,
          activeEmployees,
          inactiveEmployees
        ] = await Promise.all([
          axios.get(`${baseURL}/api/dashboard/summary`, { headers }),
          axios.get(`${baseURL}/api/employee/active`, { headers }),
          axios.get(`${baseURL}/api/employee/inactive`, { headers })
        ])

        console.log('Dashboard Summary:', dashboardSummary.data)
        console.log('Active Employees:', activeEmployees.data)
        console.log('Inactive Employees:', inactiveEmployees.data)

        // Count employees and handle empty arrays
        const activeCount = Array.isArray(activeEmployees.data) ? activeEmployees.data.length : 0;
        const inactiveCount = Array.isArray(inactiveEmployees.data) ? inactiveEmployees.data.length : 0;

        console.log('Active employee count:', activeCount)
        console.log('Inactive employee count:', inactiveCount)

        // Combine the data
        const combinedSummary = {
          ...dashboardSummary.data,
          activeEmployees: activeCount,
          inactiveEmployees: inactiveCount
        }

        setSummary(combinedSummary)
      } catch(error) {
        if(error.response) {
          alert(error.response.data.error)
        }
        console.log('Error:', error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSummary()
  }, [])

  if(loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if(!summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-gray-600">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Monitor your organization's key metrics and performance
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          <SummaryCard
            icon={<FaUsers />}
            text="Total Employees"
            number={summary.totalEmployees || 0}
            color="bg-gradient-to-r from-teal-500 to-teal-600"
          />
          <SummaryCard
            icon={<FaBuilding />}
            text="Total Departments"
            number={summary.totalDepartments || 0}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
          <SummaryCard
            icon={<FaMoneyBillWave />}
            text="Monthly Salary"
            number={`${summary.totalSalary || 0}`}
            color="bg-gradient-to-r from-red-500 to-red-600"
          />
        </div>

        {/* Employee Status Section */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
              Employee Status
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-4xl mx-auto">
            <SummaryCard
              icon={<FaUserCheck />}
              text="Active Employees"
              number={summary.activeEmployees || 0}
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
            <SummaryCard
              icon={<FaUserTimes />}
              text="Inactive Employees"
              number={summary.inactiveEmployees || 0}
              color="bg-gradient-to-r from-gray-500 to-gray-600"
            />
          </div>
        </div>

        {/* Leave Details Section */}
        <div className="mb-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
              Leave Management
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <SummaryCard
              icon={<FaFileAlt />}
              text="Leave Applied"
              number={summary.leaveSummary?.appliedFor || 0}
              color="bg-gradient-to-r from-teal-500 to-cyan-600"
            />
            <SummaryCard
              icon={<FaCheckCircle />}
              text="Leave Approved"
              number={summary.leaveSummary?.approved || 0}
              color="bg-gradient-to-r from-green-500 to-emerald-600"
            />
            <SummaryCard
              icon={<FaHourglassHalf />}
              text="Leave Pending"
              number={summary.leaveSummary?.pending || 0}
              color="bg-gradient-to-r from-yellow-500 to-orange-500"
            />
            <SummaryCard
              icon={<FaTimesCircle />}
              text="Leave Rejected"
              number={summary.leaveSummary?.rejected || 0}
              color="bg-gradient-to-r from-red-500 to-pink-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;