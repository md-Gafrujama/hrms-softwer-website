import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

const addSalary = async (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      basicSalary,
      grossEarning,
      paidDays,
      payDate,
      loopDays,
      medicalFund,
      pF,
      allowances = 0,
      deductions = 0,
      professionalTaxes,
      incomeTaxes,
    } = req.body;

    const payDateObj = new Date(payDate);

    const year = payDateObj.getFullYear();
    const month = payDateObj.getMonth() + 1; 

    const totalDaysInMonth = new Date(year, month, 0).getDate();

    const perDaySalary = Number(basicSalary) / totalDaysInMonth;

    const loopDaysSalary = perDaySalary * (Number(loopDays) || 0);
    const paidDaysSalary = perDaySalary * Number(paidDays || 0);

    // You can use these individually or combined
    // Example: Let's assume netSalary2 uses paidDays + loopDays
    const adjustedBasicSalary = paidDaysSalary + loopDaysSalary;

    const netSalary2 =
      adjustedBasicSalary +
      Number(allowances) -
      Number(deductions) -
      Number(medicalFund) -
      Number(pF) -
      Number(professionalTaxes) -
      Number(incomeTaxes);

    const netSalary =
      Number(basicSalary) +
      Number(allowances) -
      Number(deductions) -
      Number(medicalFund) -
      Number(pF) -
      Number(professionalTaxes) -
      Number(incomeTaxes);

    const newSalary = new Salary({
      employeeId,
      employeeName,
      basicSalary: Number(basicSalary),
      grossEarning: Number(grossEarning),
      paidDays: Number(paidDays),
      payDate: payDateObj,
      loopDays: Number(loopDays) || 0,
      medicalFund: Number(medicalFund),
      pF: Number(pF),
      allowances: Number(allowances),
      deductions: Number(deductions),
      professionalTaxes: Number(professionalTaxes),
      incomeTaxes: Number(incomeTaxes),
      netSalary,
      netSalary2,
      month: month,
    });

    await newSalary.save();

    return res
      .status(200)
      .json({ success: true, message: "Salary saved successfully" });
  } catch (error) {
    console.error("Salary Save Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};


const getUniqueSalary = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const salary = await Salary.findOne({ employeeId: id })
      .sort({ payDate: -1 }) 
      .populate("employeeId", "employeeId employeeName"); 

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary not found for employee",
      });
    }

    return res.status(200).json({
      success: true,
      salary,
    });

  } catch (error) {
    console.error("Error getting unique salary:", error);
    return res.status(500).json({
      success: false,
      error: "Salary fetch server error",
    });
  }
};

const getSalary = async (req, res) => {
  try {
    const { id, role } = req.params;

    let salary;

    if (role === "admin") {
      salary = await Salary.find();
    } else {
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Employee ID is required." });
      }
      salary = await Salary.find({ employeeId: id });
    }

    return res.status(200).json({ success: true, salary });
  } catch (error) {
    console.error("Error fetching salary:", error);
    return res
      .status(500)
      .json({ success: false, error: "Salary fetch server error." });
  }
};

export { addSalary, getUniqueSalary, getSalary };
