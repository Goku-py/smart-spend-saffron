import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import DemoModeIndicator from "@/components/DemoModeIndicator";
import AIInsights from "@/components/AIInsights";
import { useAuth } from "../hooks/useAuth";
import { useCurrency } from "../contexts/CurrencyContext";
import { useNotifications } from "../contexts/NotificationContext";
import { sampleExpenses, budgetData } from "../data/mockData";
import ExpenseModal from "@/components/ExpenseModal";

const Dashboard = () => {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  const totalBudget = budgetData.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgetData.reduce((sum, budget) => sum + budget.spent, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = (totalSpent / totalBudget) * 100;

  const recentTransactions = sampleExpenses.slice(0, 5);

  const handleAddExpense = () => {
    setShowAddExpense(true);
  };

  const handleSetBudget = () => {
    navigate('/budgets');
  };

  const handleExpenseAdded = (expenseData: any) => {
    // Add notification for budget check
    const category = budgetData.find(b => b.category === expenseData.category);
    if (category) {
      const newSpent = category.spent + expenseData.amount;
      const percentage = (newSpent / category.allocated) * 100;
      
      if (percentage > 80) {
        addNotification({
          type: 'budget_alert',
          title: `${category.category} Budget Alert`,
          message: `You've used ${Math.round(percentage)}% of your ${category.category} budget`,
          isUrgent: percentage > 90,
          icon: '⚠️',
          actionUrl: '/budgets'
        });
      }
    }
    setShowAddExpense(false);
  };

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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Demo Mode Indicator */}
        <DemoModeIndicator />

        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold">
            {t('namaste')}, {getUserDisplayName()}! 🙏
          </h1>
          <p className="text-muted-foreground">Here's your spending overview for June 2024</p>
        </div>

        {/* Budget Overview */}
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('monthlyBudget')}</span>
              <Badge variant={spentPercentage > 80 ? "destructive" : "default"}>
                {spentPercentage.toFixed(0)}% Used
              </Badge>
            </CardTitle>
            <CardDescription>
              {formatCurrency(remaining)} {t('remaining')} of {formatCurrency(totalBudget)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress 
              value={spentPercentage} 
              className="h-3 mb-3"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('spent')}: {formatCurrency(totalSpent)}</span>
              <span>{t('budget')}: {formatCurrency(totalBudget)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={handleAddExpense}
            className="h-20 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">💳</div>
              <div>{t('addExpense')}</div>
            </div>
          </Button>
          <Button 
            onClick={handleSetBudget}
            variant="outline"
            className="h-20 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">🎯</div>
              <div>{t('setBudget')}</div>
            </div>
          </Button>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recentTransactions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {transaction.category === 'Food & Dining' ? '🍽️' :
                       transaction.category === 'Kirana' ? '🛒' :
                       transaction.category === 'Travel' ? '🚗' :
                       transaction.category === 'Utilities' ? '📱' : '💳'}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">{transaction.merchant} • {transaction.method}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">-{formatCurrency(transaction.amount)}</div>
                    <div className="text-xs text-muted-foreground">{transaction.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <AIInsights />
      </div>

      <ExpenseModal 
        open={showAddExpense} 
        onClose={() => setShowAddExpense(false)}
        onExpenseAdded={handleExpenseAdded}
      />
    </Layout>
  );
};

export default Dashboard;