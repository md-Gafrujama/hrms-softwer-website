import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

const addSalary = async (req, res) => {
  try {
    const userId = req.body.id;

    if (userId) {
      console.log("User ID:", userId);
    } else {
      console.log("User ID not found in localStorage");
    }

    const {
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
      userId,
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
        message: "User ID is required",
      });
    }
    // Find latest salary for given userId, replace employeeId with userId
    const salary = await Salary.findOne({ userId: id })
      .sort({ payDate: -1 })
      .populate("userId", "employeeName"); // adjust populate if needed

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary not found for user",
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
    const { id, role } = req.query;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "User ID is required." });
    }

    let salary;
    if (role === "admin") {
      salary = await Salary.find();
    } else {
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "User ID is required." });
      }
      salary = await Salary.find({ userId: id });
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
