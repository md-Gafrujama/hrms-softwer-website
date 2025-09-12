import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import recentDetail from "../controllers/recentController.js";

const router = express.Router()

router.get("/", authMiddleware, recentDetail);

export default router