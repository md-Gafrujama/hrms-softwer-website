import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx';

const baseURL = import.meta.env.VITE_API_URL;

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "100px",
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    width: "90px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    width: "120px",
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    sortable: true,
    width: "130px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: "true",
  },
];

export const fetchDepartments = async () => {
  let departments;
  try {
    const responnse = await axios.get(`${baseURL}/api/department`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (responnse.data.success) {
      departments = responnse.data.departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return departments;
};

// employees for salary form
export const getEmployees = async (id) => {
  let employees;
  try {
    const responnse = await axios.get(
      `${baseURL}/api/employee/department/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(responnse)
    if (responnse.data.success) {
      employees = responnse.data.employees;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return employees;
};

//    delete employee
export const EmployeeButtons = ({ Id, onDeleted }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;
    try {
      const response = await axios.delete(`${baseURL}/api/employee/${Id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response?.data?.success) {
        alert("Employee deleted successfully");
        if (typeof onDeleted === 'function') onDeleted(Id);
      } else {
        alert(response?.data?.error || "Failed to delete employee");
      }
    } catch (error) {
      const msg = error?.response?.data?.error || error?.message || "Something went wrong";
      alert(msg);
    }
  };

  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}
      >
        View
      </button>
      <button
        className="px-3 py-1 bg-blue-600 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
      >
        Edit
      </button>
      <button className="px-3 py-1 bg-yellow-600 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/salary/${Id}`)}
      >Salary</button>
      <button className="px-3 py-1 bg-red-600 text-white"
      onClick={() => navigate(`/admin-dashboard/employees/leaves/${Id}`)}>Leave</button>
      <button
        className="px-3 py-1 bg-rose-700 text-white"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};
