import express from 'express'
import authMiddleware from '../middleware/authMiddlware.js'
import { addSalary,getUniqueSalary,getSalary } from '../controllers/salaryController.js'

const router = express.Router()

router.post('/add', authMiddleware, addSalary);
router.get("/all",authMiddleware,getSalary);
router.get('/:id', authMiddleware, getUniqueSalary);


export default router