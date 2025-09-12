import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL;


const AddDepartment = () => {
    const [department, setDepartment] = useState({
        dep_name: '',
        description: '',
        departmentHead: ''
    })
    const [employees, setEmployees] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/employee`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if(response.data.success) {
                    setEmployees(response.data.employees)
                }
            } catch(error) {
                console.log('Error fetching employees:', error)
            }
        }
        fetchEmployees()
    }, [])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setDepartment({...department, [name] : value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${baseURL}/api/department/add`, department, {
                headers: {
                    "Authorization" : `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.data.success) {
                navigate("/admin-dashboard/departments")
            }
        } catch(error) {
            if(error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
    }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6">Add New Department</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department Name
            </label>
            <input
              name="dep_name"
              type="text"
              placeholder="Department Name"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department Head
            </label>
            <select
              name="departmentHead"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              onChange={handleChange}
              value={department.departmentHead}
            >
              <option value="">Select Department Head</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.userId?.name || employee.employeeName}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Description"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              rows="4"
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Department
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;
