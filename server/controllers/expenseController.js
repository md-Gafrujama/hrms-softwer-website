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

export const deleteExpense = async(req , resp) => {

     try{

     const id = req.params.id;
     await Expense.deleteOne({_id:id}) ;
     resp.status(200).json({message:"expense deleted successfully"});

     }catch{

          resp.status(500).json({message:"un-expected error occured"});

     }

}

export const updateExpense = async (req, resp) => {
  try {
    const id = req.params.id;
    await Expense.findByIdAndUpdate(id, req.body, { new: true });
    resp.status(200).json({ message: "details updated successfully" });
  } catch {
    resp.status(500).json({ message: "failed to update expenses" });
  }
};
