// import multer from "multer";
// import Employee from "../models/Employee.js";
// import User from "../models/User.js";
// import bcrypt from "bcrypt";
// import path from "path";
// import Department from "../models/Department.js";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

// const addEmployee = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       employeeId,
//       dob,
//       gender,
//       maritalStatus,
//       designation,
//       department,
//       salary,
//       password,
//       role,
//     } = req.body;

//     const user = await User.findOne({ email });
//     if (user) {
//       return res
//         .status(400)
//         .json({ success: false, error: "user already registered in emp" });
//     }

//     const hashPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       password: hashPassword,
//       role,
//       profileImage: req.file ? req.file.filename : "",
//     });
//     const savedUser = await newUser.save();

//     const newEmployee = new Employee({
//       userId: savedUser._id,
//       employeeId,
//       dob,
//       gender,
//       maritalStatus,
//       designation,
//       department,
//       salary,
//     });

//     await newEmployee.save();
//     return res.status(200).json({ success: true, message: "employee created" });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ success: false, error: "server error in adding employee" });
//   }
// };

// const getEmployees = async (req, res) => {
//   try {
//     const employees = await Employee.find()
//       .populate("userId", { password: 0 })
//       .populate("department");
//     return res.status(200).json({ success: true, employees });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ success: false, error: "get employees server error" });
//   }
// };

// const getEmployee = async (req, res) => {
//   const { id } = req.params;
//   try {
//     let employee;
//     employee = await Employee.findById({ _id: id })
//       .populate("userId", { password: 0 })
//       .populate("department");
//       if(!employee) {
//         employee = await Employee.findOne({ userId: id })
//       .populate("userId", { password: 0 })
//       .populate("department");
//       }
//     return res.status(200).json({ success: true, employee });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ success: false, error: "get employees server error" });
//   }
// };

// const updateEmployee = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, maritalStatus, designation, department, salary } = req.body;

//     const employee = await Employee.findById({ _id: id });
//     if (!employee) {
//       return res
//         .status(404)
//         .json({ success: false, error: "employee not found" });
//     }
//     const user = await User.findById({_id: employee.userId})

//     if (!user) {
//         return res
//           .status(404)
//           .json({ success: false, error: "user not found" });
//       }

//       const updateUser = await User.findByIdAndUpdate({_id: employee.userId}, {name})
//       const updateEmployee = await Employee.findByIdAndUpdate({_id: id}, {
//         maritalStatus,
//         designation, salary, department
//       })

//       if(!updateEmployee || !updateUser) {
//         return res
//           .status(404)
//           .json({ success: false, error: "document not found" });
//       }

//       return res.status(200).json({success: true, message: "employee update"})

//   } catch (error) {
//     return res
//       .status(500)
//       .json({ success: false, error: "update employees server error" });
//   }
// };

// const fetchEmployeesByDepId = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const employees = await Employee.find({ department: id })
//     return res.status(200).json({ success: true, employees });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ success: false, error: "get employeesbyDepId server error" });
//   }
// }

// export { addEmployee, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDepId };
import multer from "multer";
import { upload, uploadToCloudinary } from "../middleware/cloudinary.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import path from "path";
import Department from "../models/Department.js";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      status,
      password,
      role,
    } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "User already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      status,
      profileImage: req.cloudinaryUrl || "",
    });
    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      employeeName: name,
      dob,
      gender,
      status,
      maritalStatus,
      designation,
      department,
      salary,
    });

    await newEmployee.save();

    return res.status(200).json({ success: true, message: "Employee created" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Server error while adding employee" });
  }
};


const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", "name email profileImage")
      .populate("department");

    const employeeUserIds = employees.map((emp) => emp.userId._id);

    const usersWithoutEmployees = await User.find({
      _id: { $nin: employeeUserIds },
    }).select("name email profileImage role status");

    return res.status(200).json({ success: true, employees, users: usersWithoutEmployees });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = await Employee.findById({ _id: id })
      .populate("userId", "name email profileImage role status")
      .populate("department");

    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", "name email profileImage role status")
        .populate("department");
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get employees server error" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, maritalStatus, designation, department, salary, role, status } = req.body;

    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      return res.status(404).json({ success: false, error: "employee not found" });
    }
    const user = await User.findById({ _id: employee.userId });
    if (!user) {
      return res.status(404).json({ success: false, error: "user not found" });
    }

    const userUpdateData = {};
    if (name) userUpdateData.name = name;
    if (email) userUpdateData.email = email;
    if (role) userUpdateData.role = role;
    if (status) userUpdateData.status = status;
    if (req.cloudinaryUrl) userUpdateData.profileImage = req.cloudinaryUrl;

    const employeeUpdateData = {};
    if (maritalStatus) employeeUpdateData.maritalStatus = maritalStatus;
    if (designation) employeeUpdateData.designation = designation;
    if (salary !== undefined) employeeUpdateData.salary = salary;
    if (department) employeeUpdateData.department = department;
    if (status) employeeUpdateData.status = status;

    const [updatedUser, updatedEmployee] = await Promise.all([
      Object.keys(userUpdateData).length ? User.findByIdAndUpdate({ _id: employee.userId }, userUpdateData, { new: true }) : Promise.resolve(user),
      Object.keys(employeeUpdateData).length ? Employee.findByIdAndUpdate({ _id: id }, employeeUpdateData, { new: true }) : Promise.resolve(employee),
    ]);

    return res.status(200).json({ success: true, message: "employee update", user: updatedUser, employee: updatedEmployee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "update employees server error" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the employee first
    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    // Delete the associated user account
    const userDeleted = await User.findByIdAndDelete({ _id: employee.userId });
    if (!userDeleted) {
      return res
        .status(404)
        .json({ success: false, error: "Associated user not found" });
    }

    // Delete the employee record
    const employeeDeleted = await Employee.findByIdAndDelete({ _id: id });
    if (!employeeDeleted) {
      return res
        .status(404)
        .json({ success: false, error: "Failed to delete employee" });
    }

    return res.status(200).json({
      success: true,
      message: "Employee and associated user deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Server error while deleting employee" });
  }
};

const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.find({ department: id });
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employeesbyDepId server error" });
  }
};

const activeEmployee = async (req, res) => {
  try {
    const employees = await Employee.find({ status: "Active" })
      .populate("userId", { password: 0 })
      .populate("department");

    const count = await Employee.countDocuments({ status: "Active" });

    return res.status(200).json({ success: true, employees, count });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Get inactive employees server error" });
  }
};

const inActiveEmployee = async (req, res) => {
  try {
    const employees = await Employee.find({ status: "Inactive" })
      .populate("userId", { password: 0 })
      .populate("department");

    const count = await Employee.countDocuments({ status: "Inactive" });

    return res.status(200).json({ success: true, employees, count });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
  deleteEmployee,
  activeEmployee,
  inActiveEmployee,
};
