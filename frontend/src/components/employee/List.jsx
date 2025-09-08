import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper'
import DataTable from 'react-data-table-component'
import axios from 'axios'

const List = () => {
    const [employees, setEmployees] = useState([])
    const [empLoading, setEmpLoading] = useState(false)
    const [filteredEmployee, setFilteredEmployees] = useState(null)

    useEffect(() => {
        const fetchEmployees = async () => {
            setEmpLoading(true)
          try {
            const responnse = await axios.get(
              "http://localhost:5000/api/employee",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            if (responnse.data.success) {
              let sno = 1;
              const data = await responnse.data.employees.map((emp) => ({
                _id: emp._id,
                sno: sno++,
                dep_name: emp.department.dep_name,
                name: emp.userId.name,
                dob: new Date(emp.dob).toLocaleDateString(),
                profileImage: <img width={40} className='rounded-full' src={`http://localhost:5000/${emp.userId.profileImage}`} />,
                action: (<EmployeeButtons Id={emp._id} />),
              }));
              setEmployees(data);
              setFilteredEmployees(data)
            }
          } catch (error) {
            console.log(error.message)
            if(error.response && !error.response.data.success) {
              alert(error.response.data.error)
          }
          } finally {
            setEmpLoading(false)
          }
        };
    
        fetchEmployees();
      }, []);

      const handleFilter = (e) => {
        const records = employees.filter((emp) => (
          emp.name.toLowerCase().includes(e.target.value.toLowerCase())
        ))
        setFilteredEmployees(records)
      }

      if(!filteredEmployee) {
        return <div>Loading ...</div>
      }

  return (
    <div className='p-6'>
        <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Employee</h3>
      </div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Seach By Dep Name"
          className="px-4 py-0.5 border"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-1 bg-teal-600 rounded text-white"
        >
          Add New Employee
        </Link>
      </div>
      <div className='mt-6'>
        <DataTable columns={columns} data={filteredEmployee} pagination/>
      </div>
    </div>
  )
}

export default List