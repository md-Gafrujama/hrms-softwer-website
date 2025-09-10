// import React, { useEffect, useState } from "react";
// import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// const baseURL = import.meta.env.VITE_API_URL;

// const Add = () => {
//   const [salary, setSalary] = useState({
//     employeeId: null,
//     basicSalary: 0,
//     allowances: 0,
//     deductions: 0,
//     payDate: null,
//   });
//   const [departments, setDepartments] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getDepartments = async () => {
//       const departments = await fetchDepartments();
//       setDepartments(departments);
//     };
//     getDepartments();
//   }, []);

//   const handleDepartment = async (e) => {
//     const emps = await getEmployees(e.target.value)
//     setEmployees(emps)
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSalary((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         `${baseURL}/api/salary/add`,
//         salary,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       if (response.data.success) {
//         navigate("/admin-dashboard/employees");
//       }
//     } catch (error) {
//       if (error.response && !error.response.data.success) {
//         alert(error.response.data.error);
//       }
//     }
//   };

//   return (
//     <>
//       {departments ? (
//         <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
//           <h2 className="text-2xl font-bold mb-6">Add Salary</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//              {/* Department */}
//              <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Department
//                 </label>
//                 <select
//                   name="department"
//                   onChange={handleDepartment}
//                   className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//                   required
//                 >
//                   <option value="">Select Department</option>
//                   {departments.map((dep) => (
//                     <option key={dep._id} value={dep._id}>
//                       {dep.dep_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {/* employee  */}
//              <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Employee
//                 </label>
//                 <select
//                   name="employeeId"
//                   onChange={handleChange}
//                   className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//                   required
//                 >
//                   <option value="">Select Employee</option>
//                   {employees.map((emp) => (
//                     <option key={emp._id} value={emp._id}>
//                       {emp.employeeId}
//                     </option>
//                   ))}
//                 </select>
//               </div>


//               {/* Designation */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Basic Salary
//                 </label>
//                 <input
//                   type="number"
//                   name="basicSalary"
//                   onChange={handleChange}
//                   placeholder="basix salary"
//                   className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>

//               {/* Salary */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Allowances
//                 </label>
//                 <input
//                   type="number"
//                   name="allowances"
//                   onChange={handleChange}
//                   placeholder="allowances"
//                   className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Deductions
//                 </label>
//                 <input
//                   type="number"
//                   name="deductions"
//                   onChange={handleChange}
//                   placeholder="deductions"
//                   className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Pay Date
//                 </label>
//                 <input
//                   type="date"
//                   name="payDate"
//                   onChange={handleChange}
//                   className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
              
//             </div>

//             <button
//               type="submit"
//               className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
//             >
//               Add Salary
//             </button>
//           </form>
//         </div>
//       ) : (
//         <div>Loading...</div>
//       )}
//     </>
//   );
// };

// export default Add;
import React, { useEffect, useState } from "react";
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL;

const Add = () => {
  const [salary, setSalary] = useState({
    employeeId: "",
    employeeName: "",
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: "",
    grossEarning: 0,
    paidDays: 31,
    loopDays: 0,
    medicalFund: 0,
    pF: 0,
    professionalTaxes: 0,
    incomeTaxes: 0,
    netSalary: 0,
  });
  const [departments, setDepartments] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  // Calculate derived values whenever relevant fields change
  useEffect(() => {
    const { basicSalary, allowances, deductions, medicalFund, pF, professionalTaxes, incomeTaxes } = salary;
    const grossEarning = Number(basicSalary) + Number(allowances);
    const totalDeductions = Number(deductions) + Number(medicalFund) + Number(pF) + Number(professionalTaxes) + Number(incomeTaxes);
    const netSalary = grossEarning - totalDeductions;
    
    setSalary(prevData => ({
      ...prevData,
      grossEarning: grossEarning >= 0 ? grossEarning : 0,
      netSalary: netSalary >= 0 ? netSalary : 0
    }));
  }, [salary.basicSalary, salary.allowances, salary.deductions, salary.medicalFund, salary.pF, salary.professionalTaxes, salary.incomeTaxes]);

  const handleDepartment = async (e) => {
    try {
      const emps = await getEmployees(e.target.value);
      setEmployees(emps);
      console.log("Employees fetched:", emps); // Debug log
      
      // Reset employee selection when department changes
      setSalary(prevData => ({
        ...prevData,
        employeeId: "",
        employeeName: ""
      }));
      setSelectedEmployee(null);
      
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  const handleEmployeeChange = (e) => {
    const selectedEmpId = e.target.value;
    const selectedEmp = employees.find(emp => emp._id === selectedEmpId);
    
    console.log("Selected Employee Object:", selectedEmp); // Debug log
    
    if (selectedEmp) {
      setSelectedEmployee(selectedEmp);
      
      // Try to get the employee name from various possible fields
      let employeeName = "";
      if (selectedEmp.userId && selectedEmp.userId.name) {
        employeeName = selectedEmp.userId.name;
      } else if (selectedEmp.name) {
        employeeName = selectedEmp.name;
      } else if (selectedEmp.firstName && selectedEmp.lastName) {
        employeeName = `${selectedEmp.firstName} ${selectedEmp.lastName}`;
      } else if (selectedEmp.firstName) {
        employeeName = selectedEmp.firstName;
      } else if (selectedEmp.fullName) {
        employeeName = selectedEmp.fullName;
      } else if (selectedEmp.employeeName) {
        employeeName = selectedEmp.employeeName;
      } else {
        employeeName = selectedEmp.employeeId || "Unknown";
      }
      
      console.log("Final Employee Name:", employeeName); // Debug log
      
      setSalary(prevData => ({
        ...prevData,
        employeeId: selectedEmpId,
        employeeName: employeeName
      }));
    } else {
      setSelectedEmployee(null);
      setSalary(prevData => ({
        ...prevData,
        employeeId: "",
        employeeName: ""
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate numeric inputs
    if (['basicSalary', 'allowances', 'deductions', 'paidDays', 'loopDays', 'medicalFund', 'pF', 'professionalTaxes', 'incomeTaxes'].includes(name)) {
      const numValue = parseFloat(value) || 0;
      if (numValue < 0) {
        alert(`${name} cannot be negative`);
        return;
      }
      setSalary((prevData) => ({ ...prevData, [name]: numValue }));
    } else {
      setSalary((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!salary.employeeId) {
      alert("Please select an employee");
      return;
    }
    if (!salary.payDate) {
      alert("Please select a pay date");
      return;
    }
    if (salary.basicSalary <= 0) {
      alert("Basic salary must be greater than 0");
      return;
    }
    if (salary.paidDays <= 0 || salary.paidDays > 31) {
      alert("Paid days must be between 1 and 31");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/salary/add`,
        salary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("Salary added successfully!");
        navigate("/admin-dashboard/salary");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error || "Error adding salary");
      } else {
        alert("Network error occurred");
      }
    }
  };

  return (
    <>
      {departments ? (
        <div className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6">Add Salary</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  onChange={handleDepartment}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep._id} value={dep._id}>
                      {dep.dep_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee <span className="text-red-500">*</span>
                </label>
                <select
                  name="employeeId"
                  value={salary.employeeId}
                  onChange={handleEmployeeChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.employeeId} - {emp.userId?.name || emp.name || emp.firstName || emp.fullName || emp.employeeName || "Unknown"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee Name (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee Name
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={salary.employeeName || ""}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                  readOnly
                  placeholder="Auto-filled from employee selection"
                />
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Basic Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  value={salary.basicSalary}
                  onChange={handleChange}
                  placeholder="Enter basic salary"
                  min="0"
                  step="0.01"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Allowances */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allowances <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="allowances"
                  value={salary.allowances}
                  onChange={handleChange}
                  placeholder="Enter allowances"
                  min="0"
                  step="0.01"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Gross Earning (Calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gross Earning
                </label>
                <input
                  type="number"
                  name="grossEarning"
                  value={salary.grossEarning}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100 font-semibold"
                  readOnly
                />
              </div>

              {/* Paid Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Paid Days <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="paidDays"
                  value={salary.paidDays}
                  onChange={handleChange}
                  placeholder="Enter paid days"
                  min="1"
                  max="31"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Loop Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  LOP Days
                </label>
                <input
                  type="number"
                  name="loopDays"
                  value={salary.loopDays}
                  onChange={handleChange}
                  placeholder="Enter LOP days"
                  min="0"
                  max="31"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Pay Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pay Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="payDate"
                  value={salary.payDate}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Medical Fund */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Medical Fund
                </label>
                <input
                  type="number"
                  name="medicalFund"
                  value={salary.medicalFund}
                  onChange={handleChange}
                  placeholder="Enter medical fund"
                  min="0"
                  step="0.01"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Provident Fund (PF) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Provident Fund (PF)
                </label>
                <input
                  type="number"
                  name="pF"
                  value={salary.pF}
                  onChange={handleChange}
                  placeholder="Enter PF amount"
                  min="0"
                  step="0.01"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* General Deductions */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Other Deductions
                </label>
                <input
                  type="number"
                  name="deductions"
                  value={salary.deductions}
                  onChange={handleChange}
                  placeholder="Enter other deductions"
                  min="0"
                  step="0.01"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Professional Taxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Professional Tax
                </label>
                <input
                  type="number"
                  name="professionalTaxes"
                  value={salary.professionalTaxes}
                  onChange={handleChange}
                  placeholder="Enter professional tax"
                  min="0"
                  step="0.01"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Income Taxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Income Tax
                </label>
                <input
                  type="number"
                  name="incomeTaxes"
                  value={salary.incomeTaxes}
                  onChange={handleChange}
                  placeholder="Enter income tax"
                  min="0"
                  step="0.01"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Net Salary (Calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Net Salary
                </label>
                <input
                  type="number"
                  name="netSalary"
                  value={salary.netSalary}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-green-50 border-green-300 font-bold text-green-700"
                  readOnly
                />
              </div>
            </div>

            {/* Summary Section */}
            <div className="mt-8 p-6 bg-gray-50 rounded-md border">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Salary Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-600 mb-2">Earnings</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Basic Salary:</span>
                      <span className="font-medium">₹{Number(salary.basicSalary).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Allowances:</span>
                      <span className="font-medium">₹{Number(salary.allowances).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="font-semibold">Gross Earning:</span>
                      <span className="font-semibold text-green-600">₹{Number(salary.grossEarning).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-600 mb-2">Deductions</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Medical Fund:</span>
                      <span className="font-medium">₹{Number(salary.medicalFund).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PF:</span>
                      <span className="font-medium">₹{Number(salary.pF).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prof. Tax:</span>
                      <span className="font-medium">₹{Number(salary.professionalTaxes).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Income Tax:</span>
                      <span className="font-medium">₹{Number(salary.incomeTaxes).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other:</span>
                      <span className="font-medium">₹{Number(salary.deductions).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold text-red-600">₹{(Number(salary.deductions) + Number(salary.medicalFund) + Number(salary.pF) + Number(salary.professionalTaxes) + Number(salary.incomeTaxes)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-600 mb-2">Attendance</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Paid Days:</span>
                      <span className="font-medium">{salary.paidDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LOP Days:</span>
                      <span className="font-medium">{salary.loopDays}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-md shadow-sm border-2 border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">Net Salary</h4>
                  <div className="text-2xl font-bold text-green-700">
                    ₹{Number(salary.netSalary).toLocaleString()}
                  </div>
                  {salary.payDate && (
                    <div className="text-xs text-gray-600 mt-1">
                      Pay Date: {new Date(salary.payDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 transform hover:scale-105"
            >
              Add Salary
            </button>
          </form>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
        </div>
      )}
    </>
  );
};

export default Add;