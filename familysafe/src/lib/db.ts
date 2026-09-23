export type Income = {
  id: string;
  source: string;
  amount: number;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  month: string; // e.g. "2024-03"
};

export type Expense = {
  id: string;
  budgetId: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
};

export type EmergencyFund = {
  currentAmount: number;
  monthlyContribution: number;
  targetMonths: number;
};

const INITIAL_DATA = {
  income: [
    { id: 'inc1', source: 'Husband', amount: 60000 },
    { id: 'inc2', source: 'Wife', amount: 40000 }
  ],
  budgets: [
    { id: 'b1', category: 'Grocery', amount: 20000, month: '2024-03' },
    { id: 'b2', category: 'Travel', amount: 8000, month: '2024-03' },
    { id: 'b3', category: 'Education', amount: 15000, month: '2024-03' },
    { id: 'b4', category: 'Medical', amount: 5000, month: '2024-03' },
    { id: 'b5', category: 'Shopping', amount: 7000, month: '2024-03' },
    { id: 'b6', category: 'Tour', amount: 5000, month: '2024-03' },
    { id: 'b7', category: 'Insurance', amount: 5000, month: '2024-03' }
  ],
  expenses: [
    // Safely within budget (Grocery: 20000, Spent: 12000)
    { id: 'e1', budgetId: 'b1', category: 'Grocery', amount: 5000, date: '2024-03-05', description: 'Supermarket', paymentMethod: 'UPI' },
    { id: 'e2', budgetId: 'b1', category: 'Grocery', amount: 7000, date: '2024-03-12', description: 'Supermarket', paymentMethod: 'Credit Card' },
    
    // Close to budget (Travel: 8000, Spent: 7500)
    { id: 'e3', budgetId: 'b2', category: 'Travel', amount: 3000, date: '2024-03-02', description: 'Fuel', paymentMethod: 'Cash' },
    { id: 'e4', budgetId: 'b2', category: 'Travel', amount: 4500, date: '2024-03-15', description: 'Fuel', paymentMethod: 'Credit Card' },
    
    // Exceeding budget (Medical: 5000, Spent: 6000)
    { id: 'e5', budgetId: 'b4', category: 'Medical', amount: 6000, date: '2024-03-10', description: 'Clinic Visit & Meds', paymentMethod: 'UPI' }
  ],
  emergencyFund: {
    currentAmount: 75000,
    monthlyContribution: 5000,
    targetMonths: 6
  }
};

export const getDB = () => {
  if (typeof window === 'undefined') return INITIAL_DATA; // Server-side fallback
  const data = localStorage.getItem('familySafeDB');
  if (data) {
    return JSON.parse(data);
  }
  // Initialize if empty
  localStorage.setItem('familySafeDB', JSON.stringify(INITIAL_DATA));
  return INITIAL_DATA;
};

export const saveDB = (data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('familySafeDB', JSON.stringify(data));
  }
};

export const resetDB = () => {
  saveDB(INITIAL_DATA);
};
