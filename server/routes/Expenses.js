
import express from "express";
import {deleteExpense, getExpense , AddExpense, updateExpense } from "../controllers/expenseController.js";

const router = express.Router();

router.get("/getExpense" , getExpense);
router.post("/addExpense" , AddExpense);
router.delete("/deleteExpense/:id", deleteExpense);
router.put("/updateExpense/:id", updateExpense);

export default router;
