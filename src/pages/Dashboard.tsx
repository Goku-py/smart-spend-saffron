import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "../hooks/useAuth";
import { useCurrency } from "../contexts/CurrencyContext";
import { useNotifications } from "../contexts/NotificationContext";
import { TrendingUp, TrendingDown, AlertTriangle, Target, CreditCard, Calendar, PlusCircle, Loader2, Car, Lightbulb, Gamepad, HeartPulse, ShoppingCart, Utensils, Smartphone, Wallet, Coffee, Landmark } from "lucide-react";
import AIInsights from "@/components/AIInsights";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import ExpenseModal from "@/components/ExpenseModal";
import { Expense } from "@/data/mockData"; // Import Expense interface
import { cn } from "@/lib/utils";

// Dummy recent transactions data - updated to use the Expense interface
const recentTransactions: Expense[] = [
  { id: '1', date: '2025-01-20', description: 'Groceries', category: 'Food', amount: 1200, type: 'expense', merchant: 'SuperMart', method: 'Card' },
  { id: '2', date: '2025-01-19', description: 'Salary', category: 'Income', amount: 50000, type: 'income', merchant: 'Employer', method: 'Bank Transfer' },
  { id: '3', date: '2025-01-18', description: 'Electricity Bill', category: 'Utilities', amount: 2500, type: 'expense', merchant: 'Electricity Board', method: 'UPI' },
  { id: '4', date: '2025-01-17', description: 'Dinner with friends', category: 'Social', amount: 800, type: 'expense', merchant: 'Restaurant', method: 'Cash' },
  { id: '5', date: '2025-01-16', description: 'Freelance Payment', category: 'Income', amount: 15000, type: 'income', merchant: 'Client', method: 'Bank Transfer' },
];

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { formatCurrency } = useCurrency();
  const { addNotification } = useNotifications();
  
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactions, setTransactions] = useState<Expense[]>(recentTransactions); // Use Expense interface

  // Dummy data for demonstration - UPDATED TO MATCH IMAGE
  const monthlyBudget = 25000; // Total budget as per image
  const spent = 18750; // As per image
  const remaining = monthlyBudget - spent; // Calculate remaining
  const budgetProgress = (spent / monthlyBudget) * 100; // 75% as per image

  const savingsGoal = 15000; // As per image
  const achievedSavings = 12500; // As per image
  const remainingSavings = savingsGoal - achievedSavings;
  const savingsProgress = (achievedSavings / savingsGoal) * 100; // ~83.33% -> 83%

  const monthlyIncome = 75000; // As per image

  const budgetStatusUsed = 75; // As per image

  // Dummy category data - UPDATED TO MATCH IMAGE
  const categories = [
    {
      title: "Kirana",
      icon: "ShoppingCart", // Replaced with actual icon component below
      spent: 5200,
      budget: 8000,
      percentage: 65,
    },
    {
      title: "Food & Dining",
      icon: "Utensils",
      spent: 4800,
      budget: 6000,
      percentage: 80,
    },
    {
      title: "Travel",
      icon: "Car",
      spent: 3200,
      budget: 4000,
      percentage: 80,
    },
    {
      title: "Utilities",
      icon: "Lightbulb",
      spent: 2800,
      budget: 3000,
      percentage: 93,
    },
    {
      title: "Entertainment",
      icon: "Gamepad",
      spent: 1500,
      budget: 2500,
      percentage: 60,
    },
    {
      title: "Healthcare",
      icon: "HeartPulse",
      spent: 1250,
      budget: 1500,
      percentage: 83,
    },
  ];

  const insights = [
    {
      id: '1',
      title: t('insights.highSpendingCategory.title'),
      description: t('insights.highSpendingCategory.description'),
      value: 'Food & Dining',
      icon: <TrendingUp className="h-5 w-5 text-red-500" />,
      type: 'warning' as const,
      action: () => toast({ title: "Action", description: "Navigate to transactions for Food & Dining" })
    },
    {
      id: '2',
      title: t('insights.savingOpportunity.title'),
      description: t('insights.savingOpportunity.description'),
      value: 'Cancel unused subscriptions',
      icon: <TrendingDown className="h-5 w-5 text-green-500" />,
      type: 'success' as const,
      action: () => toast({ title: "Action", description: "Open subscription management tips" })
    },
    {
      id: '3',
      title: t('insights.upcomingBill.title'),
      description: t('insights.upcomingBill.description'),
      value: 'Rent (Feb 1st)',
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      type: 'info' as const,
      action: () => toast({ title: "Action", description: "Navigate to bills reminder" })
    },
    {
      id: '4',
      title: t('insights.goalProgress.title'),
      description: t('insights.goalProgress.description'),
      value: 'New Phone (70%)',
      icon: <Target className="h-5 w-5 text-purple-500" />,
      type: 'success' as const,
      action: () => toast({ title: "Action", description: "View savings goals" })
    },
    {
      id: '5',
      title: t('insights.creditCardDue.title'),
      description: t('insights.creditCardDue.description'),
      value: '₹5,000 (Jan 25th)',
      icon: <CreditCard className="h-5 w-5 text-orange-500" />,
      type: 'warning' as const,
      action: () => toast({ title: "Action", description: "Navigate to credit card payments" })
    },
    {
      id: '6',
      title: t('insights.unusualSpending.title'),
      description: t('insights.unusualSpending.description'),
      value: 'High spend in entertainment',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      type: 'warning' as const,
      action: () => toast({ title: "Action", description: "Review entertainment spending" })
    },
  ];

  // Function to handle adding a new expense
  const handleAddExpense = (newExpense: Partial<Expense>) => {
    const expenseWithId: Expense = {
      ...newExpense,
      id: Date.now().toString(), // Generate a unique ID
      date: newExpense.date || new Date().toISOString().split('T')[0],
      amount: newExpense.amount || 0,
      category: newExpense.category || 'Other',
      description: newExpense.description || 'N/A',
      merchant: newExpense.merchant || 'N/A',
      method: newExpense.method || 'Other',
      type: newExpense.type || 'expense', // Default to expense if not provided
    };
    setTransactions(prev => [expenseWithId, ...prev]);
    toast({
      title: "Transaction Added!",
      description: `${formatCurrency(expenseWithId.amount)} for ${expenseWithId.description}`,
    });
  };

  useEffect(() => {
    // Initialize transactions with dummy data on component mount
    setTransactions(recentTransactions);
  }, []);

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <span className="ml-3 text-lg text-muted-foreground">{t('dashboard.loading')}</span>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t('dashboard.accessDenied.title')}</h2>
          <p className="text-muted-foreground mb-6">{t('dashboard.accessDenied.description')}</p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700">
              {t('dashboard.accessDenied.signInButton')}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Main Content */}
      <div className="flex-1 p-4 sm:px-6 sm:py-0">
        {/* Dashboard Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b pb-4 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, demo!</h1>
          <div className="flex items-center gap-2">
            <Button className="shrink-0" variant="outline" onClick={() => setShowAddTransaction(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </div>
        </div>

        {/* Updated below for "Namaste, demo! 👋" and the date */}
        <div className="py-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Namaste, demo! 👋</h2>
          <p className="text-muted-foreground">Here's your financial overview for January 2025</p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 py-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Monthly Budget Overview - Updated values and icon */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
              {/* This icon needs to be replaced with a proper one from the image - leaving current for now */}
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(spent)}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                of {formatCurrency(monthlyBudget)} spent
              </p>
              <Progress
                value={budgetProgress}
                className="h-2 mt-3"
              />
              <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400 mt-1">
                <span>{budgetProgress.toFixed(0)}% used</span>
                <span>{formatCurrency(remaining)} left</span>
              </div>
            </CardContent>
          </Card>

          {/* Savings Goal - Replaced Total Balance card */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 animate-slide-up animation-delay-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
              {/* Icon for savings goal (mountain/growth) - using TrendingUp for now */}
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(achievedSavings)}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                of {formatCurrency(savingsGoal)} goal
              </p>
              <Progress
                value={savingsProgress}
                className="h-2 mt-3"
              />
              <div className="flex justify-between text-xs text-green-600 dark:text-green-400 mt-1">
                <span>{savingsProgress.toFixed(0)}% achieved</span>
                <span>{formatCurrency(remainingSavings)} to go</span>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Income - Updated values */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 animate-slide-up animation-delay-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <Landmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatCurrency(monthlyIncome)}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                25% of income spent
              </p>
              <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+5% from last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Budget Status - Replaced Monthly Expenses card */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300 animate-slide-up animation-delay-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
              {/* Icon for budget status (AlertTriangle) */}
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-green-700 dark:text-green-300">Good</span>
                <p className="text-sm text-muted-foreground">{budgetStatusUsed}% used</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Budget on track</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                <span>1 days remaining</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Spending Overview */}
        <div className="py-4">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Category Spending Overview</h2>
          <p className="text-muted-foreground mb-4">Track your spending across different categories</p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const remainingCategory = category.budget - category.spent;
              const IconComponent = {
                ShoppingCart: CreditCard,
                Utensils: TrendingUp,
                Car: Car,
                Lightbulb: Lightbulb,
                Gamepad: Gamepad,
                HeartPulse: HeartPulse,
              }[category.icon]; // Map string to actual icon component

              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 animate-slide-up">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      {IconComponent && <IconComponent className="mr-2 h-4 w-4 text-muted-foreground" />}
                      {category.title}
                    </CardTitle>
                    <Badge
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-semibold",
                        {
                          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200": category.percentage > 90,
                          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200": category.percentage > 75 && category.percentage <= 90,
                          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200": category.percentage <= 75,
                        }
                      )}
                    >
                      {category.percentage}%
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>Spent: {formatCurrency(category.spent)}</p>
                      <p>Budget: {formatCurrency(category.budget)}</p>
                    </div>
                    <Progress
                      value={category.percentage}
                      className="h-2 mt-3"
                      color={cn({
                        "bg-red-500": category.percentage > 90,
                        "bg-orange-500": category.percentage > 75 && category.percentage <= 90,
                        "bg-green-500": category.percentage <= 75,
                      })}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatCurrency(remainingCategory)} left</span>
                      <span>{category.percentage}% used</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="py-4">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Recent Transactions</h2>
          <p className="text-muted-foreground mb-4">Your latest spending activity</p>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => {
              const TransactionIconComponent = {
                'Food & Dining': Utensils,
                'Kirana': ShoppingCart,
                'Utilities': Smartphone,
                'Travel': Car,
                'Social': Coffee, // Assuming 'Social' could be 'Coffee' based on image
              }[transaction.category] || CreditCard; // Default icon

              return (
                <Card key={transaction.id} className="flex items-center justify-between p-4 hover:shadow-lg transition-all duration-300 animate-slide-in-right">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <TransactionIconComponent className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.merchant} • {transaction.category} • {transaction.method}
                      </p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "font-semibold",
                    transaction.type === 'expense' ? "text-red-600" : "text-green-600"
                  )}>
                    {transaction.type === 'expense' ? "-" : "+"}{formatCurrency(transaction.amount)}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="py-4">
          <h2 className="text-2xl font-bold tracking-tight mb-2">AI Insights</h2>
          <div className="flex justify-end mt-4 mb-2">
            <Button variant="link" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 p-0">
              Refresh
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            {/* Weekend Spending Pattern Insight */}
            <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  <CardTitle className="text-md font-semibold text-yellow-800 dark:text-yellow-200">Weekend Spending Pattern</CardTitle>
                  <Badge className="ml-auto bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">80% confidence</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-yellow-700 dark:text-yellow-300">
                  You typically spend ₹3,200 more on weekends. Consider setting weekend budgets.
                </CardDescription>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">Potential impact: ₹3,200</p>
                <Button className="mt-4 float-right bg-yellow-600 hover:bg-yellow-700 text-white">Take Action</Button>
              </CardContent>
            </Card>

            {/* Subscription Optimization Insight */}
            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <CardTitle className="text-md font-semibold text-green-800 dark:text-green-200">Subscription Optimization</CardTitle>
                  <Badge className="ml-auto bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">90% confidence</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-green-700 dark:text-green-300">
                  Switch to annual plans for streaming services to save ₹2,400 yearly.
                </CardDescription>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">Potential impact: ₹2,400</p>
                <Button className="mt-4 float-right bg-green-600 hover:bg-green-700 text-white">Take Action</Button>
              </CardContent>
            </Card>

            {/* Grocery Spending Trend Insight */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                  <CardTitle className="text-md font-semibold text-blue-800 dark:text-blue-200">Grocery Spending Trend</CardTitle>
                  <Badge className="ml-auto bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200">85% confidence</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  Your grocery spending decreased by 12% this month. Great job!
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

      </div >

      <ExpenseModal
        open={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onExpenseAdded={handleAddExpense}
        mode="add"
      />
    </Layout>
  );
};

export default Dashboard;