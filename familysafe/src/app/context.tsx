"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getDB, saveDB, Income, Budget, Expense, EmergencyFund } from "@/lib/db";

type FamilySafeData = {
  income: Income[];
  budgets: Budget[];
  expenses: Expense[];
  emergencyFund: EmergencyFund;
};

type FamilySafeContextType = {
  data: FamilySafeData;
  updateData: (newData: Partial<FamilySafeData>) => void;
};

const defaultData: FamilySafeData = {
  income: [],
  budgets: [],
  expenses: [],
  emergencyFund: { currentAmount: 0, monthlyContribution: 0, targetMonths: 6 },
};

const FamilySafeContext = createContext<FamilySafeContextType>({
  data: defaultData,
  updateData: () => {},
});

export const FamilySafeProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<FamilySafeData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from DB on mount
    const dbData = getDB();
    setData(dbData);
    setIsLoaded(true);
  }, []);

  const updateData = (newData: Partial<FamilySafeData>) => {
    const updated = { ...data, ...newData };
    setData(updated);
    saveDB(updated);
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <FamilySafeContext.Provider value={{ data, updateData }}>
      {children}
    </FamilySafeContext.Provider>
  );
};

export const useFamilySafe = () => useContext(FamilySafeContext);
