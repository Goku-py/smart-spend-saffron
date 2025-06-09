import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import DemoModeIndicator from "@/components/DemoModeIndicator";
import AIInsights from "@/components/AIInsights";
import { useAuth } from "../hooks/useAuth";
import { useCurrency } from "../contexts/CurrencyContext";
import { useNotifications } from "../contexts/NotificationContext";
import { TrendingUp, TrendingDown, AlertTriangle, Target, CreditCard, Calendar } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();
  const { addNotification } = useNotifications();
  
  // Enhanced dashboard data with animations
  const [dashboardData, setDashboardData] = useState({
    totalBudget: 25000,
    totalSpent: 18750,
    monthlyIncome: 75000,
    savingsGoal: 15000,
    currentSavings: 12500,
    recentTransactions: [
      { id: '1', amount: 150, category: 'Food & Dining', description: 'Coffee', merchant: 'Cafe Coffee Day', date: '2024-06-07', method: 'UPI', icon: '☕' },
      { id: '2', amount: 2500, category: 'Kirana', description: 'Groceries', merchant: 'BigBasket', date: '2024-06-06', method: 'UPI', icon: '🛒' },
      { id: '3', amount: 599, category: 'Utilities', description: 'Mobile Recharge', merchant: 'Jio', date: '2024-06-05', method: 'UPI', icon: '📱' },
      { id: '4', amount: 85, category: 'Travel', description: 'Auto Fare', merchant: 'Uber', date: '2024-06-05', method: 'UPI', icon: '🚗' },
      { id: '5', amount: 320, category: 'Food & Dining', description: 'Lunch', merchant: 'Swiggy', date: '2024-06-04', method: 'UPI', icon: '🍽️' },
    ],
    categoryBreakdown: [
      { category: 'Kirana', spent: 5200, budget: 8000, percentage: 65, color: 'bg-blue-500', icon: '🛒' },
      { category: 'Food & Dining', spent: 4800, budget: 6000, percentage: 80, color: 'bg-orange-500', icon: '🍽️' },
      { category: 'Travel', spent: 3200, budget: 4000, percentage: 80, color: 'bg-green-500', icon: '🚗' },
      { category: 'Utilities', spent: 2800, budget: 3000, percentage: 93, color: 'bg-purple-500', icon: '📱' },
      { category: 'Entertainment', spent: 1500, budget: 2500, percentage: 60, color: 'bg-pink-500', icon: '🎬' },
      { category: 'Healthcare', spent: 1250, budget: 1500, percentage: 83, color: 'bg-red-500', icon: '🏥' },
    ]
  });

  const remaining = dashboardData.totalBudget - dashboardData.totalSpent;
  const spentPercentage = (dashboardData.totalSpent / dashboardData.totalBudget) * 100;
  const savingsPercentage = (dashboardData.currentSavings / dashboardData.savingsGoal) * 100;

  // Get user display name from email or user metadata
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Animated counter effect
  const [animatedValues, setAnimatedValues] = useState({
    totalSpent: 0,
    remaining: 0,
    currentSavings: 0
  });

  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedValues({
        totalSpent: Math.round(dashboardData.totalSpent * easeOutQuart),
        remaining: Math.round(remaining * easeOutQuart),
        currentSavings: Math.round(dashboardData.currentSavings * easeOutQuart)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [dashboardData.totalSpent, remaining, dashboardData.currentSavings]);

  // Check for budget alerts
  useEffect(() => {
    dashboardData.categoryBreakdown.forEach(category => {
      if (category.percentage > 90) {
        addNotification({
          type: 'budget_alert',
          title: `${category.category} Budget Alert`,
          message: `You've used ${category.percentage}% of your ${category.category} budget`,
          isUrgent: true,
          icon: category.icon,
          actionUrl: '/budgets'
        });
      }
    });
  }, [dashboardData.categoryBreakdown, addNotification]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Demo Mode Indicator */}
        <DemoModeIndicator />

        {/* Welcome Header with Animation */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            {t('namaste')}, {getUserDisplayName()}! 🙏
          </h1>
          <p className="text-muted-foreground text-lg">Here's your financial overview for January 2025</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Monthly Budget Overview */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 animate-slide-up">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-700 dark:text-blue-300 text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Monthly Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(animatedValues.totalSpent)}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                of {formatCurrency(dashboardData.totalBudget)} spent
              </p>
              <Progress 
                value={spentPercentage} 
                className="h-2 mt-3"
              />
              <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400 mt-1">
                <span>{spentPercentage.toFixed(0)}% used</span>
                <span>{formatCurrency(animatedValues.remaining)} left</span>
              </div>
            </CardContent>
          </Card>

          {/* Savings Progress */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-green-700 dark:text-green-300 text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Savings Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(animatedValues.currentSavings)}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                of {formatCurrency(dashboardData.savingsGoal)} goal
              </p>
              <Progress 
                value={savingsPercentage} 
                className="h-2 mt-3"
              />
              <div className="flex justify-between text-xs text-green-600 dark:text-green-400 mt-1">
                <span>{savingsPercentage.toFixed(0)}% achieved</span>
                <span>{formatCurrency(dashboardData.savingsGoal - dashboardData.currentSavings)} to go</span>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Income */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-700 dark:text-purple-300 text-sm font-medium flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatCurrency(dashboardData.monthlyIncome)}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                {((dashboardData.totalSpent / dashboardData.monthlyIncome) * 100).toFixed(0)}% of income spent
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 dark:text-green-400">+5% from last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Budget Status */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-700 dark:text-orange-300 text-sm font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Budget Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge variant={spentPercentage > 90 ? "destructive" : spentPercentage > 75 ? "default" : "secondary"}>
                  {spentPercentage > 90 ? 'Critical' : spentPercentage > 75 ? 'Warning' : 'Good'}
                </Badge>
                <span className="text-sm text-orange-600 dark:text-orange-400">
                  {spentPercentage.toFixed(0)}% used
                </span>
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                {spentPercentage > 90 
                  ? 'Budget limit nearly reached' 
                  : spentPercentage > 75 
                    ? 'Approaching budget limit' 
                    : 'Budget on track'
                }
              </p>
              <div className="flex items-center mt-2">
                {spentPercentage > 75 ? (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                )}
                <span className="text-xs text-muted-foreground">
                  {15 - new Date().getDate()} days remaining
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-orange-600" />
              Category Spending Overview
            </CardTitle>
            <CardDescription>Track your spending across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.categoryBreakdown.map((category, index) => (
                <div 
                  key={category.category} 
                  className="p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-sm">{category.category}</span>
                    </div>
                    <Badge 
                      variant={category.percentage > 90 ? "destructive" : category.percentage > 75 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {category.percentage}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent:</span>
                      <span className="font-medium">{formatCurrency(category.spent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">{formatCurrency(category.budget)}</span>
                    </div>
                    
                    <Progress 
                      value={category.percentage} 
                      className="h-2"
                    />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatCurrency(category.budget - category.spent)} left</span>
                      <span>{category.percentage}% used</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-600" />
              {t('recentTransactions')}
            </CardTitle>
            <CardDescription>Your latest spending activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentTransactions.map((transaction, index) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {transaction.icon}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.merchant} • {transaction.category}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.date} • {transaction.method}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-red-600 dark:text-red-400">
                      -{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <AIInsights />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;