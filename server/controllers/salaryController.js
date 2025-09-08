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
      payDate: new Date(payDate),
      loopDays: Number(loopDays) || 0,
      medicalFund: Number(medicalFund),
      pF: Number(pF),
      allowances: Number(allowances),
      deductions: Number(deductions),
      professionalTaxes: Number(professionalTaxes),
      incomeTaxes: Number(incomeTaxes),
      netSalary,
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

    // Use `employeeId` directly from Salary table
    const salary = await Salary.findOne({ employeeId: id })
      .sort({ payDate: -1 }) // Get the latest salary
      .populate("employeeId", "employeeId employeeName"); // Optional

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
