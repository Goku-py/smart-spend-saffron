
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

interface TrendData {
  month: string;
  spending: number;
}

interface AnalyticsData {
  categorySpending: CategoryData[];
  monthlyTrends: TrendData[];
  totalSpending: number;
  averageDaily: number;
  topCategory: string;
  savingsThisMonth: number;
}

interface ExpenseData {
  amount: number;
  category: string;
  date: string;
}

export const useAnalytics = (timeRange: string = 'month') => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get real expenses from localStorage (demo mode) or database
      const expenses = getStoredExpenses();
      
      if (!expenses || expenses.length === 0) {
        // Use fallback mock data if no real expenses
        setAnalyticsData(getMockAnalytics());
        setLoading(false);
        return;
      }

      // Process real expense data
      const analytics = processExpenseData(expenses, timeRange);
      setAnalyticsData(analytics);

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
      // Fallback to mock data on error
      setAnalyticsData(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user, timeRange]);

  const refreshAnalytics = () => {
    if (user) {
      setLoading(true);
      setTimeout(() => {
        fetchAnalytics();
      }, 500);
    }
  };

  return {
    data: analyticsData,
    loading,
    error,
    refresh: refreshAnalytics
  };
};

// Get expenses from localStorage (demo mode)
const getStoredExpenses = (): ExpenseData[] => {
  try {
    const stored = localStorage.getItem('smartspend_expenses');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading stored expenses:', error);
    return [];
  }
};

// Process real expense data into analytics
const processExpenseData = (expenses: ExpenseData[], timeRange: string): AnalyticsData => {
  // Filter expenses based on time range
  const filteredExpenses = filterExpensesByTimeRange(expenses, timeRange);
  
  if (filteredExpenses.length === 0) {
    return getMockAnalytics();
  }

  // Group by category
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    const amount = Number(expense.amount) || 0;
    acc[expense.category] = (acc[expense.category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const totalSpending = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  const categorySpending: CategoryData[] = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / totalSpending) * 100)
    }))
    .sort((a, b) => b.value - a.value);

  // Generate monthly trends
  const monthlyTrends = generateMonthlyTrends(filteredExpenses);

  const averageDaily = totalSpending / getDaysInPeriod(timeRange);
  const topCategory = categorySpending[0]?.name || 'N/A';
  
  // Calculate savings (compare with previous period)
  const previousPeriodExpenses = getPreviousPeriodExpenses(expenses, timeRange);
  const previousTotal = previousPeriodExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const savingsThisMonth = Math.max(0, previousTotal - totalSpending);

  return {
    categorySpending,
    monthlyTrends,
    totalSpending,
    averageDaily,
    topCategory,
    savingsThisMonth
  };
};

// Filter expenses by time range
const filterExpensesByTimeRange = (expenses: ExpenseData[], timeRange: string): ExpenseData[] => {
  const now = new Date();
  const startDate = new Date();

  switch (timeRange) {
    case 'month':
      startDate.setMonth(now.getMonth(), 1);
      break;
    case 'lastMonth':
      startDate.setMonth(now.getMonth() - 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      return expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= startDate && expDate <= endDate;
      });
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear(), 0, 1);
      break;
    default:
      startDate.setMonth(now.getMonth(), 1);
  }

  return expenses.filter(exp => new Date(exp.date) >= startDate);
};

// Generate monthly trends from expenses
const generateMonthlyTrends = (expenses: ExpenseData[]): TrendData[] => {
  const monthlyTotals = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthName, spending: 0 };
    }
    acc[monthKey].spending += Number(expense.amount) || 0;
    
    return acc;
  }, {} as Record<string, TrendData>);

  return Object.values(monthlyTotals)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Last 6 months
};

// Get previous period expenses for comparison
const getPreviousPeriodExpenses = (expenses: ExpenseData[], timeRange: string): ExpenseData[] => {
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();

  switch (timeRange) {
    case 'month':
      startDate.setMonth(now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 6);
      endDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1, 0, 1);
      endDate.setFullYear(now.getFullYear() - 1, 11, 31);
      break;
    default:
      return [];
  }

  return expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate >= startDate && expDate <= endDate;
  });
};

// Get number of days in current period
const getDaysInPeriod = (timeRange: string): number => {
  const now = new Date();
  
  switch (timeRange) {
    case 'month':
      return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    case 'quarter':
      return 90;
    case 'year':
      return 365;
    default:
      return 30;
  }
};

// Fallback mock analytics
const getMockAnalytics = (): AnalyticsData => ({
  categorySpending: [
    { name: 'Kirana', value: 3200, percentage: 35 },
    { name: 'Food & Dining', value: 2300, percentage: 25 },
    { name: 'Travel', value: 1800, percentage: 20 },
    { name: 'Utilities', value: 1400, percentage: 15 },
    { name: 'Others', value: 450, percentage: 5 },
  ],
  monthlyTrends: [
    { month: 'Aug', spending: 22000 },
    { month: 'Sep', spending: 19500 },
    { month: 'Oct', spending: 21800 },
    { month: 'Nov', spending: 20200 },
    { month: 'Dec', spending: 18500 },
    { month: 'Jan', spending: 9150 },
  ],
  totalSpending: 9150,
  averageDaily: 305,
  topCategory: 'Kirana',
  savingsThisMonth: 1500
});
