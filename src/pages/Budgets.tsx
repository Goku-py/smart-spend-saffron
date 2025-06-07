
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { budgetData } from "../data/mockData";

const Budgets = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const totalBudget = budgetData.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgetData.reduce((sum, budget) => sum + budget.spent, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Budget Management</h1>
            <p className="text-gray-600">Set and track your spending limits</p>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
            Create Budget
          </Button>
        </div>

        {/* Budget Overview */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle>Monthly Budget Overview</CardTitle>
            <CardDescription>Your overall budget performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">₹{totalBudget.toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-600">Total Budget</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">₹{totalSpent.toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">₹{(totalBudget - totalSpent).toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
            </div>
            <Progress 
              value={(totalSpent / totalBudget) * 100} 
              className="mt-4 h-3"
            />
          </CardContent>
        </Card>

        {/* Category Budgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgetData.map((budget) => {
            const percentage = (budget.spent / budget.allocated) * 100;
            const remaining = budget.allocated - budget.spent;
            const status = percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good';
            
            return (
              <Card key={budget.category} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{budget.icon}</span>
                      <CardTitle className="text-lg">{budget.category}</CardTitle>
                    </div>
                    <Badge 
                      variant={status === 'over' ? 'destructive' : status === 'warning' ? 'default' : 'secondary'}
                    >
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Spent: ₹{budget.spent.toLocaleString('en-IN')}</span>
                      <span>Budget: ₹{budget.allocated.toLocaleString('en-IN')}</span>
                    </div>
                    
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={`h-2 ${
                        status === 'over' ? 'bg-red-100' : 
                        status === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}
                    />
                    
                    <div className="flex justify-between items-center">
                      <div className={`text-sm font-medium ${
                        remaining < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {remaining >= 0 ? 'Remaining: ' : 'Over by: '}
                        ₹{Math.abs(remaining).toLocaleString('en-IN')}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                {status === 'over' && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                    OVER BUDGET
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Budget Tips */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Budget Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-800">
                  🎯 Your Food & Dining budget is 93% used. Consider cooking at home to save money.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <p className="text-sm text-green-800">
                  ✅ Great job staying within your Travel budget this month!
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-800">
                  ⚠️ Festival season is approaching. Consider setting aside ₹500/week for Diwali expenses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Budgets;
