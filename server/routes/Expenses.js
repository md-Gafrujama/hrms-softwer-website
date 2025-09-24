
import express from "express";
import { getExpense , AddExpense } from "../controllers/expenseController.js";

const router = express.Router();

router.get("/getExpense" , getExpense);
router.post("/addExpense" , AddExpense);

export default router;
