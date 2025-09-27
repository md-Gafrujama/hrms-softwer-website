import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import salaryRouter from './routes/salary.js';
import leaveRouter from './routes/leave.js';
import settingRouter from './routes/setting.js';
import attendanceRouter from './routes/attendance.js';
import dashboardRouter from './routes/dashboard.js';
import recent from './routes/recent.js';
import connectToDatabase from './db/db.js';
import { createServer } from 'http';
import { initSocket } from './socket/sockect.js';
import noti from "./routes/notification.js";
import expenses from "./routes/Expenses.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public/uploads'));

// routes
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/setting', settingRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/recent', recent);
app.use("/api/noti", noti);
app.use("/api/expense", expenses);   

connectToDatabase();
const server = createServer(app);
initSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
