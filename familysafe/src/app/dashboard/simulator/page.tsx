"use client";

import { useState } from "react";
import { useFamilySafe } from "../../context";
import { AlertTriangle, Activity } from "lucide-react";

export default function EmergencySimulator() {
  const { data } = useFamilySafe();
  
  const [emergencyType, setEmergencyType] = useState("Medical");
  const [emergencyCost, setEmergencyCost] = useState("");
  const [insuranceCoverage, setInsuranceCoverage] = useState("");
  const [otherFunds, setOtherFunds] = useState("");

  const currentEmergencyFund = data.emergencyFund.currentAmount;
  
  const cost = Number(emergencyCost) || 0;
  const coverage = Number(insuranceCoverage) || 0;
  const other = Number(otherFunds) || 0;
  
  const fundingGap = cost - coverage - currentEmergencyFund - other;
  const hasGap = fundingGap > 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Emergency Simulator</h1>
        <p className="text-muted">Simulate unexpected financial emergencies to see if you are prepared.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Activity className="text-primary" /> Emergency Details
          </h3>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Emergency Type</label>
              <select 
                className="input" 
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
              >
                <option>Medical</option>
                <option>Job Loss</option>
                <option>Home Repair</option>
                <option>Vehicle Repair</option>
                <option>Education</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estimated Cost (₹)</label>
              <input 
                type="number" 
                min="0"
                className="input" 
                value={emergencyCost}
                onChange={(e) => setEmergencyCost(e.target.value)}
                placeholder="e.g. 200000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Insurance Coverage (₹)</label>
              <input 
                type="number" 
                min="0"
                className="input" 
                value={insuranceCoverage}
                onChange={(e) => setInsuranceCoverage(e.target.value)}
                placeholder="e.g. 100000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Other Available Funds (₹)</label>
              <input 
                type="number" 
                min="0"
                className="input" 
                value={otherFunds}
                onChange={(e) => setOtherFunds(e.target.value)}
                placeholder="e.g. 10000"
              />
            </div>
            
            <div className="bg-blue-light p-3 rounded text-sm text-blue mt-2">
              <strong>Note:</strong> This is a planning calculation based on user-entered values. It does not recommend specific financial products.
            </div>
          </div>
        </div>

        <div className="card bg-neutral-light border-none">
          <h3 className="font-bold text-lg mb-6 text-center">Simulation Results</h3>
          
          <div className="bg-white p-6 rounded-md shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <span className="text-muted font-medium">Emergency Cost:</span>
              <span className="font-bold text-xl">₹{cost.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted">Insurance Covered:</span>
              <span className="text-green">- ₹{coverage.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted">Emergency Fund:</span>
              <span className="text-green">- ₹{currentEmergencyFund.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <span className="text-muted">Other Funds:</span>
              <span className="text-green">- ₹{other.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Remaining Gap:</span>
              <span className={`font-bold text-2xl ${hasGap ? 'text-red' : 'text-green'}`}>
                {hasGap ? `₹${fundingGap.toLocaleString()}` : '₹0'}
              </span>
            </div>
          </div>

          {cost > 0 && (
            <div className={`p-4 rounded-md flex gap-3 items-start ${hasGap ? 'bg-red-light text-red border border-red' : 'bg-green-light text-green border border-green'}`}>
              <AlertTriangle className="shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold mb-1">{hasGap ? 'Funding Gap Detected' : 'Fully Covered'}</h4>
                <p className="text-sm">
                  {hasGap 
                    ? `You have a funding gap of ₹${fundingGap.toLocaleString()}. You may need to explore personal loans, credit cards, or borrowing from family/friends.` 
                    : `Great! This emergency can be covered by your entered available resources without going into debt.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
