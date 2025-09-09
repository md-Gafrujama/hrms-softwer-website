// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../../context/authContext";

// const View = () => {
//   const [salaries, setSalaries] = useState(null);
//   const [filteredSalaries, setFilteredSalaries] = useState(null);
//   const { id } = useParams();
//   let sno = 1;
//   const {user} = useAuth()

//   const fetchSalareis = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/salary/${id}/${user.role}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       if (response.data.success) {
//         setSalaries(response.data.salary);
//         setFilteredSalaries(response.data.salary);
//       }
//     } catch (error) {
//       if (error.response && !error.response.data.success) {
//         alert(error.message);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchSalareis();
//   }, []);

//   const filterSalaries = (q) => {
//     const filteredRecords = salaries.filter((leave) =>
//       leave.employeeId.toLocaleLowerCase().includes(q.toLocaleLowerCase())
//     );
//     setFilteredSalaries(filteredRecords);
//   };

//   return (
//     <>
//       {filteredSalaries === null ? (
//         <div>Loading ...</div>
//       ) : (
//         <div className="overflow-x-auto p-5">
//           <div className="text-center">
//             <h2 className="text-2xl font-bold">Salary History</h2>
//           </div>
//           <div className=" flex justify-end my-3">
//             <input
//               type="text"
//               placeholder="Search By Emp ID"
//               className="border px-2 rounded-md py-0.5 border-gray-300"
//               onChange={filterSalaries}
//             />
//           </div>

//         {filteredSalaries.length > 0 ?(
//           <table className="w-full text-sm text-left text-gray-500">
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
//               <tr>
//                 <th className="px-6 py-3">SNO</th>
//                 <th className="px-6 py-3">Emp ID</th>
//                 <th className="px-6 py-3">Salary</th>
//                 <th className="px-6 py-3">Allowance</th>
//                 <th className="px-6 py-3">Deduction</th>
//                 <th className="px-6 py-3">Total</th>
//                 <th className="px-6 py-3">Pay Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSalaries.map((salary) => (
//                 <tr
//                   key={salary.id}
//                   className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
//                 >
//                   <td className="px-6 py-3">{sno++}</td>
//                   <td className="px-6 py-3">{salary.employeeId.employeeId}</td>
//                   <td className="px-6 py-3">
//                     {salary.basicSalary}
//                   </td>
//                   <td className="px-6 py-3">
//                     {salary.allowances}
//                   </td>
//                   <td className="px-6 py-3">{salary.deductions}</td>
//                   <td className="px-6 py-3">{salary.netSalary}</td>
//                   <td className="px-6 py-3">
//                     {new Date(salary.payDate).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           ): <div>No Records</div>}
//         </div>
//       )}
//     </>
//   );
// };

// export default View;
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
const baseURL = import.meta.env.VITE_API_URL;

const View = () => {
  const [salaries, setSalaries] = useState(null);
  const [filteredSalaries, setFilteredSalaries] = useState(null);
  const { id } = useParams();
  let sno = 1;
  const { user } = useAuth();

  const fetchSalareis = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/salary/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    fetchSalareis();
  }, []);

  const filterSalaries = (e) => {
    const q = e.target.value;
    const filteredRecords = salaries.filter((salary) =>
      salary.employeeId.employeeId.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredSalaries(filteredRecords);
  };

  // PDF Generation Function
  const generatePDF = (salary) => {
    const printWindow = window.open('', '_blank');
    const payDate = new Date(salary.payDate).toLocaleDateString();
    const payPeriod = new Date(salary.payDate).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });

    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payslip - ${salary.employeeId.employeeId}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.4;
          }
          .header { 
            text-align: center; 
            margin-bottom: 20px; 
            font-size: 12px;
            color: #666;
          }
          .company-info { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .company-info h2 {
            margin: 10px 0;
            color: #333;
          }
          .employee-summary { 
            background-color: #f5f5f5; 
            padding: 15px; 
            margin-bottom: 20px; 
            border: 1px solid #ddd;
          }
          .employee-summary h3 {
            margin-top: 0;
            color: #333;
          }
          .pay-details { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 20px; 
            gap: 20px;
          }
          .earnings, .deductions { 
            width: 45%; 
          }
          .earnings h4, .deductions h4 {
            margin-top: 0;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 10px;
          }
          .table th, .table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
          }
          .table th { 
            background-color: #f2f2f2; 
            font-weight: bold;
          }
          .summary-table {
            width: 100%;
            border-collapse: collapse;
          }
          .summary-table td {
            padding: 5px 10px;
            border: 1px solid #ddd;
          }
          .total-section { 
            margin-top: 20px; 
            padding: 15px; 
            background-color: #f9f9f9; 
            border: 1px solid #ddd;
            text-align: center;
          }
          .total-section h3 {
            margin-top: 0;
            color: #333;
          }
          .net-pay { 
            font-size: 18px; 
            font-weight: bold; 
            text-align: center; 
            margin: 20px 0; 
            padding: 15px;
            background-color: #e8f4f8;
            border: 2px solid #007bff;
            border-radius: 5px;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            font-style: italic; 
            font-size: 12px;
            color: #666;
          }
          .amount-words {
            font-size: 16px;
            margin-top: 10px;
            font-weight: normal;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <p>Powered by Simplify payroll and compliance. Visit zoho.com/payroll</p>
        </div>
        
        <div class="company-info">
          <h2>Quore B2b Private Limited</h2>
          <p>Marvel Fuego Office no 7140 seventh floor, Magarpatta road Hadapsar Pune India</p>
        </div>

        <div class="employee-summary">
          <h3>EMPLOYEE SUMMARY</h3>
          <table class="summary-table">
            <tr>
              <td><strong>Employee Name</strong></td>
              <td>${salary.employeeId.name || salary.employeeId.employeeId}</td>
              <td><strong>Employee ID</strong></td>
              <td>${salary.employeeId.employeeId}</td>
            </tr>
            <tr>
              <td><strong>Pay Period</strong></td>
              <td>${payPeriod}</td>
              <td><strong>Pay Date</strong></td>
              <td>${payDate}</td>
            </tr>
            <tr>
              <td colspan="2"><strong>Total Net Pay</strong></td>
              <td colspan="2"><strong>Rs.${parseFloat(salary.netSalary).toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td><strong>Paid Days</strong></td>
              <td>31</td>
              <td><strong>LOP Days</strong></td>
              <td>0</td>
            </tr>
          </table>
        </div>

        <div class="pay-details">
          <div class="earnings">
            <h4>EARNINGS</h4>
            <table class="table">
              <tr>
                <td>Basic</td>
                <td>Rs.${parseFloat(salary.basicSalary).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Allowances</td>
                <td>Rs.${parseFloat(salary.allowances).toFixed(2)}</td>
              </tr>
            </table>
            <table class="table">
              <tr style="background-color: #f0f0f0;">
                <td><strong>Gross Earnings</strong></td>
                <td><strong>Rs.${(parseFloat(salary.basicSalary) + parseFloat(salary.allowances)).toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>

          <div class="deductions">
            <h4>DEDUCTIONS</h4>
            <table class="table">
              <tr>
                <td>Income Tax</td>
                <td>Rs.0.00</td>
              </tr>
              <tr>
                <td>Provident Fund</td>
                <td>Rs.0.00</td>
              </tr>
              <tr>
                <td>Other Deductions</td>
                <td>Rs.${parseFloat(salary.deductions).toFixed(2)}</td>
              </tr>
            </table>
            <table class="table">
              <tr style="background-color: #f0f0f0;">
                <td><strong>Total Deductions</strong></td>
                <td><strong>Rs.${parseFloat(salary.deductions).toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>
        </div>

        <div class="total-section">
          <h3>TOTAL NET PAYABLE</h3>
          <p>Gross Earnings - Total Deductions</p>
          <p style="font-size: 20px; font-weight: bold; margin: 10px 0;">Rs.${parseFloat(salary.netSalary).toFixed(2)}</p>
        </div>

        <div class="net-pay">
          <div class="amount-words">
            Amount In Words: Indian Rupee ${convertToWords(salary.netSalary)} Only
          </div>
        </div>

        <div class="footer">
          -- This is a system-generated document. --
        </div>

        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Print PDF</button>
          <button onclick="window.close()" style="padding: 10px 20px; background-color: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(pdfContent);
    printWindow.document.close();
  };

  // Simple number to words conversion
  const convertToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convert = (n) => {
      if (n === 0) return '';
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      return 'Number too large';
    };

    const n = parseInt(num);
    if (n === 0) return 'Zero';
    return convert(n);
  };

  return (
    <>
      {filteredSalaries === null ? (
        <div>Loading ...</div>
      ) : (
        <div className="overflow-x-auto p-5">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Salary History</h2>
          </div>
          <div className="flex justify-end my-3">
            <input
              type="text"
              placeholder="Search By Emp ID"
              className="border px-2 rounded-md py-0.5 border-gray-300"
              onChange={filterSalaries}
            />
          </div>
          {filteredSalaries.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
                <tr>
                  <th className="px-6 py-3">SNO</th>
                  <th className="px-6 py-3">Emp ID</th>
                  <th className="px-6 py-3">Salary</th>
                  <th className="px-6 py-3">Allowance</th>
                  <th className="px-6 py-3">Deduction</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Pay Date</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((salary) => (
                  <tr
                    key={salary.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-3">{sno++}</td>
                    <td className="px-6 py-3">{salary.employeeId.employeeId}</td>
                    <td className="px-6 py-3">{salary.basicSalary}</td>
                    <td className="px-6 py-3">{salary.allowances}</td>
                    <td className="px-6 py-3">{salary.deductions}</td>
                    <td className="px-6 py-3">{salary.netSalary}</td>
                    <td className="px-6 py-3">
                      {new Date(salary.payDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => generatePDF(salary)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No Records</div>
          )}
        </div>
      )}
    </>
  );
};

export default View;