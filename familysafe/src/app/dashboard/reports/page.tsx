"use client";

import { useState } from "react";
import { useFamilySafe } from "../../context";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Download, FileText } from "lucide-react";

export default function Reports() {
  const { data } = useFamilySafe();
  const [selectedMonth, setSelectedMonth] = useState("2024-03");

  const totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = data.budgets.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  
  const savings = totalIncome - totalExpenses;
  
  const overspentCount = data.budgets.filter(budget => {
    const spent = data.expenses
      .filter(e => e.budgetId === budget.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return spent > budget.amount;
  }).length;

  const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#f97316'];

  // Expense breakdown for Pie Chart
  const expenseBreakdown = data.budgets.map(budget => {
    const spent = data.expenses
      .filter(e => e.budgetId === budget.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: budget.category, value: spent };
  }).filter(item => item.value > 0);

  // Mock trend data
  const trendData = [
    { name: 'Week 1', Spent: totalExpenses * 0.2 },
    { name: 'Week 2', Spent: totalExpenses * 0.4 },
    { name: 'Week 3', Spent: totalExpenses * 0.7 },
    { name: 'Week 4', Spent: totalExpenses }
  ];

  const handleExport = () => {
    alert("Exporting report to PDF...");
    // In a real app, this would use html2pdf or similar to generate a PDF.
  };

  return (
    <div>
      <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="page-title">Monthly Report</h1>
          <p className="text-muted">Detailed view of your family's finances for a specific month.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            className="input py-2"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="2024-01">January 2024</option>
            <option value="2024-02">February 2024</option>
            <option value="2024-03">March 2024 (Current)</option>
          </select>
          <button className="btn btn-outline gap-2" onClick={handleExport}>
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center p-4">
          <p className="text-muted text-sm mb-1">Total Income</p>
          <h3 className="font-bold text-xl text-green">₹{totalIncome.toLocaleString()}</h3>
        </div>
        <div className="card text-center p-4">
          <p className="text-muted text-sm mb-1">Total Budget</p>
          <h3 className="font-bold text-xl text-blue">₹{totalBudget.toLocaleString()}</h3>
        </div>
        <div className="card text-center p-4">
          <p className="text-muted text-sm mb-1">Actual Expenses</p>
          <h3 className={`font-bold text-xl ${totalExpenses > totalIncome ? 'text-red' : ''}`}>
            ₹{totalExpenses.toLocaleString()}
          </h3>
        </div>
        <div className="card text-center p-4">
          <p className="text-muted text-sm mb-1">Net Savings</p>
          <h3 className={`font-bold text-xl ${savings < 0 ? 'text-red' : 'text-green'}`}>
            ₹{savings.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <FileText className="text-primary" size={20} /> Expenses Breakdown
          </h3>
          <div style={{ height: 300 }}>
            {expenseBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted">No expenses to display</div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold mb-6">Spending Trend</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="Spent" stroke="var(--color-blue)" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card bg-neutral-light border-none flex items-center justify-between p-6">
        <div>
          <h3 className="font-bold text-lg mb-1">Month Performance</h3>
          <p className="text-muted text-sm">
            You used <strong>{Math.round((totalExpenses / Math.max(totalBudget, 1)) * 100)}%</strong> of your total budget.
          </p>
          <p className="text-muted text-sm">
            {overspentCount} categories were over budget.
          </p>
        </div>
        <div className={`text-3xl font-bold ${savings > 0 ? 'text-green' : 'text-red'}`}>
          {savings > 0 ? 'Good' : 'Needs Attention'}
        </div>
      </div>
    </div>
  );
}
