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

    sendNewNotification(employeeId, {
      title: "Salary Added",
      message: `Your salary for the month of ${payDateObj.toLocaleString(
        "default",
        { month: "long" }
      )} has been processed.`,
      salaryDetails: {
        basicSalary,
        netSalary,
      },  
    });

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

// CORRECTED: Enhanced getSalary function with proper role-based security
const getSalary = async (req, res) => {
  try {
    const { id, role } = req.params;

    console.log("=== getSalary API Called ===");
    console.log("Request params - id:", id, "role:", role);
    console.log(
      "User from JWT token - ID:",
      req.user._id,
      "Role:",
      req.user.role
    );

    // SECURITY: Verify that the requested role matches the user's actual role from JWT
    if (req.user.role !== role) {
      console.log("❌ SECURITY VIOLATION: Role mismatch!");
      console.log("JWT Token Role:", req.user.role);
      console.log("Requested Role:", role);
      return res.status(403).json({
        success: false,
        error: "Access denied. Role mismatch detected.",
      });
    }

    let salary;

    if (role === "admin") {
      console.log("🔑 Admin access granted");

      if (id === "all") {
        // Admin viewing all salaries
        console.log("📋 Fetching ALL salary records for admin");
        salary = await Salary.find()
          .populate("employeeId", "employeeId employeeName")
          .sort({ payDate: -1 });
      } else {
        // Admin viewing specific employee's salary
        console.log("👤 Fetching salary records for employee ID:", id);
        salary = await Salary.find({ employeeId: id })
          .populate("employeeId", "employeeId employeeName")
          .sort({ payDate: -1 });
      }
    } else if (role === "employee") {
      console.log("👨‍💼 Employee access - finding employee record");

      // For employees, always use their JWT user ID to find their employee record
      const employee = await Employee.findOne({ userId: req.user._id });

      if (!employee) {
        console.log("❌ Employee record not found for user:", req.user._id);
        return res.status(404).json({
          success: false,
          error: "Employee record not found. Please contact administrator.",
        });
      }

      console.log("✅ Employee found - Employee ID:", employee._id);
      console.log("Employee details:", {
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        userId: employee.userId,
      });

      // Find salary records for this employee only
      salary = await Salary.find({ employeeId: employee._id })
        .populate("employeeId", "employeeId employeeName")
        .sort({ payDate: -1 });

      console.log(
        "📊 Found",
        salary?.length || 0,
        "salary records for employee"
      );
    } else {
      console.log("❌ Invalid role specified:", role);
      return res.status(400).json({
        success: false,
        error: "Invalid role specified. Must be 'admin' or 'employee'.",
      });
    }

    console.log("📈 Total salary records found:", salary?.length || 0);

    if (!salary || salary.length === 0) {
      console.log("⚠️  No salary records found");
      return res.status(200).json({
        success: true,
        salary: [],
        message: "No salary records found",
      });
    }

    console.log("✅ Successfully returning", salary.length, "salary records");
    return res.status(200).json({
      success: true,
      salary,
    });
  } catch (error) {
    console.error("❌ Error in getSalary:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error: " + error.message,
    });
  }
};

export { addSalary, getUniqueSalary, getSalary };
