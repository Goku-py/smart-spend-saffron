
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import AddExpenseModal from "@/components/AddExpenseModal";
import { sampleExpenses, categories } from "../data/mockData";

const Expenses = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExpenses = sampleExpenses.filter(expense => {
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
            <p className="text-gray-600">Track and manage your transactions</p>
          </div>
          <Button 
            onClick={() => setShowAddExpense(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white"
          >
            Add Expense
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₹{totalExpenses.toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-600">Total Expenses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{filteredExpenses.length}</div>
                <div className="text-sm text-gray-600">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">₹{Math.round(totalExpenses / filteredExpenses.length)}</div>
                <div className="text-sm text-gray-600">Avg. Amount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">7</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {expense.category === 'Food & Dining' ? '🍽️' :
                       expense.category === 'Kirana' ? '🛒' :
                       expense.category === 'Travel' ? '🚗' :
                       expense.category === 'Utilities' ? '📱' :
                       expense.category === 'Healthcare' ? '🏥' :
                       expense.category === 'Shopping' ? '🛍️' : '💳'}
                    </div>
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-gray-600">
                        {expense.merchant} • {expense.category}
                      </div>
                      <div className="text-xs text-gray-500">
                        {expense.date} • {expense.method}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-red-600">
                      -₹{expense.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="flex space-x-2 mt-1">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Delete
                      </Button>
                    </div>
                  </div>
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

export default Expenses;
