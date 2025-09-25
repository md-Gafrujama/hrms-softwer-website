import mongoose from "mongoose";


const ExpenseSchema = new mongoose.Schema({

    reason:{type: String, required : true},
    amount:{type: String , required : true},
    department:{type: String , required : true},
    dateTime:{type: Date , required : true}

});

export default mongoose.model("Expense" , ExpenseSchema);