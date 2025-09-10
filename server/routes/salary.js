import express from 'express'
import authMiddleware from '../middleware/authMiddlware.js'
import { addSalary,getUniqueSalary,getSalary } from '../controllers/salaryController.js'

const router = express.Router()

router.post('/add', authMiddleware, addSalary);
router.get("/all",authMiddleware,getSalary);
router.get('/:id', authMiddleware, getUniqueSalary);


export default router



// import express from 'express'
// import authMiddleware from '../middleware/authMiddlware.js'
// import { addSalary, getUniqueSalary, getSalary } from '../controllers/salaryController.js'

// const router = express.Router()

// // Add salary
// router.post('/add', authMiddleware, addSalary);

// // Get all salaries (admin only)
// router.get("/all", authMiddleware, getSalary);

// // Get latest salary for specific employee
// router.get('/unique/:id', authMiddleware, getUniqueSalary);

// // Get ALL salary records for a specific employee (THIS IS WHAT YOU NEED)
// router.get('/:id', authMiddleware, (req, res) => {
//   // Pass the role as 'employee' to getSalary function
//   req.params.role = 'employee';
//   getSalary(req, res);
// });

// export default router