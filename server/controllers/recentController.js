// import Employee from '../models/Employee.js'
// import Leave from '../models/Leave.js'
// import Department from "../models/Department.js";
// import Salary from '../models/Salary.js';
// import Attendance from "../models/Attendance.js";

// const recentDetail = async (req, res) => {
//   try {
//     const employees = await Employee.find()
//       .sort({ createdAt: -1 })  // descending
//       .limit(10);

//     const leaves = await Leave.find()
//       .sort({ appliedAt: -1 })
//       .limit(10);

//     const departments = await Department.find()
//       .sort({ createdAt: -1 })
//       .limit(10);

//     const salaries = await Salary.find()
//       .sort({ createdAt: -1 })
//       .limit(10);

//     const attendance = await Attendance.find()
//       .sort({ createdAt: -1 })
//       .limit(10);

//     return res.status(200).json({
//       success: true,
//       employees,
//       leaves,
//       departments,
//       salaries,
//       attendance,
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ success: false, error: "Server error fetching recent data" });
//   }
// };

// export default recentDetail;


import Employee from '../models/Employee.js'
import Leave from '../models/Leave.js'
import Department from "../models/Department.js";
import Salary from '../models/Salary.js';
import Attendance from "../models/Attendance.js";

const recentDetail = async (req, res) => {
  try {
    const { limit = 5, all = false } = req.query;
    const queryLimit = all === 'true' ? 100 : parseInt(limit);

    // Initialize activities array
    const activities = [];

    // Get recent employees (simplified query)
    try {
      const employees = await Employee.find()
        .populate('department', 'dep_name')
        .populate('userId', 'name')
        .sort({ createdAt: -1 })
        .limit(queryLimit)
        .lean();

      employees.forEach(emp => {
        const employeeName = emp.userId?.name || emp.employeeName || 'Unknown Employee';
        activities.push({
          id: `emp_${emp._id}`,
          message: `New employee ${employeeName} joined ${emp.department?.dep_name || 'the company'}`,
          time: formatTimeAgo(emp.createdAt),
          status: 'success',
          type: 'employee',
          timestamp: emp.createdAt
        });
      });
    } catch (empError) {
      console.log('Employee query error:', empError.message);
    }

    // Get recent departments
    try {
      const departments = await Department.find()
        .sort({ createdAt: -1 })
        .limit(queryLimit)
        .lean();

      departments.forEach(dept => {
        activities.push({
          id: `dept_${dept._id}`,
          message: `New department "${dept.dep_name}" was created`,
          time: formatTimeAgo(dept.createdAt),
          status: 'success',
          type: 'department',
          timestamp: dept.createdAt
        });
      });
    } catch (deptError) {
      console.log('Department query error:', deptError.message);
    }

    // Get recent leaves (simplified)
    try {
      const leaves = await Leave.find()
        .populate('employeeId', 'employeeName')
        .sort({ appliedAt: -1 })
        .limit(queryLimit)
        .lean();

      leaves.forEach(leave => {
        const statusMap = {
          'Pending': 'pending',
          'Approved': 'success',
          'Rejected': 'error'
        };
        const employeeName = leave.employeeId?.employeeName || 'Employee';
        activities.push({
          id: `leave_${leave._id}`,
          message: `${employeeName} applied for ${leave.leaveType} leave`,
          time: formatTimeAgo(leave.appliedAt),
          status: statusMap[leave.status] || 'pending',
          type: 'leave',
          timestamp: leave.appliedAt
        });
      });
    } catch (leaveError) {
      console.log('Leave query error:', leaveError.message);
    }

    // Get recent salaries (simplified)
    try {
      const salaries = await Salary.find()
        .populate('employeeId', 'employeeName')
        .sort({ createdAt: -1 })
        .limit(queryLimit)
        .lean();

      salaries.forEach(salary => {
        const employeeName = salary.employeeId?.employeeName || 'employee';
        activities.push({
          id: `salary_${salary._id}`,
          message: `Salary processed for ${employeeName} - $${salary.basicSalary}`,
          time: formatTimeAgo(salary.createdAt),
          status: 'success',
          type: 'salary',
          timestamp: salary.createdAt
        });
      });
    } catch (salaryError) {
      console.log('Salary query error:', salaryError.message);
    }

    // Get recent attendance (simplified)
    try {
      const attendance = await Attendance.find()
        .populate('employeeId', 'employeeName')
        .sort({ createdAt: -1 })
        .limit(queryLimit)
        .lean();

      attendance.forEach(att => {
        const status = att.status === 'Present' ? 'success' : att.status === 'Absent' ? 'error' : 'pending';
        const employeeName = att.employeeId?.employeeName || 'Employee';
        activities.push({
          id: `att_${att._id}`,
          message: `${employeeName} marked ${att.status.toLowerCase()} for ${new Date(att.date).toLocaleDateString()}`,
          time: formatTimeAgo(att.createdAt),
          status: status,
          type: 'attendance',
          timestamp: att.createdAt
        });
      });
    } catch (attendanceError) {
      console.log('Attendance query error:', attendanceError.message);
    }

    // Sort all activities by timestamp (most recent first) and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, queryLimit);

    return res.status(200).json({
      success: true,
      activities: sortedActivities,
      totalCount: activities.length
    });
  } catch (error) {
    console.error('Recent activities error:', error.message);
    return res.status(500).json({ success: false, error: "Server error fetching recent data" });
  }
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return new Date(date).toLocaleDateString();
};

export default recentDetail;
