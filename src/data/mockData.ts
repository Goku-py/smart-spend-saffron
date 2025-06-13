export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  merchant: string;
  date: string;
  method: string;
  type: 'expense' | 'income';
}

export interface Budget {
  category: string;
  allocated: number;
  spent: number;
  icon: string;
}

export interface Notification {
  id: string;
  type: 'alert' | 'bill' | 'insight';
  title: string;
  message: string;
  time: string;
  urgent: boolean;
}

export const sampleExpenses: Expense[] = [
  { id: '1', amount: 150, category: 'Food & Dining', description: 'Coffee', merchant: 'Cafe Coffee Day', date: '2024-06-07', method: 'UPI', type: 'expense' },
  { id: '2', amount: 2500, category: 'Kirana', description: 'Groceries', merchant: 'BigBasket', date: '2024-06-06', method: 'UPI', type: 'expense' },
  { id: '3', amount: 599, category: 'Utilities', description: 'Mobile Recharge', merchant: 'Jio', date: '2024-06-05', method: 'UPI', type: 'expense' },
  { id: '4', amount: 85, category: 'Travel', description: 'Auto Fare', merchant: 'Uber', date: '2024-06-05', method: 'UPI', type: 'expense' },
  { id: '5', amount: 320, category: 'Food & Dining', description: 'Lunch', merchant: 'Swiggy', date: '2024-06-04', method: 'UPI', type: 'expense' },
  { id: '6', amount: 1200, category: 'Shopping', description: 'Clothes', merchant: 'Myntra', date: '2024-06-03', method: 'Card', type: 'expense' },
  { id: '7', amount: 450, category: 'Healthcare', description: 'Medicine', merchant: 'Apollo Pharmacy', date: '2024-06-02', method: 'Cash', type: 'expense' },
  { id: '8', amount: 800, category: 'Kirana', description: 'Vegetables', merchant: 'Local Market', date: '2024-06-02', method: 'Cash', type: 'expense' },
  { id: '9', amount: 200, category: 'Travel', description: 'Bus Ticket', merchant: 'RedBus', date: '2024-06-01', method: 'UPI', type: 'expense' },
  { id: '10', amount: 75, category: 'Food & Dining', description: 'Tea & Snacks', merchant: 'Local Cafe', date: '2024-06-01', method: 'Cash', type: 'expense' },
];

export const budgetData: Budget[] = [
  { category: 'Kirana', allocated: 5000, spent: 3200, icon: '🛒' },
  { category: 'Food & Dining', allocated: 3000, spent: 2800, icon: '🍽️' },
  { category: 'Travel', allocated: 2000, spent: 1200, icon: '🚗' },
  { category: 'Utilities', allocated: 1500, spent: 1100, icon: '📱' },
  { category: 'Festivals', allocated: 2000, spent: 500, icon: '🎉' },
  { category: 'Healthcare', allocated: 1000, spent: 450, icon: '🏥' },
  { category: 'Shopping', allocated: 2500, spent: 1200, icon: '🛍️' },
];

export const notifications: Notification[] = [
  { 
    id: '1', 
    type: 'alert', 
    title: 'Budget Alert', 
    message: 'Food & Dining budget 93% used', 
    time: '2 hours ago', 
    urgent: true 
  },
  { 
    id: '2', 
    type: 'bill', 
    title: 'Bill Reminder', 
    message: 'Jio recharge ₹599 due tomorrow', 
    time: '1 day ago', 
    urgent: false 
  },
  { 
    id: '3', 
    type: 'insight', 
    title: 'AI Insight', 
    message: 'You can save ₹800 by cooking at home twice a week', 
    time: '2 days ago', 
    urgent: false 
  },
  { 
    id: '4', 
    type: 'alert', 
    title: 'Overspending Alert', 
    message: 'You have exceeded your weekend budget by ₹500', 
    time: '3 days ago', 
    urgent: true 
  },
  { 
    id: '5', 
    type: 'insight', 
    title: 'Savings Tip', 
    message: 'Switch to monthly Jio plan, save ₹240', 
    time: '1 week ago', 
    urgent: false 
  },
];

export const chartData = {
  categorySpending: [
    { name: 'Kirana', value: 3200, percentage: 35 },
    { name: 'Food & Dining', value: 2300, percentage: 25 },
    { name: 'Travel', value: 1800, percentage: 20 },
    { name: 'Utilities', value: 1400, percentage: 15 },
    { name: 'Others', value: 450, percentage: 5 },
  ],
  monthlyTrends: [
    { month: 'Jan', spending: 22000 },
    { month: 'Feb', spending: 19500 },
    { month: 'Mar', spending: 21800 },
    { month: 'Apr', spending: 20200 },
    { month: 'May', spending: 18500 },
  ],
};

export const categories = [
  'Kirana',
  'Food & Dining',
  'Travel',
  'Utilities',
  'Festivals',
  'Healthcare',
  'Shopping',
  'Entertainment',
];

export const paymentMethods = ['UPI', 'Cash', 'Card', 'Net Banking'];
