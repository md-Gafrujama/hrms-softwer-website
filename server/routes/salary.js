import express from 'express'
import authMiddleware from '../middleware/authMiddlware.js'
import { addSalary, getUniqueSalary, getSalary } from '../controllers/salaryController.js'
import { upload, uploadToCloudinary } from "../middleware/cloudinary.js";

const router = express.Router()

router.post('/add', authMiddleware, upload.single('image'), uploadToCloudinary, addSalary);

router.get("/all/:role", authMiddleware, getSalary);

router.get('/unique/:id', authMiddleware, getUniqueSalary);

router.get('/me/:role', authMiddleware, getSalary);

router.get('/:id/:role', authMiddleware, getSalary);

export default router
