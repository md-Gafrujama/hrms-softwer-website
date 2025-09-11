import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";

// PayslipModal component
const PayslipModal = ({ salary, onClose, formatCurrency, formatDate, getEmployeeName, getEmployeeDisplay, handleDownloadPayslip }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Salary Slip</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleDownloadPayslip(salary)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 712-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>

        {/* Payslip Content */}
        <div className="border-2 border-gray-300 rounded-lg p-6 bg-white">
          {/* Company Header */}
          <div className="text-center mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">COMPANY NAME</h1>
            <p className="text-gray-600">Salary Slip for the month of {formatDate(salary.payDate)}</p>
          </div>

          {/* Employee Details */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Employee Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {getEmployeeName(salary)}</p>
                <p><span className="font-medium">Employee ID:</span> {getEmployeeDisplay(salary)}</p>
                <p><span className="font-medium">Paid Days:</span> {salary.paidDays || 'N/A'}</p>
                <p><span className="font-medium">Loop Days:</span> {salary.loopDays || 'N/A'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Payment Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Pay Date:</span> {formatDate(salary.payDate)}</p>
                <p><span className="font-medium">Created:</span> {formatDate(salary.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Earnings and Deductions */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Earnings */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 bg-green-50 p-2 rounded">Earnings</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span>Basic Salary</span>
                  <span>{formatCurrency(salary.basicSalary)}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Allowances</span>
                  <span>{formatCurrency(salary.allowances)}</span>
                </div>
                <div className="flex justify-between font-semibold text-green-600 bg-green-50 p-2 rounded">
                  <span>Gross Earnings</span>
                  <span>{formatCurrency(salary.grossEarning)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 bg-red-50 p-2 rounded">Deductions</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span>Professional Tax</span>
                  <span>{formatCurrency(salary.professionalTaxes)}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Income Tax</span>
                  <span>{formatCurrency(salary.incomeTaxes)}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>PF</span>
                  <span>{formatCurrency(salary.pF)}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Medical Fund</span>
                  <span>{formatCurrency(salary.medicalFund)}</span>
                </div>
                <div className="flex justify-between font-semibold text-red-600 bg-red-50 p-2 rounded">
                  <span>Total Deductions</span>
                  <span>{formatCurrency(salary.deductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="border-t-2 pt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">NET SALARY</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(salary.netSalary)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500 border-t pt-4">
            <p>This is a computer generated salary slip and does not require signature</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const View = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPayslip, setShowPayslip] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();

  const baseURL = import.meta.env.VITE_API_URL;

  // Helper functions
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return `₹${numAmount.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getEmployeeDisplay = (salary) => {
    const employeeId = 
      salary.employeeId?.employeeId ||
      salary.employeeId ||
      salary.empId ||
      salary.employeeNumber ||
      'N/A';
    
    return String(employeeId);
  };

  const getEmployeeName = (salary) => {
    return salary.employeeName || 
           salary.employeeId?.name || 
           salary.employeeId?.employeeName ||
           salary.name ||
           salary.fullName ||
           user?.name ||
           user?.employeeName ||
           'N/A';
  };

  // CORRECTED: fetchSalaries function with proper role-based logic
  const fetchSalaries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user and user.role exist
      if (!user || !user.role) {
        console.log("Waiting for user context to load...");
        setError("Loading user information...");
        return;
      }

      let apiUrl;
      
      // FIXED: Determine access type based on user role
      if (user.role === "admin") {
        if (id) {
          // Admin accessing specific employee salary
          apiUrl = `${baseURL}/api/salary/${id}/admin`;
          console.log("Admin access - fetching salary for employee ID:", id);
        } else {
          // Admin accessing all salaries
          apiUrl = `${baseURL}/api/salary/all/admin`;
          console.log("Admin access - fetching all salaries");
        }
      } else if (user.role === "employee") {
        // Employee can only access their own salary
        apiUrl = `${baseURL}/api/salary/me/employee`;
        console.log("Employee access - fetching own salary");
        
        // If there's an ID in URL but user is employee, show warning
        if (id) {
          console.warn("Employee tried to access specific employee salary - redirected to own salary");
        }
      } else {
        throw new Error("Invalid user role: " + user.role);
      }

      console.log("Calling API:", apiUrl);

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setSalaries(response.data.salary || []);
        setFilteredSalaries(response.data.salary || []);
        
        if (!response.data.salary || response.data.salary.length === 0) {
          console.warn("No salary records found");
          setError("No salary records found for this employee.");
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch salary data");
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
      
      let errorMessage = "An error occurred while fetching salaries";
      
      if (error.response && !error.response.data.success) {
        errorMessage = error.response.data.error || error.response.data.message || error.message;
      } else if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (error.response.status === 403) {
          errorMessage = "You don't have permission to view this data.";
        } else if (error.response.status === 404) {
          errorMessage = "No salary records found.";
        } else {
          errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
      setSalaries([]);
      setFilteredSalaries([]);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [baseURL, id, user]);

  useEffect(() => {
    if (user && user.role) {
      const timeoutId = setTimeout(() => {
        fetchSalaries();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else {
      setLoading(true);
      setError("Loading user information...");
    }
  }, [fetchSalaries, user]);

  const generatePayslipHTML = (salary) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Salary Slip</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .details { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .earnings, .deductions { width: 48%; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .total { font-weight: bold; background-color: #e8f5e8; }
    </style>
</head>
<body>
    <div class="header">
        <h1>SALARY SLIP</h1>
        <p>Pay Period: ${formatDate(salary.payDate)}</p>
    </div>
    
    <div class="details">
        <div>
            <p><strong>Employee Name:</strong> ${getEmployeeName(salary)}</p>
            <p><strong>Employee ID:</strong> ${getEmployeeDisplay(salary)}</p>
        </div>
        <div>
            <p><strong>Pay Date:</strong> ${formatDate(salary.payDate)}</p>
            <p><strong>Paid Days:</strong> ${salary.paidDays || 'N/A'}</p>
        </div>
    </div>

    <table>
        <tr><th colspan="2">EARNINGS</th><th colspan="2">DEDUCTIONS</th></tr>
        <tr>
            <td>Basic Salary</td>
            <td>${formatCurrency(salary.basicSalary)}</td>
            <td>Professional Tax</td>
            <td>${formatCurrency(salary.professionalTaxes)}</td>
        </tr>
        <tr>
            <td>Allowances</td>
            <td>${formatCurrency(salary.allowances)}</td>
            <td>Income Tax</td>
            <td>${formatCurrency(salary.incomeTaxes)}</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td>PF</td>
            <td>${formatCurrency(salary.pF)}</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td>Medical Fund</td>
            <td>${formatCurrency(salary.medicalFund)}</td>
        </tr>
        <tr class="total">
            <td>Gross Earnings</td>
            <td>${formatCurrency(salary.grossEarning)}</td>
            <td>Total Deductions</td>
            <td>${formatCurrency(salary.deductions)}</td>
        </tr>
        <tr class="total">
            <td colspan="3"><strong>NET SALARY</strong></td>
            <td><strong>${formatCurrency(salary.netSalary)}</strong></td>
        </tr>
    </table>
</body>
</html>`;
  };

  const handleDownloadPayslip = (salary) => {
    const element = document.createElement('a');
    const payslipContent = generatePayslipHTML(salary);
    const file = new Blob([payslipContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    
    const employeeName = getEmployeeName(salary).replace(/[^a-zA-Z0-9]/g, '_');
    const employeeId = getEmployeeDisplay(salary);
    const payDate = formatDate(salary.payDate).replace(/[^a-zA-Z0-9]/g, '_');
    
    element.download = `payslip-${employeeId}-${employeeName}-${payDate}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleViewPayslip = (salary) => {
    setSelectedSalary(salary);
    setShowPayslip(true);
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredSalaries(salaries);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filteredRecords = salaries.filter((salary) => {
      const employeeId = String(getEmployeeDisplay(salary)).toLowerCase();
      const employeeName = getEmployeeName(salary).toLowerCase();
      const payDate = salary.payDate ? new Date(salary.payDate).toLocaleDateString() : "";
      
      return (
        employeeId.includes(searchTerm) ||
        employeeName.includes(searchTerm) ||
        payDate.includes(searchTerm)
      );
    });
    
    setFilteredSalaries(filteredRecords);
  }, [salaries]);

  const generateCSV = (data) => {
    const headers = [
      'S.No', 'Employee Name', 'Employee ID', 'Basic Salary', 'Allowances', 
      'Gross Earning', 'PF', 'Medical Fund', 'Professional Tax', 'Income Tax',
      'Total Deductions', 'Net Salary', 'Paid Days', 'Loop Days', 'Pay Date'
    ];
    
    const csvRows = [
      headers.join(','),
      ...data.map((salary, index) => [
        index + 1,
        `"${getEmployeeName(salary)}"`,
        `"${getEmployeeDisplay(salary)}"`,
        salary.basicSalary || 0,
        salary.allowances || 0,
        salary.grossEarning || 0,
        salary.pF || 0,
        salary.medicalFund || 0,
        salary.professionalTaxes || 0,
        salary.incomeTaxes || 0,
        salary.deductions || 0,
        salary.netSalary || 0,
        salary.paidDays || 0,
        salary.loopDays || 0,
        `"${formatDate(salary.payDate)}"`
      ].join(','))
    ];
    
    return csvRows.join('\n');
  };

  const downloadFile = (content, filename, type) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const retryFetch = () => {
    fetchSalaries();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading salary history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={retryFetch}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            {user.role === "admin" && id ? 'Employee Salary History' : 'My Salary History'}
          </h2>
          {user && (
            <p className="text-gray-600 mt-1">
              {user.role === "admin" && id 
                ? `Employee ID: ${id} | Role: ${user.role} | Total Records: ${filteredSalaries.length}`
                : `Welcome ${user.name || 'Employee'} (${user.role}) | Total Records: ${filteredSalaries.length}`
              }
            </p>
          )}
        </div>

        {/* Summary Cards */}
        {filteredSalaries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-blue-100 text-sm font-medium">Total Records</p>
                  <p className="text-3xl font-bold">{filteredSalaries.length}</p>
                </div>
                <div className="text-blue-200">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-green-100 text-sm font-medium">Total Paid</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(filteredSalaries.reduce((sum, salary) => sum + parseFloat(salary.netSalary || 0), 0))}
                  </p>
                </div>
                <div className="text-green-200">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-purple-100 text-sm font-medium">Average Salary</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(filteredSalaries.reduce((sum, salary) => sum + parseFloat(salary.netSalary || 0), 0) / filteredSalaries.length)}
                  </p>
                </div>
                <div className="text-purple-200">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-orange-100 text-sm font-medium">Latest Payment</p>
                  <p className="text-sm font-bold">
                    {formatDate(new Date(Math.max(...filteredSalaries.map(s => new Date(s.payDate || 0).getTime()))))}
                  </p>
                </div>
                <div className="text-orange-200">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Actions Bar */}
        {filteredSalaries.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Employee ID, Name, or Date..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={retryFetch}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition duration-200 flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Salary Table */}
      {filteredSalaries.length > 0 ? (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full text-sm text-left bg-white">
            <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">S.No</th>
                <th className="px-6 py-4 font-semibold">Employee Name</th>
                {user.role === "admin" && id && <th className="px-6 py-4 font-semibold">Employee ID</th>}
                <th className="px-6 py-4 font-semibold">Basic Salary</th>
                <th className="px-6 py-4 font-semibold">Allowances</th>
                <th className="px-6 py-4 font-semibold">Gross Earning</th>
                <th className="px-6 py-4 font-semibold">PF</th>
                <th className="px-6 py-4 font-semibold">Medical Fund</th>
                <th className="px-6 py-4 font-semibold">Professional Tax</th>
                <th className="px-6 py-4 font-semibold">Income Tax</th>
                <th className="px-6 py-4 font-semibold">Total Deductions</th>
                <th className="px-6 py-4 font-semibold">Net Salary</th>
                <th className="px-6 py-4 font-semibold">Paid Days</th>
                <th className="px-6 py-4 font-semibold">Loop Days</th>
                <th className="px-6 py-4 font-semibold">Pay Date</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.map((salary, index) => (
                <tr
                  key={salary._id || salary.id || index}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {getEmployeeName(salary)}
                    </div>
                  </td>
                  {user.role === "admin" && id && (
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {getEmployeeDisplay(salary)}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 font-medium">
                    {formatCurrency(salary.basicSalary)}
                  </td>
                  <td className="px-6 py-4 text-green-600 font-medium">
                    {formatCurrency(salary.allowances)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-blue-600">
                    {formatCurrency(salary.grossEarning)}
                  </td>
                  <td className="px-6 py-4 text-red-600 font-medium">
                    {formatCurrency(salary.pF)}
                  </td>
                  <td className="px-6 py-4 text-red-600 font-medium">
                    {formatCurrency(salary.medicalFund)}
                  </td>
                  <td className="px-6 py-4 text-red-600 font-medium">
                    {formatCurrency(salary.professionalTaxes)}
                  </td>
                  <td className="px-6 py-4 text-red-600 font-medium">
                    {formatCurrency(salary.incomeTaxes)}
                  </td>
                  <td className="px-6 py-4 text-red-600 font-medium">
                    {formatCurrency(salary.deductions)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-lg text-green-700 bg-green-50 px-3 py-1 rounded-full">
                      {formatCurrency(salary.netSalary)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {salary.paidDays || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {salary.loopDays || '0'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(salary.payDate)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewPayslip(salary)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded bg-blue-50 hover:bg-blue-100"
                        title="View Salary Slip"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDownloadPayslip(salary)}
                        className="text-green-600 hover:text-green-800 p-1 rounded bg-green-50 hover:bg-green-100"
                        title="Download Payslip"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 712-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Salary Records Found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery 
              ? `No records match your search for "${searchQuery}"` 
              : "No salary records are available"
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="text-teal-600 hover:text-teal-800 font-medium"
            >
              Clear search and show all records
            </button>
          )}
        </div>
      )}

      {/* Additional Statistics Cards */}
      {filteredSalaries.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Salary Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Highest Salary:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(Math.max(...filteredSalaries.map(s => parseFloat(s.netSalary || 0))))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lowest Salary:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(Math.min(...filteredSalaries.map(s => parseFloat(s.netSalary || 0))))}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Difference:</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(
                    Math.max(...filteredSalaries.map(s => parseFloat(s.netSalary || 0))) - 
                    Math.min(...filteredSalaries.map(s => parseFloat(s.netSalary || 0)))
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Deduction Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total PF:</span>
                <span className="font-semibold">
                  {formatCurrency(filteredSalaries.reduce((sum, s) => sum + parseFloat(s.pF || 0), 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tax:</span>
                <span className="font-semibold">
                  {formatCurrency(filteredSalaries.reduce((sum, s) => 
                    sum + parseFloat(s.professionalTaxes || 0) + parseFloat(s.incomeTaxes || 0), 0
                  ))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Medical Fund:</span>
                <span className="font-semibold">
                  {formatCurrency(filteredSalaries.reduce((sum, s) => sum + parseFloat(s.medicalFund || 0), 0))}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Paid Days:</span>
                <span className="font-semibold text-green-600">
                  {(filteredSalaries.reduce((sum, s) => sum + parseFloat(s.paidDays || 0), 0) / filteredSalaries.length).toFixed(1)} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Loop Days:</span>
                <span className="font-semibold text-red-600">
                  {filteredSalaries.reduce((sum, s) => sum + parseFloat(s.loopDays || 0), 0)} days
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Attendance Rate:</span>
                <span className="font-semibold text-blue-600">
                  {(
                    (filteredSalaries.reduce((sum, s) => sum + parseFloat(s.paidDays || 0), 0) / 
                    (filteredSalaries.length * 30)) * 100
                  ).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      {filteredSalaries.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => {
              const csvContent = generateCSV(filteredSalaries);
              downloadFile(csvContent, 'salary-data.csv', 'text/csv');
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition duration-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Export CSV
          </button>
          
          <button
            onClick={() => {
              window.print();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition duration-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </button>

          <button
            onClick={() => {
              filteredSalaries.forEach(salary => handleDownloadPayslip(salary));
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition duration-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 712-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download All Payslips
          </button>
        </div>
      )}

      {/* Payslip Modal */}
      {showPayslip && selectedSalary && (
        <PayslipModal 
          salary={selectedSalary} 
          onClose={() => setShowPayslip(false)}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getEmployeeName={getEmployeeName}
          getEmployeeDisplay={getEmployeeDisplay}
          handleDownloadPayslip={handleDownloadPayslip}
        />
      )}
    </div>
  );
};

export default View;
