import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    date: {
        type: String, //format "yyyy-mm-dd"
        required: true
    }, 
    employeeId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Sick", "Leave"],
        default: null
    }
})

const Attendance = mongoose.model("Attendance", AttendanceSchema)
export default Attendance;