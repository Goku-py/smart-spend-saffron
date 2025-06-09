import { useState, useEffect } from 'react';
import { useAuth } from '../App';

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

export const useAnalytics = (timeRange: string = 'month') => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // In demo mode, use mock data with some dynamic elements
        const mockExpenses = [
          { category: 'Kirana', amount: 3200, date: '2024-01-15' },
          { category: 'Food & Dining', amount: 2800, date: '2024-01-14' },
          { category: 'Travel', amount: 1200, date: '2024-01-13' },
          { category: 'Utilities', amount: 1100, date: '2024-01-12' },
          { category: 'Shopping', amount: 800, date: '2024-01-11' },
          { category: 'Healthcare', amount: 450, date: '2024-01-10' },
        ];

        // Process category data
        const categoryTotals = mockExpenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
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

        // Generate monthly trends (last 5 months)
        const monthlyTrends: TrendData[] = [
          { month: 'Sep', spending: 22000 + Math.random() * 2000 },
          { month: 'Oct', spending: 19500 + Math.random() * 2000 },
          { month: 'Nov', spending: 21800 + Math.random() * 2000 },
          { month: 'Dec', spending: 20200 + Math.random() * 2000 },
          { month: 'Jan', spending: totalSpending },
        ];

        const averageDaily = totalSpending / 30; // Assuming 30 days
        const topCategory = categorySpending[0]?.name || 'N/A';
        const lastMonthSpending = monthlyTrends[monthlyTrends.length - 2]?.spending || 0;
        const savingsThisMonth = Math.max(0, lastMonthSpending - totalSpending);

        setAnalyticsData({
          categorySpending,
          monthlyTrends,
          totalSpending,
          averageDaily,
          topCategory,
          savingsThisMonth
        });

      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, timeRange]);

  const refreshAnalytics = () => {
    if (user) {
      setLoading(true);
      // Trigger a re-fetch by updating a dependency
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

// Helper function to process real expense data when available
export const processExpenseData = (expenses: any[]): AnalyticsData => {
  if (!expenses || expenses.length === 0) {
    return {
      categorySpending: [],
      monthlyTrends: [],
      totalSpending: 0,
      averageDaily: 0,
      topCategory: 'N/A',
      savingsThisMonth: 0
    };
  }

  // Group by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
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

  // Group by month for trends
  const monthlyTotals = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short' });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const monthlyTrends: TrendData[] = Object.entries(monthlyTotals)
    .map(([month, spending]) => ({ month, spending }))
    .sort((a, b) => new Date(`${a.month} 1, 2024`).getTime() - new Date(`${b.month} 1, 2024`).getTime());

  const averageDaily = totalSpending / 30;
  const topCategory = categorySpending[0]?.name || 'N/A';
  const savingsThisMonth = 0; // Would need historical data to calculate

  return {
    categorySpending,
    monthlyTrends,
    totalSpending,
    averageDaily,
    topCategory,
    savingsThisMonth
  };
};