import mongoose from "mongoose";
import { Schema } from "mongoose";

const salarySchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeName: {type: String, required :true},
  
    basicSalary: { type: Number, required: true },
    grossEarning : {type:Number,required:true},
    paidDays : {type:Number,required:true},

    payDate: { type: Date, required: true },
    loopDays: {type:Number},

    medicalFund : {type:Number,required:true},
    pF : {type:Number,required:true},
    allowances:  { type: Number },
    deductions: { type: Number },
    professionalTaxes : { type:Number , required :true},
    incomeTaxes : {type:Number, required:true},

    netSalary: { type: Number },
    netSalary2:{type:Number},
    month:{type:Number},

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
const Salary = mongoose.model('Salary', salarySchema);
export default Salary
  