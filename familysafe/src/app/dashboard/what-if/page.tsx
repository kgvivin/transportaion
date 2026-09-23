"use client";

import { useState } from "react";
import { useFamilySafe } from "../../context";
import { HelpCircle, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function WhatIfPlanner() {
  const { data } = useFamilySafe();
  
  const [scenarioType, setScenarioType] = useState("husband_zero");
  
  const currentIncome = data.income.reduce((sum, item) => sum + item.amount, 0);
  const currentExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  const currentBalance = currentIncome - currentExpenses;

  // Simulator state
  const husbandIncomeObj = data.income.find(i => i.source.toLowerCase().includes('husband'));
  const wifeIncomeObj = data.income.find(i => i.source.toLowerCase().includes('wife'));
  
  const husbandIncome = husbandIncomeObj ? husbandIncomeObj.amount : 60000;
  const wifeIncome = wifeIncomeObj ? wifeIncomeObj.amount : 40000;

  const [customIncomeChange, setCustomIncomeChange] = useState("0");
  const [customExpenseChange, setCustomExpenseChange] = useState("0");

  let simIncome = currentIncome;
  let simExpenses = currentExpenses;

  if (scenarioType === "husband_zero") {
    simIncome -= husbandIncome;
  } else if (scenarioType === "wife_zero") {
    simIncome -= wifeIncome;
  } else if (scenarioType === "increase_expenses") {
    simExpenses += 10000;
  } else if (scenarioType === "custom") {
    simIncome += Number(customIncomeChange) || 0;
    simExpenses += Number(customExpenseChange) || 0;
  }

  const simBalance = simIncome - simExpenses;
  
  const chartData = [
    {
      name: 'Current',
      Income: currentIncome,
      Expenses: currentExpenses,
      Balance: Math.max(0, currentBalance),
    },
    {
      name: 'Simulated',
      Income: simIncome,
      Expenses: simExpenses,
      Balance: Math.max(0, simBalance),
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">What-If Planner</h1>
        <p className="text-muted">Interactive scenario simulator to test changes in income or expenses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="card lg:col-span-1">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <HelpCircle className="text-primary" /> Select Scenario
          </h3>
          
          <div className="flex flex-col gap-3 mb-6">
            <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-neutral-light transition-colors">
              <input 
                type="radio" 
                name="scenario" 
                value="husband_zero" 
                checked={scenarioType === "husband_zero"}
                onChange={(e) => setScenarioType(e.target.value)}
              />
              <span>What if Husband income becomes zero?</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-neutral-light transition-colors">
              <input 
                type="radio" 
                name="scenario" 
                value="wife_zero" 
                checked={scenarioType === "wife_zero"}
                onChange={(e) => setScenarioType(e.target.value)}
              />
              <span>What if Wife income becomes zero?</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-neutral-light transition-colors">
              <input 
                type="radio" 
                name="scenario" 
                value="increase_expenses" 
                checked={scenarioType === "increase_expenses"}
                onChange={(e) => setScenarioType(e.target.value)}
              />
              <span>What if monthly expenses increase by ₹10,000?</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-neutral-light transition-colors">
              <input 
                type="radio" 
                name="scenario" 
                value="custom" 
                checked={scenarioType === "custom"}
                onChange={(e) => setScenarioType(e.target.value)}
              />
              <span>Custom simulation</span>
            </label>
          </div>

          {scenarioType === "custom" && (
            <div className="bg-neutral-light p-4 rounded-md flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Change in Income (₹)</label>
                <input 
                  type="number" 
                  className="input" 
                  value={customIncomeChange}
                  onChange={(e) => setCustomIncomeChange(e.target.value)}
                  placeholder="e.g. -20000 or 5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Change in Expenses (₹)</label>
                <input 
                  type="number" 
                  className="input" 
                  value={customExpenseChange}
                  onChange={(e) => setCustomExpenseChange(e.target.value)}
                  placeholder="e.g. 15000 or -5000"
                />
              </div>
            </div>
          )}
        </div>

        <div className="card lg:col-span-2">
          <h3 className="font-bold text-lg mb-6">Comparison Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            <div className="p-4 border rounded-md">
              <p className="text-muted text-sm mb-1">Total Income</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg text-muted line-through">₹{currentIncome.toLocaleString()}</span>
                <ArrowRight size={16} className="text-muted" />
                <span className={`text-2xl font-bold ${simIncome < currentIncome ? 'text-red' : 'text-green'}`}>
                  ₹{simIncome.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="text-muted text-sm mb-1">Total Expenses</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg text-muted line-through">₹{currentExpenses.toLocaleString()}</span>
                <ArrowRight size={16} className="text-muted" />
                <span className={`text-2xl font-bold ${simExpenses > currentExpenses ? 'text-red' : 'text-blue'}`}>
                  ₹{simExpenses.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="text-muted text-sm mb-1">Monthly Balance</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg text-muted line-through">₹{currentBalance.toLocaleString()}</span>
                <ArrowRight size={16} className="text-muted" />
                <span className={`text-2xl font-bold ${simBalance < 0 ? 'text-red' : 'text-green'}`}>
                  ₹{simBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="Income" fill="var(--color-green)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="var(--color-yellow)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Balance" fill="var(--color-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
