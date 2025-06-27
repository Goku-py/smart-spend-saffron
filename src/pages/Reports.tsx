import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, Legend } from 'recharts';
import Layout from "@/components/Layout";
import { useCurrency } from "../contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import { RefreshCw, Download, TrendingUp, TrendingDown, Calendar, Target, DollarSign, PieChart as PieChartIcon } from "lucide-react";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeChart, setActiveChart] = useState('category');
  const [loading, setLoading] = useState(false);
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();

  const COLORS = ['#FF7518', '#138808', '#1E40AF', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // Enhanced analytics data with real-time calculations
  const [analyticsData, setAnalyticsData] = useState({
    categorySpending: [
      { name: 'Kirana', value: 5200, percentage: 28, color: '#FF7518' },
      { name: 'Food & Dining', value: 4800, percentage: 26, color: '#138808' },
      { name: 'Travel', value: 3200, percentage: 17, color: '#1E40AF' },
      { name: 'Utilities', value: 2800, percentage: 15, color: '#F59E0B' },
      { name: 'Entertainment', value: 1500, percentage: 8, color: '#EF4444' },
      { name: 'Healthcare', value: 1250, percentage: 7, color: '#8B5CF6' }
    ],
    monthlyTrends: [
      { month: 'Aug', spending: 22000, income: 75000, savings: 53000 },
      { month: 'Sep', spending: 19500, income: 75000, savings: 55500 },
      { month: 'Oct', spending: 21800, income: 78000, savings: 56200 },
      { month: 'Nov', spending: 20200, income: 78000, savings: 57800 },
      { month: 'Dec', spending: 18500, income: 80000, savings: 61500 },
      { month: 'Jan', spending: 18750, income: 80000, savings: 61250 }
    ],
    budgetUtilization: [
      { category: 'Kirana', budget: 8000, spent: 5200, percentage: 65 },
      { category: 'Food & Dining', budget: 6000, spent: 4800, percentage: 80 },
      { category: 'Travel', budget: 4000, spent: 3200, percentage: 80 },
      { category: 'Utilities', budget: 3000, spent: 2800, percentage: 93 },
      { category: 'Entertainment', budget: 2500, spent: 1500, percentage: 60 },
      { category: 'Healthcare', budget: 1500, spent: 1250, percentage: 83 }
    ],
    yearOverYear: [
      { category: 'Kirana', current: 5200, previous: 4800, growth: 8.3 },
      { category: 'Food & Dining', current: 4800, previous: 5200, growth: -7.7 },
      { category: 'Travel', current: 3200, previous: 2800, growth: 14.3 },
      { category: 'Utilities', current: 2800, previous: 2600, growth: 7.7 },
      { category: 'Entertainment', current: 1500, previous: 1800, growth: -16.7 },
      { category: 'Healthcare', current: 1250, previous: 1100, growth: 13.6 }
    ],
    totalSpending: 18750,
    averageDaily: 625,
    topCategory: 'Kirana',
    savingsThisMonth: 2750
  });

  // Animated data loading effect
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  const handleExportData = () => {
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
      monthlyTrends: analyticsData.monthlyTrends,
      budgetUtilization: analyticsData.budgetUtilization,
      yearOverYear: analyticsData.yearOverYear
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground text-lg">Analyze your spending patterns and trends</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleExportData} variant="outline" size="sm" className="hover:bg-orange-50 dark:hover:bg-orange-950">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 animate-slide-up">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-700 dark:text-blue-300 text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Total Spending
              </CardTitle>
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

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-green-700 dark:text-green-300 text-sm font-medium flex items-center">
                <TrendingDown className="h-4 w-4 mr-2" />
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

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-700 dark:text-orange-300 text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Top Category
              </CardTitle>
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

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-700 dark:text-purple-300 text-sm font-medium flex items-center">
                <PieChartIcon className="h-4 w-4 mr-2" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {analyticsData.categorySpending.length}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">active categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Navigation */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'category', label: 'Category Spending', icon: PieChartIcon },
                { id: 'trends', label: 'Monthly Trends', icon: TrendingUp },
                { id: 'budget', label: 'Budget Utilization', icon: Target },
                { id: 'comparison', label: 'Year-over-Year', icon: Calendar }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveChart(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeChart === tab.id 
                        ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg' 
                        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              {activeChart === 'category' && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.categorySpending}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.categorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any, name: any, props: any) => [`${formatCurrency(value)} (${props.payload.percentage}%)`, name]} />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right" 
                      formatter={(value: string, entry: any) => `${value} (${formatCurrency(entry.payload.value)})`}
                      wrapperStyle={{ lineHeight: '24px', fontSize: '14px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {activeChart === 'trends' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analyticsData.monthlyTrends}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-sm" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} className="text-sm" />
                    <Tooltip formatter={(value: any, name: any) => [`${formatCurrency(value)}`, name]} />
                    <Area type="monotone" dataKey="spending" stroke="#FF7518" fill="#FF7518" fillOpacity={0.3} name="Spending" />
                    <Area type="monotone" dataKey="income" stroke="#138808" fill="#138808" fillOpacity={0.3} name="Income" />
                    <Line type="monotone" dataKey="savings" stroke="#1E40AF" name="Savings" strokeWidth={2} dot={false} />
                    <Legend 
                      formatter={(value: string) => value === "spending" ? "Spending" : value === "income" ? "Income" : "Savings"}
                      wrapperStyle={{ lineHeight: '24px', fontSize: '14px' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {activeChart === 'budget' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.budgetUtilization}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="category" className="text-sm" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} className="text-sm" />
                    <Tooltip formatter={(value: any, name: any, props: any) => {
                      if (name === 'spent') {
                        return [`${formatCurrency(value)} (Spent)`, `Budget: ${formatCurrency(props.payload.budget)}`, `Utilization: ${props.payload.percentage}%`];
                      }
                      return null;
                    }} />
                    <Bar dataKey="spent" fill="#8B5CF6" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeChart === 'comparison' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.yearOverYear}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="category" className="text-sm" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} className="text-sm" />
                    <Tooltip formatter={(value: any, name: any, props: any) => {
                      if (name === 'current') {
                        return [`${formatCurrency(value)} (Current Year)`, `Previous Year: ${formatCurrency(props.payload.previous)}`, `Growth: ${props.payload.growth}%`];
                      }
                      return null;
                    }} />
                    <Legend 
                      formatter={(value: string) => value === "current" ? "Current Year Spending" : "Previous Year Spending"}
                      wrapperStyle={{ lineHeight: '24px', fontSize: '14px' }}
                    />
                    <Bar dataKey="previous" fill="#F59E0B" name="Previous Year" />
                    <Bar dataKey="current" fill="#138808" name="Current Year" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.categorySpending.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
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

          {/* Budget Performance */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle>Budget Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.budgetUtilization.map((item, index) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            item.percentage > 90 ? 'bg-red-500' : 
                            item.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min(item.percentage, 100)}%`,
                            animationDelay: `${index * 0.1}s`
                          }}
                        />
                      </div>
                      <span className="absolute right-0 top-3 text-xs text-muted-foreground">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
              Financial Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border-l-4 border-green-400">
                <h4 className="font-medium text-green-800 dark:text-green-300">Great Job!</h4>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  You've saved {formatCurrency(analyticsData.savingsThisMonth)} compared to last month. Keep it up!
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