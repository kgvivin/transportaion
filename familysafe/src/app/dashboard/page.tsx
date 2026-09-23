"use client";

import { useFamilySafe } from "../context";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data } = useFamilySafe();

  // Calculate totals
  const totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = data.budgets.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  const savings = totalIncome - totalExpenses;
  const deficit = totalExpenses > totalIncome ? totalExpenses - totalIncome : 0;
  
  // Aggregate budget vs spent
  const budgetOverview = data.budgets.map(budget => {
    const spent = data.expenses
      .filter(e => e.budgetId === budget.id)
      .reduce((sum, e) => sum + e.amount, 0);
    const remaining = budget.amount - spent;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    
    let status = 'GREEN';
    let color = 'var(--color-green)';
    if (percentage > 100) {
      status = 'RED';
      color = 'var(--color-red)';
    } else if (percentage >= 75) {
      status = 'YELLOW';
      color = 'var(--color-yellow)';
    }

    return {
      category: budget.category,
      budget: budget.amount,
      spent,
      remaining,
      percentage,
      status,
      color
    };
  });

  const overspentCount = budgetOverview.filter(b => b.status === 'RED').length;
  
  const emergencyTarget = (totalExpenses) * data.emergencyFund.targetMonths; // simplistic target
  const emergencyProgress = emergencyTarget > 0 ? (data.emergencyFund.currentAmount / emergencyTarget) * 100 : 0;

  const chartData = budgetOverview.map(b => ({
    name: b.category,
    Budget: b.budget,
    Spent: b.spent
  }));

  const pieData = [
    { name: 'Spent', value: totalExpenses, color: 'var(--color-blue)' },
    { name: 'Remaining', value: Math.max(0, totalBudget - totalExpenses), color: 'var(--color-green)' }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Family Dashboard</h1>
        <p className="text-muted">Overview of your family's financial health.</p>
      </div>

      {deficit > 0 && (
        <div className="bg-red-light border border-red text-red p-4 rounded-md mb-6 flex items-start gap-3">
          <AlertCircle className="mt-0.5" />
          <div>
            <h3 className="font-bold">Warning: Overspending Detected</h3>
            <p>Your monthly expenses exceed your income by ₹{deficit.toLocaleString()}.</p>
          </div>
        </div>
      )}

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-muted text-sm font-medium mb-1">Total Income</p>
          <h2 className="text-2xl font-bold text-green">₹{totalIncome.toLocaleString()}</h2>
        </div>
        <div className="card">
          <p className="text-muted text-sm font-medium mb-1">Total Expenses</p>
          <h2 className={`text-2xl font-bold ${totalExpenses > totalIncome ? 'text-red' : 'text-blue'}`}>
            ₹{totalExpenses.toLocaleString()}
          </h2>
        </div>
        <div className="card">
          <p className="text-muted text-sm font-medium mb-1">Total Savings</p>
          <h2 className="text-2xl font-bold">
            ₹{Math.max(0, savings).toLocaleString()}
          </h2>
        </div>
        <div className="card">
          <p className="text-muted text-sm font-medium mb-1">Overspent Categories</p>
          <h2 className={`text-2xl font-bold ${overspentCount > 0 ? 'text-red' : 'text-green'}`}>
            {overspentCount}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Charts */}
        <div className="card lg:col-span-2">
          <h3 className="font-bold text-lg mb-4">Budget vs Actual</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Budget" fill="var(--color-blue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="var(--color-yellow)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergency Fund Mini */}
        <div className="card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-4">Emergency Fund</h3>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted">Current</span>
              <span className="font-bold">₹{data.emergencyFund.currentAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-muted">Target ({data.emergencyFund.targetMonths} months)</span>
              <span className="text-muted">₹{emergencyTarget.toLocaleString()}</span>
            </div>
            
            <div className="w-full bg-neutral-light rounded-full h-2.5 mb-4">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, emergencyProgress)}%` }}
              ></div>
            </div>
            <p className="text-sm text-center text-muted">
              {emergencyProgress.toFixed(1)}% of goal reached
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-bold text-sm mb-2">Smart Insights</h4>
            <ul className="text-sm space-y-2 text-muted">
              {overspentCount > 0 ? (
                <li className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-red shrink-0 mt-0.5" />
                  <span>You have exceeded budget in {overspentCount} categories.</span>
                </li>
              ) : (
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green shrink-0 mt-0.5" />
                  <span>All categories are within budget!</span>
                </li>
              )}
              {savings > 0 && (
                <li className="flex items-start gap-2">
                  <TrendingUp size={16} className="text-green shrink-0 mt-0.5" />
                  <span>Great job! You've saved ₹{savings.toLocaleString()} this month.</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Budget Category Overview Table */}
      <div className="card overflow-x-auto">
        <h3 className="font-bold text-lg mb-4">Budget Category Overview</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-sm text-muted">
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Budget</th>
              <th className="pb-3 font-medium">Spent</th>
              <th className="pb-3 font-medium">Remaining</th>
              <th className="pb-3 font-medium">Usage</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {budgetOverview.map((item) => (
              <tr key={item.category} className="border-b last:border-0">
                <td className="py-3 font-medium">{item.category}</td>
                <td className="py-3">₹{item.budget.toLocaleString()}</td>
                <td className="py-3">₹{item.spent.toLocaleString()}</td>
                <td className={`py-3 ${item.remaining < 0 ? 'text-red font-bold' : ''}`}>
                  {item.remaining < 0 
                    ? `₹${Math.abs(item.remaining).toLocaleString()} overspent` 
                    : `₹${item.remaining.toLocaleString()} remaining`}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-neutral-light rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ width: `${Math.min(100, item.percentage)}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted w-8">{Math.round(item.percentage)}%</span>
                  </div>
                </td>
                <td className="py-3">
                  <span 
                    className="px-2 py-1 rounded text-xs font-bold" 
                    style={{ backgroundColor: `${item.color}20`, color: item.color }}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
