"use client";

import { useState } from "react";
import { useFamilySafe } from "../../context";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MonthlyBudget() {
  const { data, updateData } = useFamilySafe();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const totalBudget = data.budgets.reduce((sum, item) => sum + item.amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || !newAmount) return;
    
    // Default to current month for hackathon simplicity
    const currentMonth = new Date().toISOString().substring(0, 7);
    
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: newCategory,
      amount: Number(newAmount),
      month: currentMonth
    };
    
    updateData({ budgets: [...data.budgets, newItem] });
    setIsAdding(false);
    setNewCategory("");
    setNewAmount("");
  };

  const handleDelete = (id: string) => {
    updateData({ budgets: data.budgets.filter(item => item.id !== id) });
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditCategory(item.category);
    setEditAmount(item.amount.toString());
  };

  const saveEdit = () => {
    updateData({
      budgets: data.budgets.map(item => 
        item.id === editingId 
          ? { ...item, category: editCategory, amount: Number(editAmount) }
          : item
      )
    });
    setEditingId(null);
  };

  const chartData = [...data.budgets].sort((a, b) => b.amount - a.amount);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Monthly Budget</h1>
        <p className="text-muted">Set spending limits for different categories.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card md:col-span-1 bg-primary text-primary-foreground">
          <h3 className="font-bold text-lg mb-2 opacity-90">Total Monthly Budget</h3>
          <h2 className="text-4xl font-bold">₹{totalBudget.toLocaleString()}</h2>
        </div>

        <div className="card md:col-span-2">
          <h3 className="font-bold mb-4">Budget Distribution</h3>
          <div style={{ height: 200 }}>
            {data.budgets.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="var(--color-blue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted">
                No budget categories added yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Budget Categories</h3>
          {!isAdding && (
            <button className="btn btn-primary text-sm gap-2" onClick={() => setIsAdding(true)}>
              <Plus size={16} /> Add Budget Category
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className="bg-neutral-light p-4 rounded-md mb-6 flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium mb-1">Category (e.g. Grocery, Travel, Education)</label>
              <input 
                type="text" 
                className="input" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
                list="defaultCategories"
              />
              <datalist id="defaultCategories">
                <option value="Grocery" />
                <option value="Day-to-Day Travel" />
                <option value="Children Education" />
                <option value="Medical" />
                <option value="Shopping" />
                <option value="Tour / Vacation" />
                <option value="Medical Insurance" />
                <option value="Utilities" />
                <option value="Rent" />
                <option value="Entertainment" />
              </datalist>
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-1">Monthly Limit (₹)</label>
              <input 
                type="number" 
                min="0"
                className="input" 
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-muted">
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Monthly Limit</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.budgets.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-4">
                    {editingId === item.id ? (
                      <input 
                        type="text" 
                        className="input py-1 px-2 text-sm w-full max-w-[200px]" 
                        value={editCategory} 
                        onChange={(e) => setEditCategory(e.target.value)} 
                      />
                    ) : (
                      <span className="font-medium">{item.category}</span>
                    )}
                  </td>
                  <td className="py-4">
                    {editingId === item.id ? (
                      <input 
                        type="number" 
                        min="0"
                        className="input py-1 px-2 text-sm w-full max-w-[150px]" 
                        value={editAmount} 
                        onChange={(e) => setEditAmount(e.target.value)} 
                      />
                    ) : (
                      <span>₹{item.amount.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    {editingId === item.id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={saveEdit} className="text-green hover:bg-green-light p-1 rounded">
                          <Check size={18} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-muted hover:bg-neutral-light p-1 rounded">
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(item)} className="text-blue hover:bg-blue-light p-1 rounded">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-red hover:bg-red-light p-1 rounded">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {data.budgets.length === 0 && !isAdding && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-muted">
                    No budget categories found. Add your first budget category above.
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
