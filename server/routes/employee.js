// import express from 'express'
// import authMiddleware from '../middleware/authMiddlware.js'
// import {addEmployee, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDepId} from '../controllers/employeeController.js'

// const router = express.Router()

// router.get('/', authMiddleware, getEmployees)
// router.post('/add', authMiddleware, upload.single('image'), addEmployee)
// router.get('/:id', authMiddleware, getEmployee)
// router.put('/:id', authMiddleware, updateEmployee)
// router.get('/department/:id', authMiddleware, fetchEmployeesByDepId)

// export default router

import express from 'express'
import authMiddleware from '../middleware/authMiddlware.js'
import {addEmployee, getEmployees, activeEmployee, inActiveEmployee, getEmployee, updateEmployee, fetchEmployeesByDepId, deleteEmployee} from '../controllers/employeeController.js'
import { upload, uploadToCloudinary } from "../middleware/cloudinary.js";

const router = express.Router()

router.get('/active', authMiddleware,activeEmployee);
router.get('/inactive', authMiddleware, inActiveEmployee);
router.get('/', authMiddleware, getEmployees)
router.post("/add", authMiddleware, upload.single('image'), uploadToCloudinary,addEmployee);
router.get('/:id', authMiddleware, getEmployee)
router.put('/:id', authMiddleware, upload.single('image'), uploadToCloudinary, updateEmployee)
router.get('/department/:id', authMiddleware, fetchEmployeesByDepId)
router.delete('/:id', authMiddleware, deleteEmployee)

export default router