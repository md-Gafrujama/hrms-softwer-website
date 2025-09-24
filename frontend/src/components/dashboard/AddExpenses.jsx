import { useEffect, useState } from "react";
import axios from "axios";

const AddExpenses = () => {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState(0);
  const [department, setDepartment] = useState("");
  const [expenses, setExpenses] = useState([]); // ✅ store all expenses

  const baseUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/api/expense/addExpense`, {
        reason,
        amount,
        department,
      });

      if (res.status === 200) {
        alert("Expense added successfully");
        // reset form
        setReason("");
        setAmount(0);
        setDepartment("");
        // refresh list
        fetchExpenses();
      }
    } catch {
      alert("Api nhi lagi hai na");
    }
  };

  // ✅ fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/expense/getExpense`);
      setExpenses(res.data.data); // backend returns {data: [...], message: "..."}
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Expense for?"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in Rupees"
          required
        />
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Department of expense"
          required
        />
        <button type="submit">Add expense</button>
      </form>
<br />
<br />
      <div>
        <h1>All expenses</h1>
        <br />
        <table border="1">
          <thead>
            <tr>
              <th>Reason</th>
              <th>Amount</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id}>
                <td>{exp.reason}</td>
                <td>{exp.amount}</td>
                <td>{exp.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AddExpenses;
