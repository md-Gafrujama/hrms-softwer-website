import express from 'express'
import authMiddleware from '../middleware/authMiddlware.js'
import { addSalary, getUniqueSalary, getSalary } from '../controllers/salaryController.js'

const router = express.Router()

// Add salary
router.post('/add', authMiddleware, addSalary);

// Get all salaries (admin only)
router.get("/all/:role", authMiddleware, getSalary);

// Get latest salary for specific employee
router.get('/unique/:id', authMiddleware, getUniqueSalary);

// Handle employee self-access (me/role)
router.get('/me/:role', authMiddleware, getSalary);

// Handle both admin and employee access with role parameter
router.get('/:id/:role', authMiddleware, getSalary);

export default router
