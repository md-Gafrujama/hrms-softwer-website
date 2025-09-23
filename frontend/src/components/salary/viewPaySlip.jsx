import React from "react";

// Helper function: Convert number to words (Indian format)
const numberToWords = (num) => {
  if (!num || num === 0) return "Zero Only";

  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const numToWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 === 0 ? "" : " " + numToWords(n % 100))
      );
    if (n < 100000)
      return (
        numToWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 === 0 ? "" : " " + numToWords(n % 1000))
      );
    if (n < 10000000)
      return (
        numToWords(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 === 0 ? "" : " " + numToWords(n % 100000))
      );
    return (
      numToWords(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 === 0 ? "" : " " + numToWords(n % 10000000))
    );
  };

  return "Indian Rupee " + numToWords(Math.floor(num)) + " Only";
};

const PayslipModal = ({
  salary,
  onClose,
  formatCurrency,
  formatDate,
  getEmployeeName,
  getEmployeeDisplay,
  handleDownloadPayslip,
}) => {
  // Calculate totals dynamically
  const totalDeductions = (salary.professionalTaxes || 0) + 
                         (salary.incomeTaxes || 0) + 
                         (salary.pF || 0);
  
  const grossEarnings = (salary.basicSalary || 0) + 
                       (salary.allowances || 0) + 
                       (salary.medicalFund || 2000);
  
  const netPay = salary.netSalary || (grossEarnings - totalDeductions);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl mx-2">
        <div className="p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Salary Slip</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleDownloadPayslip(salary)}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition-colors"
              >
                Download
              </button>
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-md text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          {/* Payslip Container */}
          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
            
            {/* Company Header */}
            <div className="bg-gray-50 p-4 sm:p-6 border-b border-gray-300">
              <div className="flex items-center justify-between gap-4">
                {/* Left Side - Logo and Company Info */}
                <div className="flex items-center gap-4 flex-grow">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {salary.logo ? (
                      <img
                        src={salary.logo}
                        alt="Company Logo"
                        className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                      />
                    ) : (
                      <div className="h-12 w-12 sm:h-16 sm:w-16 bg-teal-50 border-2 border-teal-400 rounded flex items-center justify-center">
                        <span className="text-teal-600 font-bold text-sm sm:text-lg">LI</span>
                      </div>
                    )}
                  </div>

                 
                  <div className="text-left">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                      {salary.companyName || "Quore B2b Private Limited"}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {salary.companyAddress ||
                        "Marvel Fuego Office no 7140 seventh floor, Magarpatta road Hadapsar Pune India"}
                    </p>
                  </div>
                </div>

                {/* Right Side - QR Code */}
                <div className="flex-shrink-0">
                  {salary.qrCode ? (
                    <img
                      src={salary.qrCode}
                      alt="QR Code"
                      className="h-16 w-16 sm:h-20 sm:w-20 object-contain border border-gray-300"
                    />
                  ) : (
                    <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">QR</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Employee Summary Section */}
            <div className="p-4 sm:p-6 bg-white border-b border-gray-300">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                {/* Left side - Employee details */}
                <div className="w-full lg:w-auto">
                  <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-6">
                    Employee Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-sm text-gray-600 w-32 flex-shrink-0">Employee Name</span>
                      <span className="text-sm font-medium text-gray-900">
                        {getEmployeeName(salary)}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm text-gray-600 w-32 flex-shrink-0">Employee ID</span>
                      <span className="text-sm font-medium text-gray-900">
                        {getEmployeeDisplay(salary)}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm text-gray-600 w-32 flex-shrink-0">Pay Period</span>
                      <span className="text-sm font-medium text-gray-900">
                        {salary.payPeriod || "March 2025"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm text-gray-600 w-32 flex-shrink-0">Pay Date</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(salary.payDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Net pay highlight */}
                <div className="w-full lg:w-auto lg:min-w-[200px]">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-green-700 mb-1">
                      {formatCurrency(netPay)}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Total Net Pay</div>
                    <div className="pt-3 border-t border-green-200 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Paid Days</span>
                        <span className="font-medium">{salary.paidDays || "31"}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">LOP Days</span>
                        <span className="font-medium">{salary.loopDays || "0"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings and Deductions Tables */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings Table */}
                <div className="overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border border-gray-300 flex justify-between items-center">
                    <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
                      Earnings
                    </h4>
                    <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">
                      Amount
                    </span>
                  </div>
                  <div className="border border-gray-300 border-t-0">
                    <div className="flex justify-between py-3 px-4 border-b border-gray-200">
                      <span className="text-sm text-gray-700">Basic</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(salary.basicSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 px-4 border-b border-gray-200">
                      <span className="text-sm text-gray-700">House Rent Allowance</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(salary.allowances)}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 px-4 border-b border-gray-200">
                      <span className="text-sm text-gray-700">Medical</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(salary.medicalFund || 2000)}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 px-4 bg-gray-50 font-semibold">
                      <span className="text-sm text-gray-700">Gross Earnings</span>
                      <span className="text-sm text-gray-900">
                        {formatCurrency(grossEarnings)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions Table */}
                <div className="overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border border-gray-300 flex justify-between items-center">
                    <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
                      Deductions
                    </h4>
                    <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">
                      Amount
                    </span>
                  </div>
                  <div className="border border-gray-300 border-t-0">
                    <div className="flex justify-between py-3 px-4 border-b border-gray-200">
                      <span className="text-sm text-gray-700">Income Tax</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(salary.incomeTaxes)}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 px-4 border-b border-gray-200">
                      <span className="text-sm text-gray-700">Provident Fund</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(salary.pF)}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 px-4 border-b border-gray-200">
                      <span className="text-sm text-gray-700">Professional Tax</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(salary.professionalTaxes)}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 px-4 bg-gray-50 font-semibold">
                      <span className="text-sm text-gray-700">Total Deductions</span>
                      <span className="text-sm text-gray-900">
                        {formatCurrency(totalDeductions)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Net Payable Section */}
            <div className="bg-green-50 border-t border-green-200 p-4 sm:p-6 text-center">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide">
                Total Net Payable
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Gross Earnings - Total Deductions
              </p>
              <div className="text-2xl sm:text-3xl font-bold text-green-700 mb-4">
                {formatCurrency(netPay)}
              </div>
            </div>

            {/* Amount in Words */}
            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-300">
              <div className="text-sm break-words">
                <span className="font-semibold text-gray-700">Amount In Words: </span>
                <span className="text-gray-900 italic">
                  {numberToWords(netPay)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 text-center bg-gray-100 border-t border-gray-300">
              <p className="text-xs text-gray-500 mb-2">
                — This is a system-generated document —
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs">
                <span className="text-gray-400">Powered by</span>
                <span className="font-semibold text-orange-600">Payroll</span>
                <span className="text-gray-400 text-center">
                  Simplify payroll and compliance. Visit zoho.com/payroll
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipModal;