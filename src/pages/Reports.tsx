import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from "@/components/Layout";
import { useAnalytics } from "../hooks/useAnalytics";
import { useCurrency } from "../contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import { RefreshCw, Download, TrendingUp, TrendingDown } from "lucide-react";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeChart, setActiveChart] = useState('category');
  const { data: analyticsData, loading, error, refresh } = useAnalytics(selectedPeriod);
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();

  const COLORS = ['#FF7518', '#138808', '#1E40AF', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const handleExportData = () => {
    if (!analyticsData) return;

    const exportData = {
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      summary: {
        totalSpending: analyticsData.totalSpending,
        averageDaily: analyticsData.averageDaily,
        topCategory: analyticsData.topCategory,
        savingsThisMonth: analyticsData.savingsThisMonth
      },
      categoryBreakdown: analyticsData.categorySpending,
      monthlyTrends: analyticsData.monthlyTrends
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spending-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!analyticsData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground">Start adding expenses to see your analytics.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{t('reports')} & Analytics</h1>
            <p className="text-muted-foreground">Analyze your spending patterns and trends</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={refresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleExportData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">{t('thisMonth')}</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-700 dark:text-blue-300 text-sm font-medium">Total Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(analyticsData.totalSpending)}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                {formatCurrency(analyticsData.averageDaily)}/day average
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-700 dark:text-green-300 text-sm font-medium flex items-center">
                <TrendingDown className="h-4 w-4 mr-1" />
                Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(analyticsData.savingsThisMonth)}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">vs last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-700 dark:text-orange-300 text-sm font-medium">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {analyticsData.topCategory}
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                {analyticsData.categorySpending[0]?.percentage}% of spending
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-700 dark:text-purple-300 text-sm font-medium">{t('categories')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {analyticsData.categorySpending.length}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">active categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Tabs */}
        <Card>
          <CardHeader>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveChart('category')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeChart === 'category' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                Spending by Category
              </button>
              <button
                onClick={() => setActiveChart('trends')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeChart === 'trends' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                Monthly Trends
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {activeChart === 'category' ? (
                <ResponsiveContainer width="100%\" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.categorySpending}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.categorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Spending']} />
                    <Bar dataKey="spending" fill="#FF7518" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.categorySpending.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{t(category.name)}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(category.value)}</div>
                    <div className="text-sm text-muted-foreground">{category.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Spending Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-medium text-orange-800 dark:text-orange-300">Spending Pattern</h4>
                <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                  Your highest spending category is {analyticsData.topCategory} at {analyticsData.categorySpending[0]?.percentage}% of total expenses.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-medium text-blue-800 dark:text-blue-300">Daily Average</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  You spend an average of {formatCurrency(analyticsData.averageDaily)} per day this {selectedPeriod}.
                </p>
              </div>
              
              {analyticsData.savingsThisMonth > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-medium text-green-800 dark:text-green-300">Great Job!</h4>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    You've saved {formatCurrency(analyticsData.savingsThisMonth)} compared to last month. Keep it up!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;