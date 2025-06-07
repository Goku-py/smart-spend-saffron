
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useAuth } from "../App";
import { sampleExpenses, budgetData } from "../data/mockData";
import AddExpenseModal from "@/components/AddExpenseModal";

const Dashboard = () => {
  const { user } = useAuth();
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  const totalBudget = budgetData.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgetData.reduce((sum, budget) => sum + budget.spent, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = (totalSpent / totalBudget) * 100;

  const recentTransactions = sampleExpenses.slice(0, 5);

  const aiInsights = [
    "💡 You spend ₹3,200 more on weekends",
    "💡 Switch to monthly Jio plan, save ₹240", 
    "💡 Grocery spending down 12% this month"
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            नमस्ते, {user?.name || 'User'}! 🙏
          </h1>
          <p className="text-gray-600">Here's your spending overview for June 2024</p>
        </div>

        {/* Budget Overview */}
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Monthly Budget</span>
              <Badge variant={spentPercentage > 80 ? "destructive" : "default"}>
                {spentPercentage.toFixed(0)}% Used
              </Badge>
            </CardTitle>
            <CardDescription>
              ₹{remaining.toLocaleString('en-IN')} remaining of ₹{totalBudget.toLocaleString('en-IN')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress 
              value={spentPercentage} 
              className="h-3 mb-3"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Spent: ₹{totalSpent.toLocaleString('en-IN')}</span>
              <span>Budget: ₹{totalBudget.toLocaleString('en-IN')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => setShowAddExpense(true)}
            className="h-20 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">💳</div>
              <div>Add Expense</div>
            </div>
          </Button>
          <Button 
            variant="outline"
            className="h-20 border-orange-200 hover:bg-orange-50"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">🎯</div>
              <div>Set Budget</div>
            </div>
          </Button>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {transaction.category === 'Food & Dining' ? '🍽️' :
                       transaction.category === 'Kirana' ? '🛒' :
                       transaction.category === 'Travel' ? '🚗' :
                       transaction.category === 'Utilities' ? '📱' : '💳'}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-gray-600">{transaction.merchant} • {transaction.method}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">-₹{transaction.amount}</div>
                    <div className="text-xs text-gray-500">{transaction.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddExpenseModal 
        open={showAddExpense} 
        onClose={() => setShowAddExpense(false)} 
      />
    </Layout>
  );
};

export default Dashboard;
