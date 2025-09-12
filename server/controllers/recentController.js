import Employee from '../models/Employee.js'
import Leave from '../models/Leave.js'
import Department from "../models/Department.js";
import Salary from '../models/Salary.js';
import Attendance from "../models/Attendance.js";

const recentDetail = async (req, res) => {
  try {
    const employees = await Employee.find()
      .sort({ createdAt: -1 })  // descending
      .limit(10);

    const leaves = await Leave.find()
      .sort({ appliedAt: -1 })
      .limit(10);

    const departments = await Department.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const salaries = await Salary.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const attendance = await Attendance.find()
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      employees,
      leaves,
      departments,
      salaries,
      attendance,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Server error fetching recent data" });
  }
};

export default recentDetail;
