import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper'
import DataTable from 'react-data-table-component'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL;

const List = () => {
    const [employeesRaw, setEmployeesRaw] = useState([])
    const [employeesRows, setEmployeesRows] = useState([])
    const [filteredRows, setFilteredRows] = useState([])
    const [empLoading, setEmpLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [depFilter, setDepFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [cardCounts, setCardCounts] = useState({ total: 0, active: 0, onLeave: 0, departments: 0 })

    const handleDeleted = (deletedId) => {
      setEmployeesRaw((prev) => {
        const next = prev.filter((e) => e._id !== deletedId)
        setCardCounts((curr) => ({
          ...curr,
          total: next.length,
          active: next.filter((e) => (e.status || '').toLowerCase() === 'active').length,
          departments: new Set(next.map(e => e?.department?.dep_name).filter(Boolean)).size,
        }))
        return next
      })
    }

    const mapEmployeeToRow = (emp, index) => {
      const rawImg = emp?.userId?.profileImage || ''
      const imgSrc = rawImg.startsWith('http') ? rawImg : (rawImg ? `${baseURL}/${rawImg}` : '')
      return ({
        _id: emp._id,
        sno: index + 1,
        dep_name: emp?.department?.dep_name || '-',
        name: emp?.userId?.name || emp?.employeeName || '-',
        dob: emp?.dob ? new Date(emp.dob).toLocaleDateString() : '-',
        profileImage: imgSrc ? <img width={40} height={40} className='rounded-full object-cover' src={imgSrc} alt={emp?.userId?.name || 'avatar'} /> : <div className='w-10 h-10 rounded-full bg-gray-200' />,
        action: (<EmployeeButtons Id={emp._id} onDeleted={handleDeleted} />),
      })
    }

    useEffect(() => {
      const fetchAll = async () => {
        setEmpLoading(true)
        try {
          const [empRes, leaveRes] = await Promise.all([
            axios.get(`${baseURL}/api/employee`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            axios.get(`${baseURL}/api/leave`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }).catch(() => ({ data: { leaves: [] } })),
          ])

          if (empRes.data?.success) {
            const raw = empRes.data.employees || []
            setEmployeesRaw(raw)
            const rows = raw.map((e, i) => mapEmployeeToRow(e, i))
            setEmployeesRows(rows)
            setFilteredRows(rows)

            const total = raw.length
            const active = raw.filter(e => (e.status || '').toLowerCase() === 'active'.toLowerCase()).length
            const departments = new Set(raw.map(e => e?.department?.dep_name).filter(Boolean)).size

            const now = new Date()
            const leaves = leaveRes?.data?.leaves || []
            const onLeave = leaves.filter(l => {
              const s = new Date(l.startDate)
              const e = new Date(l.endDate)
              const okStatus = (l.status || 'approved').toLowerCase() === 'approved'
              return okStatus && s <= now && now <= e
            }).length

            setCardCounts({ total, active, onLeave, departments })
          }
        } catch (error) {
          console.log(error.message)
          if (error.response && !error.response.data.success) {
            alert(error.response.data.error)
          }
        } finally {
          setEmpLoading(false)
        }
      }
      fetchAll()
    }, [])

    useEffect(() => {
      const filtered = employeesRaw
        .filter(emp => {
          const name = (emp?.userId?.name || emp?.employeeName || '').toLowerCase()
          const matchesName = name.includes(searchTerm.toLowerCase())
          const depName = (emp?.department?.dep_name || '').toLowerCase()
          const matchesDep = depFilter === 'all' || depName === depFilter.toLowerCase()
          const st = (emp?.status || '').toLowerCase()
          const matchesStatus = statusFilter === 'all' || st === statusFilter.toLowerCase()
          return matchesName && matchesDep && matchesStatus
        })
        .map((e, i) => mapEmployeeToRow(e, i))
      setFilteredRows(filtered)
    }, [employeesRaw, searchTerm, depFilter, statusFilter])

    const depOptions = useMemo(() => {
      const s = new Set(employeesRaw.map(e => e?.department?.dep_name).filter(Boolean))
      return Array.from(s)
    }, [employeesRaw])

    const statusOptions = useMemo(() => {
      const s = new Set(employeesRaw.map(e => (e?.status || '').trim()).filter(Boolean))
      return Array.from(s)
    }, [employeesRaw])

    const exportCsv = () => {
      const header = ['S No', 'Name', 'Department', 'DOB']
      const lines = filteredRows.map(r => [r.sno, r.name, r.dep_name, r.dob].join(','))
      const csv = [header.join(','), ...lines].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'employees.csv'
      a.click()
      URL.revokeObjectURL(url)
    }

    if (empLoading && filteredRows.length === 0) {
      return <div className='p-6'>Loading ...</div>
    }

    return (
      <div className='p-2 md:p-4 lg:p-6 space-y-6'>
        <div className="flex items-start md:items-center justify-between md:flex-row flex-col gap-3">
          <div>
            <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight'>Employee Management</h1>
            <p className='text-gray-500 mt-1'>Manage and view employee information</p>
          </div>
          <div className='flex items-center gap-2'>
            <button onClick={exportCsv} className='px-3 py-2 bg-white border text-gray-700 rounded shadow-sm hover:bg-gray-50'>
              Export
            </button>
            <Link to='/admin-dashboard/add-employee' className='px-4 py-2 bg-teal-600 text-white rounded shadow hover:bg-teal-700'>
              Add Employee
            </Link>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='bg-white rounded-xl border p-4 flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>Total Employees</p>
              <p className='text-2xl font-bold'>{cardCounts.total}</p>
            </div>
            <div className='w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center'>
              <span>👥</span>
            </div>
          </div>
          <div className='bg-white rounded-xl border p-4 flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>Active</p>
              <p className='text-2xl font-bold'>{cardCounts.active}</p>
            </div>
            <div className='w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center'>
              <span>✅</span>
            </div>
          </div>
          <div className='bg-white rounded-xl border p-4 flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>On Leave</p>
              <p className='text-2xl font-bold'>{cardCounts.onLeave}</p>
            </div>
            <div className='w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center'>
              <span>🗓️</span>
            </div>
          </div>
          <div className='bg-white rounded-xl border p-4 flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>Departments</p>
              <p className='text-2xl font-bold'>{cardCounts.departments}</p>
            </div>
            <div className='w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center'>
              <span>🏢</span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl border p-3 md:p-4'>
          <div className='flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between'>
            <div className='flex-1 flex items-center gap-3'>
              <div className='relative w-full max-w-xl'>
                <input type='text' placeholder='Search by name' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300' />
              </div>
              <select value={depFilter} onChange={(e) => setDepFilter(e.target.value)} className='rounded-lg border px-3 py-2 focus:outline-none'>
                <option value='all'>All Departments</option>
                {depOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className='rounded-lg border px-3 py-2 focus:outline-none'>
                <option value='all'>All Status</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='mt-4'>
            <DataTable columns={columns} data={filteredRows} pagination />
          </div>
        </div>
      </div>
    )
}

export default List