
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from "@/components/Layout";
import { chartData } from "../data/mockData";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeChart, setActiveChart] = useState('category');

  const COLORS = ['#FF7518', '#138808', '#1E40AF', '#F59E0B', '#EF4444'];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-600">Analyze your spending patterns and trends</p>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chart Tabs */}
        <Card>
          <CardHeader>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveChart('category')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeChart === 'category' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Spending by Category
              </button>
              <button
                onClick={() => setActiveChart('trends')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeChart === 'trends' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Monthly Trends
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {activeChart === 'category' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.categorySpending}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.categorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spending']} />
                    <Bar dataKey="spending" fill="#FF7518" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">💰 Savings This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">₹2,500</div>
              <p className="text-sm text-green-600">15% more than last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">📈 Highest Spending Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">Saturday</div>
              <p className="text-sm text-blue-600">₹1,200 average spending</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700">🎉 Festival Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">+40%</div>
              <p className="text-sm text-purple-600">vs last year festivals</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Insights */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Spending Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-medium text-orange-800">Weekend Spending Pattern</h4>
                <p className="text-sm text-orange-700 mt-1">
                  You tend to spend ₹3,200 more on weekends, primarily on food delivery and entertainment.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-medium text-blue-800">UPI Usage Analysis</h4>
                <p className="text-sm text-blue-700 mt-1">
                  85% of your transactions are via UPI, with an average transaction value of ₹420.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-medium text-green-800">Cost Optimization Opportunity</h4>
                <p className="text-sm text-green-700 mt-1">
                  Switching to monthly subscription plans could save you ₹800 per month.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
