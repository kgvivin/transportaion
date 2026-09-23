"use client";

import { useState } from "react";
import { useFamilySafe } from "../../context";

export default function EmergencyFund() {
  const { data, updateData } = useFamilySafe();
  
  const [currentAmount, setCurrentAmount] = useState(data.emergencyFund.currentAmount.toString());
  const [monthlyContribution, setMonthlyContribution] = useState(data.emergencyFund.monthlyContribution.toString());
  const [targetMonths, setTargetMonths] = useState(data.emergencyFund.targetMonths.toString());

  const totalEssentialExpenses = data.budgets
    .filter(b => ['Grocery', 'Children Education', 'Medical', 'Medical Insurance', 'Rent', 'Utilities', 'Day-to-Day Travel'].includes(b.category))
    .reduce((sum, item) => sum + item.amount, 0);

  // Fallback to total expenses if essential calculation is too low
  const baseMonthlyExpenses = totalEssentialExpenses > 0 ? totalEssentialExpenses : 50000;
  
  const emergencyTarget = baseMonthlyExpenses * Number(targetMonths);
  const progress = emergencyTarget > 0 ? (Number(currentAmount) / emergencyTarget) * 100 : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({
      emergencyFund: {
        currentAmount: Number(currentAmount),
        monthlyContribution: Number(monthlyContribution),
        targetMonths: Number(targetMonths)
      }
    });
    alert("Emergency Fund settings saved successfully!");
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Emergency Fund</h1>
        <p className="text-muted">Prepare for the unexpected by building your safety net.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="font-bold text-lg mb-6">Fund Overview</h3>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted font-medium">Current Fund</span>
              <span className="font-bold text-lg">₹{Number(currentAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted font-medium">Target ({targetMonths} months of essential expenses)</span>
              <span className="font-bold text-muted">₹{emergencyTarget.toLocaleString()}</span>
            </div>
            
            <div className="w-full bg-neutral-light rounded-full h-4 mb-2">
              <div 
                className="bg-green h-4 rounded-full" 
                style={{ width: `${Math.min(100, progress)}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-muted font-medium">{progress.toFixed(1)}%</p>
          </div>

          <div className="bg-blue-light text-blue p-4 rounded-md">
            <h4 className="font-bold mb-1">Estimated Essential Expenses</h4>
            <p className="text-sm">Based on your budget, your essential monthly expenses are approximately <strong>₹{baseMonthlyExpenses.toLocaleString()}</strong>.</p>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-lg mb-6">Update Fund Details</h3>
          
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Emergency Savings (₹)</label>
              <input 
                type="number" 
                min="0"
                className="input" 
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Target Months of Essential Expenses</label>
              <select 
                className="input" 
                value={targetMonths}
                onChange={(e) => setTargetMonths(e.target.value)}
                required
              >
                <option value="3">3 Months (Minimum recommended)</option>
                <option value="6">6 Months (Standard recommended)</option>
                <option value="9">9 Months (Highly secure)</option>
                <option value="12">12 Months (Maximum security)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Monthly Target Contribution (₹)</label>
              <input 
                type="number" 
                min="0"
                className="input" 
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary mt-4">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}
