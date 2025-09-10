import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL

const OrganizationPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [leaves, setLeaves] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        const [deptRes, empRes, leaveRes] = await Promise.all([
          axios.get(`${baseURL}/api/department`, { headers }),
          axios.get(`${baseURL}/api/employee`, { headers }),
          axios.get(`${baseURL}/api/leave`, { headers }),
        ])

        const apiDepartments = (deptRes?.data?.departments || []).map(d => ({
          id: d._id,
          name: d.dep_name,
          description: d.description || '',
        }))

        const apiEmployees = (empRes?.data?.employees || []).map(e => ({
          id: e._id,
          name: e.userId?.name || e.employeeName || 'Unknown',
          email: e.userId?.email || '',
          phone: e.userId?.phone || '',
          designation: e.designation || '',
          status: e.status || 'Inactive',
          departmentId: typeof e.department === 'object' ? e.department?._id : e.department,
          departmentName: typeof e.department === 'object' ? e.department?.dep_name : '',
          joiningDate: e.createdAt,
        }))

        setDepartments(apiDepartments)
        setEmployees(apiEmployees)
        setLeaves(leaveRes?.data?.leaves || [])
      } catch (err) {
        setError(err?.response?.data?.error || err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredDepartments = useMemo(() => (
    departments.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [departments, searchTerm])

  const getDepartmentEmployees = (departmentName) => {
    const dep = departments.find(d => d.name === departmentName)
    if (!dep) return []
    return employees.filter(emp => emp.departmentId === dep.id)
  }

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black dark:text-white" data-id="orajpu125">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Organization Structure</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage departments and organizational hierarchy</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-white flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m-7-7h14"/></svg>
              Add Department
            </button>
            <button type="button" className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
              View Org Chart
            </button>
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Card */}
          <div className="rounded flex bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-6 items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Departments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{departments.length}</p>
            </div>
            <div className="text-blue-600 dark:text-blue-400">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21V8a2 2 0 012-2h3v15M9 21V4h3v17M15 21V10h3a2 2 0 012 2v9"/></svg>
            </div>
          </div>
          <div className="rounded flex bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-6 items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{employees.length}</p>
            </div>
            <div className="text-green-600 dark:text-green-400">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M12 12a5 5 0 100-10 5 5 0 000 10z"/></svg>
            </div>
          </div>
          <div className="rounded flex bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-6 items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Employees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{employees.filter(e => e.status === 'Active').length}</p>
            </div>
            <div className="text-green-600 dark:text-green-400">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M12 12a5 5 0 100-10 5 5 0 000 10z"/></svg>
            </div>
          </div>
          <div className="rounded flex bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-6 items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Employees On Leave</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{leaves.filter(l => l.status === 'Approved').length}</p>
            </div>
            <div className="text-orange-600 dark:text-orange-400">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-6">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/></svg>
            <input
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Hierarchy */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg">
          <div className="border-b border-gray-200 dark:border-white/10 p-6">
            <h2 className="text-lg font-semibold">Organization Hierarchy</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Visual representation of company structure</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center space-y-8">
              {/* CEO */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-lg text-center">
                <h3 className="font-bold">CEO / Managing Director</h3>
                <p className="text-sm opacity-90">Executive Leadership</p>
              </div>
              {/* Department heads */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setSelectedDepartment(dept)}
                    className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-center hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-white/10"
                  >
                    <h4 className="font-semibold">{dept.name}</h4>
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {employees.filter(e => e.departmentId === dept.id).length} employees
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Departments grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => {
            const deptEmployees = getDepartmentEmployees(department.name)
            return (
              <div key={department.id} className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg hover:shadow-lg transition-shadow">
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{department.name}</h3>
                    <span className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-white/20">{deptEmployees.length} members</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{department.description}</p>
                </div>
                <div className="p-6">
                  {/* Department Head */}
                  <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Department Head</p>
                    <p className="font-semibold">N/A</p>
                  </div>
                  {/* Team */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Members</p>
                    <div className="flex flex-wrap gap-2">
                      {deptEmployees.slice(0, 6).map((employee) => (
                        <button key={employee.id} type="button" onClick={() => setSelectedDepartment(department)} className="cursor-pointer">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs flex items-center justify-center">
                            {getInitials(employee.name)}
                          </div>
                        </button>
                      ))}
                      {deptEmployees.length > 6 && (
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-medium">
                          +{deptEmployees.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button type="button" className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M12 12a5 5 0 100-10 5 5 0 000 10z"/></svg>
                      View Team
                    </button>
                    <button type="button" className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5h2M5 7h14M5 11h14M5 15h10M5 19h6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Simple modal for department details */}
      {selectedDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedDepartment(null)} />
          <div className="relative z-10 w-full max-w-4xl mx-4 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-white/10 shadow-xl">
            <div className="p-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedDepartment.name} Department</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDepartment.description}</p>
                </div>
                <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSelectedDepartment(null)}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg">
                  <div className="p-4 border-b border-gray-200 dark:border-white/10">
                    <h4 className="font-semibold">Department Info</h4>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Department Head</p>
                      <p className="font-semibold">{selectedDepartment.head}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Size</p>
                      <p className="font-semibold">{getDepartmentEmployees(selectedDepartment.name).length} employees</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                      <span className="inline-block text-xs px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg">
                  <div className="p-4 border-b border-gray-200 dark:border-white/10">
                    <h4 className="font-semibold">Team Members</h4>
                  </div>
                  <div className="p-4 space-y-3">
                    {getDepartmentEmployees(selectedDepartment.name).map((employee) => (
                      <div key={employee.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs flex items-center justify-center">
                          {getInitials(employee.name)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{employee.designation}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{employee.email}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{employee.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrganizationPage


