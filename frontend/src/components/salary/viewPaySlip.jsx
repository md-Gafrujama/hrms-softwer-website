import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  // PDF Download function
  const downloadPDF = async () => {
    const originalElement = document.getElementById('payslip-content');
    
    // Create a clone of the element to avoid affecting the original
    const element = originalElement.cloneNode(true);
    element.id = 'payslip-content-clone';
    
    // Style the clone for PDF generation without affecting the original
    element.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: 750px !important;
      max-width: 750px !important;
      overflow: visible !important;
      transform: scale(1) !important;
      box-shadow: none !important;
      font-size: 12px !important;
      line-height: 1.2 !important;
      background: white;
      z-index: -1;
    `;
    
    // Reduce padding on the clone
    const sections = element.querySelectorAll('.p-4, .p-6');
    sections.forEach((section) => {
      section.style.cssText += 'padding: 12px !important;';
    });
    
    // Temporarily add clone to document
    document.body.appendChild(element);
    
    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Configure html2canvas for single page fit
    const canvas = await html2canvas(element, {
      scale: 1.2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 750,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    // Remove the clone from document
    document.body.removeChild(element);

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 8;
    
    // Calculate scaling to fit within A4 with margins
    const availableWidth = pdfWidth - (2 * margin);
    const availableHeight = pdfHeight - (2 * margin);
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Convert pixels to mm (96 DPI standard)
    const imgWidthMM = (imgWidth * 25.4) / (96 * 1.2); // Account for scale
    const imgHeightMM = (imgHeight * 25.4) / (96 * 1.2);
    
    // Scale to fit page while maintaining aspect ratio
    const scaleX = availableWidth / imgWidthMM;
    const scaleY = availableHeight / imgHeightMM;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
    
    const scaledWidth = imgWidthMM * scale;
    const scaledHeight = imgHeightMM * scale;
    
    // Center the content
    const x = (pdfWidth - scaledWidth) / 2;
    const y = margin;
    
    // Ensure it fits on one page
    if (scaledHeight > availableHeight) {
      const finalScale = availableHeight / imgHeightMM;
      const finalWidth = imgWidthMM * finalScale;
      const finalHeight = availableHeight;
      const finalX = (pdfWidth - finalWidth) / 2;
      
      pdf.addImage(imgData, 'PNG', finalX, y, finalWidth, finalHeight);
    } else {
      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
    }
    
    pdf.save(`${getEmployeeName(salary)}_Payslip_${formatDate(salary.payDate)}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-y-auto  mx-2">
        <div className="p-3 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800"></h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={downloadPDF}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition-colors"
              >
                Download PDF
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
          <div 
            id="payslip-content"
            className="bg-white shadow-lg overflow-hidden"
            style={{ 
              maxWidth: '800px', 
              margin: '0 auto',
              fontFamily: 'Arial, sans-serif',
              lineHeight: '1.4',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            
            {/* Company Header */}
            <div 
              className="bg-white p-1 sm:p-3 border-b border-gray-200 border-b-2 rounded-lg shadow-lg"
          
            >
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
                        <span className="text-teal-600 font-bold text-sm sm:text-lg">CO</span>
                      </div>
                    )}
                  </div>

                 
                  <div className="text-left">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                      {salary.companyName || "Quore B2b Private Limited"}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {salary.location ||
                        "Marvel Fuego Office no 7140 seventh floor, Magarpatta road Hadapsar Pune India"}
                    </p>
                  </div>
                </div>

                {/* Right Side - QR Code */}
                <div className="flex-shrink-0">
                  {salary.qr ? (
                    <img
                      src={salary.qr}
                      alt="QR Code"
                      className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                    />
                  ) : (
                    <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">QR</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Employee Summary Section */}
            <div className="p-4 sm:p-6 bg-white">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                {/* Left side - Employee details */}
                <div className="w-full lg:w-auto">
                  <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-6">
                    Employee Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-sm text-gray-600 w-32 flex-shrink-0">Employee Name       :</span>
                      <span className="text-sm font-medium text-gray-900">
                        {getEmployeeName(salary)}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm text-gray-600 w-32 flex-shrink-0">Employee ID         :</span>
                      <span className="text-sm font-medium text-gray-900">
                        {getEmployeeDisplay(salary)}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm text-gray-600 w-32 flex-shrink-0">Pay Period          :</span>
                      <span className="text-sm font-medium text-gray-900">
                        {salary.payPeriod || "March 2025"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm text-gray-600 w-32 flex-shrink-0">Pay Date          :</span>
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
                    <div className="pt-3 border-t border-gray-200 space-y-1">
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

            {/* Earnings and Deductions Table - Merged as in image */}
            <div className="p-6">
              <div className="bg-white overflow-hidden border-gray-300 shadow-lg rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">
                        EARNINGS
                      </th>
                      <th className="text-right py-3 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">
                        AMOUNT
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">
                        DEDUCTIONS
                      </th>
                      <th className="text-right py-3 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">
                        AMOUNT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-700">Basic</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(salary.basicSalary)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">Income Tax</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(salary.incomeTaxes)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-700">House Rent Allowance</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(salary.allowances)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">Provident Fund</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(salary.pF)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-700">Medical</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(salary.medicalFund || 2000)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">Professional Tax</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(salary.professionalTaxes)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 text-sm font-bold text-gray-700">Gross Earnings</td>
                      <td className="py-3 px-4 text-sm font-bold text-gray-900 text-right">
                        {formatCurrency(grossEarnings)}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-gray-700">Total Deductions</td>
                      <td className="py-3 px-4 text-sm font-bold text-gray-900 text-right">
                        {formatCurrency(totalDeductions)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Net Payable Section */}
            <div className="p-4 sm:p-6">
              <div className=" bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border-gray-300">
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-1">
                      Total Net Payable
                    </h3>
                    <p className="text-sm text-gray-600">
                      Gross Earnings - Total Deductions
                    </p>
                  </div>
                  <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(netPay)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount in Words */}
            <div className="px-4 sm:px-6 py-4 bg-gray-50">
              <div className="text-sm break-words">
                <span className="font-semibold text-gray-700">Amount In Words: </span>
                <span className="text-gray-900 italic">
                  {numberToWords(netPay)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 text-center bg-gray-100">
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