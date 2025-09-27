import { useEffect, useState } from "react";
import axios from "axios";

const AddExpenses = () => {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState(0);
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]); 
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editReason, setEditReason] = useState("");
  const [editAmount, setEditAmount] = useState(0);
  const [editDepartment, setEditDepartment] = useState("");
  const [editDate, setEditDate] = useState("");

  const baseUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
  
      const currentTime = new Date();
      const selectedDate = new Date(date);
      const dateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        currentTime.getHours(),
        currentTime.getMinutes(),
        currentTime.getSeconds()
      );

      const res = await axios.post(`${baseUrl}/api/expense/addExpense`, {
        reason,
        amount,
        department,
        dateTime: dateTime.toISOString(),
      });

      if (res.status === 200) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        // reset form
        setReason("");
        setAmount(0);
        setDepartment("");
        setDate("");
        // refresh list
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/expense/getExpense`);
      setExpenses(res.data.data); 
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  };

  // Filter expenses based on selected month
  const filterExpensesByMonth = () => {
    if (!selectedMonth) {
      setFilteredExpenses(expenses);
      return;
    }

    const filtered = expenses.filter(expense => {
      if (!expense.dateTime) return false;
      const expenseDate = new Date(expense.dateTime);
      const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
      return expenseMonth === selectedMonth;
    });
    
    setFilteredExpenses(filtered);
  };

  // Get available months from expenses
  const getAvailableMonths = () => {
    const months = new Set();
    expenses.forEach(expense => {
      if (expense.dateTime) {
        const date = new Date(expense.dateTime);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.add(monthKey);
      }
    });
    return Array.from(months).sort().reverse();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await axios.delete(`${baseUrl}/api/expense/deleteExpense/${id}`);
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 3000);
      fetchExpenses(); 
    } 
    catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  }

  const handleEditClick = (exp) => {
    setEditId(exp._id);
    setEditReason(exp.reason);
    setEditAmount(exp.amount);
    setEditDepartment(exp.department);
    setEditDate(exp.dateTime ? exp.dateTime.slice(0, 10) : "");
  };

  const handleUpdate = async (id) => {
    try {
      const updatedExpense = {
        reason: editReason,
        amount: editAmount,
        department: editDepartment,
        dateTime: new Date(editDate).toISOString(),
      };
      await axios.put(`${baseUrl}/api/expense/updateExpense/${id}`, updatedExpense);
      setEditId(null);
      setShowUpdateSuccess(true);
      setTimeout(() => setShowUpdateSuccess(false), 3000);
      fetchExpenses();
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Failed to update expense. Please try again.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    filterExpensesByMonth();
  }, [expenses, selectedMonth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Modern Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-2">
                💰 Expense Tracker
              </h1>
              <p className="text-slate-600 text-lg">Manage your company expenses with ease</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-teal-600">{filteredExpenses.length}</div>
                <div className="text-sm text-slate-500">Total Expenses</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-teal-600">
                  ₹{filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0).toLocaleString('en-IN')}
                </div>
                <div className="text-sm text-slate-500">Total Amount</div>
              </div>
            </div>
          </div>

          {/* Success Toasts */}
          {showSuccess && (
            <div className="fixed top-4 right-4 z-50 bg-white border-l-4 border-green-500 rounded-lg shadow-lg p-4 flex items-center space-x-3 animate-slide-in-right">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <svg className="w-4 h-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Success!
                </p>
                <p className="text-sm text-gray-500">Expense added successfully ✓</p>
              </div>
            </div>
          )}

          {/* Update Success Toast */}
          {showUpdateSuccess && (
            <div className="fixed top-4 right-4 z-50 bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-4 flex items-center space-x-3 animate-slide-in-right">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <svg className="w-4 h-4 text-blue-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Updated!
                </p>
                <p className="text-sm text-gray-500">Expense updated successfully ✓</p>
              </div>
            </div>
          )}

          {/* Delete Success Toast */}
          {showDeleteSuccess && (
            <div className="fixed top-4 right-4 z-50 bg-white border-l-4 border-red-500 rounded-lg shadow-lg p-4 flex items-center space-x-3 animate-slide-in-right">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <svg className="w-4 h-4 text-red-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Deleted!
                </p>
                <p className="text-sm text-gray-500">Expense deleted successfully ✓</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Compact Form Sidebar */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  Add New Expense
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Expense Description
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Office supplies, Team lunch..."
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-teal-400 focus:bg-white transition-all duration-200 text-slate-700 placeholder-slate-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-teal-400 focus:bg-white transition-all duration-200 text-slate-700 placeholder-slate-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-teal-400 focus:bg-white transition-all duration-200 text-slate-700"
                  >
                    <option value="">Select Department</option>
                    <option value="HR">Human Resources</option>
                    <option value="IT">Information Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-teal-400 focus:bg-white transition-all duration-200 text-slate-700"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Expense
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Modern Expenses Grid */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    Recent Expenses
                  </h2>
                  
                  {/* Month Filter */}
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-3 py-2 bg-white border-2 border-slate-200 rounded-lg focus:border-teal-400 transition-all duration-200 text-slate-700 text-sm"
                    >
                      <option value="">All Months</option>
                      {getAvailableMonths().map(month => {
                        const [year, monthNum] = month.split('-');
                        const monthName = new Date(year, monthNum - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
                        return (
                          <option key={month} value={month}>
                            {monthName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              
              {filteredExpenses.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    {selectedMonth ? 'No expenses for selected month' : 'No expenses yet'}
                  </h3>
                  <p className="text-slate-500">
                    {selectedMonth ? 'Try selecting a different month or clear the filter' : 'Start by adding your first expense using the form'}
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredExpenses.map((exp, index) => (
                      <div key={exp._id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:shadow-md transition-all duration-200 hover:border-teal-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-800">{exp.reason}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                                    {exp.department}
                                  </span>
                                  {exp.dateTime && (
                                    <span className="text-xs text-slate-500">
                                      {new Date(exp.dateTime).toLocaleString('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <div className="text-2xl font-bold text-slate-800">
                              ₹{Number(exp.amount).toLocaleString('en-IN')}
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditClick(exp)}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-lg transition-colors duration-200"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(exp._id)}
                                className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors duration-200"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                Edit Expense
              </h2>
            </div>
            
            <form
              onSubmit={e => {
                e.preventDefault();
                handleUpdate(editId);
              }}
              className="p-6 space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <input
                  type="text"
                  value={editReason}
                  onChange={e => setEditReason(e.target.value)}
                  placeholder="Expense description"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:bg-white transition-all duration-200 text-slate-700"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Amount (₹)</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:bg-white transition-all duration-200 text-slate-700"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Department</label>
                <select
                  value={editDepartment}
                  onChange={e => setEditDepartment(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:bg-white transition-all duration-200 text-slate-700"
                >
                  <option value="">Select Department</option>
                  <option value="HR">Human Resources</option>
                  <option value="IT">Information Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={e => setEditDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:bg-white transition-all duration-200 text-slate-700"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddExpenses;
