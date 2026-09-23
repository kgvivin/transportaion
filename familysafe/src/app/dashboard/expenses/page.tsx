"use client";

import { useState } from "react";
import { useFamilySafe } from "../../context";
import { Plus, Trash2 } from "lucide-react";

export default function Expenses() {
  const { data, updateData } = useFamilySafe();
  const [isAdding, setIsAdding] = useState(false);
  
  const [amount, setAmount] = useState("");
  const [budgetId, setBudgetId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !budgetId || !date || !description) return;
    
    const budget = data.budgets.find(b => b.id === budgetId);
    if (!budget) return;

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      budgetId,
      category: budget.category,
      amount: Number(amount),
      date,
      description,
      paymentMethod
    };
    
    updateData({ expenses: [newItem, ...data.expenses] });
    setIsAdding(false);
    setAmount("");
    setDescription("");
  };

  const handleDelete = (id: string) => {
    updateData({ expenses: data.expenses.filter(item => item.id !== id) });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Expense Tracker</h1>
        <p className="text-muted">Record actual spending and automatically connect it to your budget.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-primary text-primary-foreground">
          <p className="text-sm font-medium mb-1 opacity-90">Total Expenses</p>
          <h2 className="text-3xl font-bold">₹{totalExpenses.toLocaleString()}</h2>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Recent Expenses</h3>
          {!isAdding && (
            <button className="btn btn-primary text-sm gap-2" onClick={() => setIsAdding(true)}>
              <Plus size={16} /> Add Expense
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className="bg-neutral-light p-4 rounded-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (₹)</label>
              <input 
                type="number" 
                min="0"
                className="input" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category (Budget)</label>
              <select 
                className="input" 
                value={budgetId}
                onChange={(e) => setBudgetId(e.target.value)}
                required
              >
                <option value="" disabled>Select Budget Category</option>
                {data.budgets.map(b => (
                  <option key={b.id} value={b.id}>{b.category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input 
                type="date" 
                className="input" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input 
                type="text" 
                className="input" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select 
                className="input" 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Bank Transfer</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="flex gap-2 md:col-span-2 justify-end mt-2">
              <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Expense</button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-muted">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Method</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.expenses.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-4 text-muted text-sm">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="py-4 font-medium">{item.description}</td>
                  <td className="py-4"><span className="bg-neutral-light px-2 py-1 rounded text-xs">{item.category}</span></td>
                  <td className="py-4 text-sm">{item.paymentMethod}</td>
                  <td className="py-4 font-bold text-red">₹{item.amount.toLocaleString()}</td>
                  <td className="py-4 text-right">
                    <button onClick={() => handleDelete(item.id)} className="text-red hover:bg-red-light p-1 rounded">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {data.expenses.length === 0 && !isAdding && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    No expenses recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
