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
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryCard from "./SummaryCard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

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

// Register Chart.js components once
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend, ArcElement)

const AdminSummary = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)

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

        // Use the count property from API response instead of array length
        const activeCount = activeEmployees.data?.count || 0;
        const inactiveCount = inactiveEmployees.data?.count || 0;

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

    const fetchRecentActivities = async () => {
      try {
        setActivitiesLoading(true)
        const token = localStorage.getItem('token')
        const headers = {
          "Authorization": `Bearer ${token}`
        }

        const response = await axios.get(`${baseURL}/api/recent?limit=5`, { headers })
        
        if (response.data.success) {
          setRecentActivities(response.data.activities)
        }
      } catch(error) {
        console.log('Error fetching activities:', error.message)
      } finally {
        setActivitiesLoading(false)
      }
    }
    
    fetchSummary()
    fetchRecentActivities()
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Monitor your organization's key metrics and performance
          </p>
        </div>

        {/* Dashboard Overview Section */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3">
              Dashboard Overview
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
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
        </div>

        {/* Employee Status Section */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3">
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

        {/* Combined Pie Charts Row */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Organization Overview Pie Chart */}
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-6 h-80">
            <Pie
              options={{
                responsive: true,
                animation: false,
                maintainAspectRatio: false,
                plugins: {
                  legend: { 
                    display: true,
                    position: 'bottom',
                    labels: {
                      color: '#374151',
                      font: { size: 12, weight: '500' },
                      padding: 20,
                      usePointStyle: true,
                      pointStyle: 'circle'
                    }
                  },
                  title: { 
                    display: true, 
                    text: 'Organization Overview',
                    font: { size: 18, weight: 'bold' },
                    color: '#374151',
                    padding: 20
                  },
                },
              }}
              data={{
                labels: ['Departments', 'Employees'],
                datasets: [
                  {
                    label: 'Totals',
                    data: [
                      summary.totalDepartments || 0,
                      summary.totalEmployees || 0,
                    ],
                    backgroundColor: ['#1E40AF', '#059669'],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                  },
                ],
              }}
            />
          </div>

          {/* Employee Status Pie Chart */}
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-6 h-80">
            <Pie
              options={{
                responsive: true,
                animation: false,
                maintainAspectRatio: false,
                plugins: {
                  legend: { 
                    display: true,
                    position: 'bottom',
                    labels: {
                      color: '#374151',
                      font: { size: 12, weight: '500' },
                      padding: 20,
                      usePointStyle: true,
                      pointStyle: 'circle'
                    }
                  },
                  title: { 
                    display: true, 
                    text: 'Employee Status',
                    font: { size: 18, weight: 'bold' },
                    color: '#374151',
                    padding: 20
                  },
                },
              }}
              data={{
                labels: ['Active', 'Inactive'],
                datasets: [
                  {
                    label: 'Count',
                    data: [summary.activeEmployees || 0, summary.inactiveEmployees || 0],
                    backgroundColor: ['#059669', '#6B7280'],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Leave Details Section */}
        <div className="mb-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3">
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
          {/* Leave Summary Bar Chart */}
          <div className="mt-8 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-6 h-80">
            <Bar
              options={{
                responsive: true,
                animation: false,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { 
                    display: true, 
                    text: 'Leave Summary',
                    font: { size: 18, weight: 'bold' },
                    color: '#374151',
                    padding: 20
                  },
                },
                scales: {
                  x: {
                    ticks: { 
                      color: '#6B7280',
                      font: { size: 12, weight: '500' }
                    },
                    grid: { 
                      display: false
                    },
                    border: {
                      display: true,
                      color: '#E5E7EB'
                    }
                  },
                  y: {
                    ticks: { 
                      color: '#6B7280',
                      font: { size: 12, weight: '500' },
                      stepSize: 1
                    },
                    grid: { 
                      color: '#F3F4F6',
                      lineWidth: 1
                    },
                    border: {
                      display: true,
                      color: '#E5E7EB'
                    },
                    beginAtZero: true,
                    precision: 0,
                  },
                },
              }}
              data={{
                labels: ['Applied', 'Approved', 'Pending', 'Rejected'],
                datasets: [
                  {
                    label: 'Count',
                    data: [
                      summary.leaveSummary?.appliedFor || 0,
                      summary.leaveSummary?.approved || 0,
                      summary.leaveSummary?.pending || 0,
                      summary.leaveSummary?.rejected || 0,
                    ],
                    backgroundColor: ['#0891B2', '#059669', '#D97706', '#DC2626'],
                    borderRadius: 0,
                    barPercentage: 0.4,
                    categoryPercentage: 0.6,
                    maxBarThickness: 60,
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="mb-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3">
              Recent Activities
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              Latest updates across the organization
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Recent Activities
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Latest updates across the organization
                </span>
              </div>
            </div>

            <div className="p-6">
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-300">Loading activities...</span>
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No recent activities found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-100 dark:border-gray-600"
                    >
                      {/* Status Indicator */}
                      <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'pending' ? 'bg-yellow-500' : 
                        activity.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {activity.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          activity.status === 'success' 
                            ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                            : activity.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
                            : activity.status === 'error'
                            ? 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                            : 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* View All Button */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => navigate('/all-activities')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  View All Activities
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Totals Bar Chart moved above employee status */}
      </div>
    </div>
  );
};

export default AdminSummary;