"use client";

import { useState } from "react";
import { useFamilySafe } from "../../context";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function FamilyIncome() {
  const { data, updateData } = useFamilySafe();
  const [isAdding, setIsAdding] = useState(false);
  const [newSource, setNewSource] = useState("");
  const [newAmount, setNewAmount] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSource, setEditSource] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0);

  const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#f97316'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource || !newAmount) return;
    
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      source: newSource,
      amount: Number(newAmount)
    };
    
    updateData({ income: [...data.income, newItem] });
    setIsAdding(false);
    setNewSource("");
    setNewAmount("");
  };

  const handleDelete = (id: string) => {
    updateData({ income: data.income.filter(item => item.id !== id) });
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditSource(item.source);
    setEditAmount(item.amount.toString());
  };

  const saveEdit = () => {
    updateData({
      income: data.income.map(item => 
        item.id === editingId 
          ? { ...item, source: editSource, amount: Number(editAmount) }
          : item
      )
    });
    setEditingId(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Family Income</h1>
        <p className="text-muted">Manage all sources of your family's monthly income.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card md:col-span-1 bg-primary text-primary-foreground">
          <h3 className="font-bold text-lg mb-2 opacity-90">Total Monthly Income</h3>
          <h2 className="text-4xl font-bold">₹{totalIncome.toLocaleString()}</h2>
        </div>

        <div className="card md:col-span-2">
          <h3 className="font-bold mb-4">Income Breakdown</h3>
          <div style={{ height: 200 }}>
            {data.income.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.income}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="amount"
                    nameKey="source"
                  >
                    {data.income.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted">
                No income sources added yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Income Sources</h3>
          {!isAdding && (
            <button className="btn btn-primary text-sm gap-2" onClick={() => setIsAdding(true)}>
              <Plus size={16} /> Add Income
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className="bg-neutral-light p-4 rounded-md mb-6 flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium mb-1">Source (e.g. Husband, Wife, Business)</label>
              <input 
                type="text" 
                className="input" 
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                required
              />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-1">Amount (₹)</label>
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
                <th className="pb-3 font-medium">Source</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.income.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-4">
                    {editingId === item.id ? (
                      <input 
                        type="text" 
                        className="input py-1 px-2 text-sm w-full max-w-[200px]" 
                        value={editSource} 
                        onChange={(e) => setEditSource(e.target.value)} 
                      />
                    ) : (
                      <span className="font-medium">{item.source}</span>
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
              {data.income.length === 0 && !isAdding && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-muted">
                    No income sources found. Add your first income source above.
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
