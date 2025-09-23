//sab key liye routes /salary /attendence /leave -> both get and post 
import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import noti from "../controllers/notificationController.js";

const router = express.Router();

router.post("/sendNotification", authMiddleware, noti.sendNotification);
router.get("/getAllNotifications", authMiddleware, noti.getAllNotifications);
router.get("/getNotificationsByType/:type", authMiddleware, noti.getNotificationsByType);
router.patch("/markAsRead/:id", authMiddleware, noti.markAsRead);
router.get("/getSalaryNoti", authMiddleware, noti.getSalaryNoti);
router.get("/getAttendance", authMiddleware, noti.attendanceCheck);
router.get("/leaveNMoti", authMiddleware, noti.leaveNoti);

export default router;
