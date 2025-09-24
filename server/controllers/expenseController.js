import Expense from "../models/Expense.js";

export const  AddExpense = async (req , resp) => {
     try{

     
     
     const newExpense = new Expense(req.body);
     await newExpense.save();
   return   resp.json({message : "added expense successfully"});
     }catch{
          return resp.json({message:"cant add expense"});
     }
}

export const getExpense = async(req , resp ) => {

    const data = await Expense.find();
    resp.json({data:data , message:"all the expenses fetched"});

}