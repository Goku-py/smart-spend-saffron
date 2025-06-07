
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import NavigationBar from "@/components/NavigationBar";
import BudgetOverviewCard from "@/components/BudgetOverviewCard";
import RecentTransactions from "@/components/RecentTransactions";
import AIInsights from "@/components/AIInsights";
import QuickActions from "@/components/QuickActions";

const Dashboard = () => {
  const [currentMonth] = useState(new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }));

  // Mock data for Indian context
  const totalBudget = 25000;
  const totalSpent = 18750;
  const remaining = totalBudget - totalSpent;
  const spentPercentage = (totalSpent / totalBudget) * 100;

  const budgetCategories = [
    { name: "Kirana", allocated: 5000, spent: 3800, icon: "🛒" },
    { name: "Food & Dining", allocated: 4000, spent: 4200, icon: "🍽️" },
    { name: "Travel", allocated: 3000, spent: 2100, icon: "🚗" },
    { name: "Utilities", allocated: 2500, spent: 2500, icon: "💡" },
    { name: "Festivals", allocated: 5000, spent: 3000, icon: "🎉" },
    { name: "Healthcare", allocated: 2000, spent: 1500, icon: "🏥" },
  ];

  const recentTransactions = [
    { id: 1, description: "BigBasket Groceries", amount: -850, category: "Kirana", date: "Today", time: "2:30 PM", icon: "🛒" },
    { id: 2, description: "Swiggy Order", amount: -320, category: "Food & Dining", date: "Today", time: "1:15 PM", icon: "🍔" },
    { id: 3, description: "Jio Recharge", amount: -599, category: "Utilities", date: "Yesterday", time: "6:45 PM", icon: "📱" },
    { id: 4, description: "Auto to Office", amount: -80, category: "Travel", date: "Yesterday", time: "9:30 AM", icon: "🛺" },
    { id: 5, description: "Diwali Decorations", amount: -1200, category: "Festivals", date: "2 days ago", time: "4:20 PM", icon: "🪔" },
  ];

  const aiInsights = [
    {
      type: "warning" as const,
      title: "Food Budget Alert",
      message: "You've exceeded your food budget by ₹200 this month. Consider cooking at home to save ₹2,000.",
      icon: "⚠️"
    },
    {
      type: "tip" as const,
      title: "Festival Savings",
      message: "Diwali is in 45 days! Start saving ₹333/day to reach your ₹15,000 festival budget.",
      icon: "💡"
    },
    {
      type: "achievement" as const,
      title: "Great Progress!",
      message: "You've saved ₹800 on groceries by shopping at local kirana stores.",
      icon: "🎉"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">नमस्ते! Welcome back</h1>
          <p className="text-gray-600">Here's your spending overview for {currentMonth}</p>
        </div>

        {/* Monthly Overview */}
        <Card className="card-indian mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl">Monthly Budget</span>
              <Badge variant={spentPercentage > 80 ? "destructive" : "default"} className="text-sm">
                {spentPercentage.toFixed(0)}% Used
              </Badge>
            </CardTitle>
            <CardDescription>
              ₹{remaining.toLocaleString('en-IN')} remaining of ₹{totalBudget.toLocaleString('en-IN')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress 
                value={spentPercentage} 
                className="h-3"
                style={{
                  background: spentPercentage > 80 ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)' : 
                             spentPercentage > 60 ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)' :
                             'linear-gradient(90deg, #138808 0%, #32CD32 100%)'
                }}
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Spent: ₹{totalSpent.toLocaleString('en-IN')}</span>
                <span className="text-gray-600">Budget: ₹{totalBudget.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <QuickActions />

        {/* Budget Categories */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Budgets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetCategories.map((category) => (
              <BudgetOverviewCard key={category.name} category={category} />
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <AIInsights insights={aiInsights} />

        {/* Recent Transactions */}
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;
