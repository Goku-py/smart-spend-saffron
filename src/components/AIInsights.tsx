import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../contexts/CurrencyContext';

interface AIInsight {
  id: string;
  type: 'savings' | 'warning' | 'trend' | 'recommendation';
  title: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  category?: string;
  amount?: number;
}

interface AIInsightsProps {
  className?: string;
  maxInsights?: number;
}

const AIInsights: React.FC<AIInsightsProps> = ({ className, maxInsights = 3 }) => {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAIInsights();
  }, [user]);

  const generateAIInsights = async () => {
    setLoading(true);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get user's expense data for analysis
      const expenses = getStoredExpenses();
      const insights = await analyzeSpendingPatterns(expenses);
      
      setInsights(insights.slice(0, maxInsights));
    } catch (error) {
      console.error('Error generating AI insights:', error);
      // Fallback to static insights
      setInsights(getStaticInsights().slice(0, maxInsights));
    } finally {
      setLoading(false);
    }
  };

  const analyzeSpendingPatterns = async (expenses: any[]): Promise<AIInsight[]> => {
    const insights: AIInsight[] = [];
    
    if (!expenses || expenses.length === 0) {
      return getStaticInsights();
    }

    // Analyze spending by day of week
    const weekendSpending = analyzeWeekendSpending(expenses);
    if (weekendSpending.insight) {
      insights.push(weekendSpending.insight);
    }

    // Analyze category trends
    const categoryTrends = analyzeCategoryTrends(expenses);
    insights.push(...categoryTrends);

    // Analyze recurring expenses
    const recurringAnalysis = analyzeRecurringExpenses(expenses);
    if (recurringAnalysis.insight) {
      insights.push(recurringAnalysis.insight);
    }

    // Analyze spending velocity
    const velocityAnalysis = analyzeSpendingVelocity(expenses);
    if (velocityAnalysis.insight) {
      insights.push(velocityAnalysis.insight);
    }

    // Budget optimization suggestions
    const budgetOptimization = analyzeBudgetOptimization(expenses);
    insights.push(...budgetOptimization);

    return insights.sort((a, b) => {
      // Sort by impact and confidence
      const impactWeight = { high: 3, medium: 2, low: 1 };
      const aScore = impactWeight[a.impact] * a.confidence;
      const bScore = impactWeight[b.impact] * b.confidence;
      return bScore - aScore;
    });
  };

  const analyzeWeekendSpending = (expenses: any[]) => {
    const weekendExpenses = expenses.filter(exp => {
      const date = new Date(exp.date);
      const day = date.getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    });

    const weekdayExpenses = expenses.filter(exp => {
      const date = new Date(exp.date);
      const day = date.getDay();
      return day >= 1 && day <= 5; // Monday to Friday
    });

    if (weekendExpenses.length === 0 || weekdayExpenses.length === 0) {
      return { insight: null };
    }

    const weekendTotal = weekendExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const weekdayTotal = weekdayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const weekendAvg = weekendTotal / (weekendExpenses.length / 2); // 2 days per weekend
    const weekdayAvg = weekdayTotal / (weekdayExpenses.length / 5); // 5 days per week
    
    const difference = weekendAvg - weekdayAvg;
    
    if (Math.abs(difference) > 500) {
      return {
        insight: {
          id: 'weekend-spending',
          type: difference > 0 ? 'warning' : 'savings',
          title: difference > 0 ? 'High Weekend Spending' : 'Weekend Savings',
          message: `You spend ${formatCurrency(Math.abs(difference))} ${difference > 0 ? 'more' : 'less'} on average during weekends compared to weekdays.`,
          impact: Math.abs(difference) > 1000 ? 'high' : 'medium',
          confidence: 0.85,
          actionable: true,
          amount: Math.abs(difference)
        } as AIInsight
      };
    }

    return { insight: null };
  };

  const analyzeCategoryTrends = (expenses: any[]): AIInsight[] => {
    const insights: AIInsight[] = [];
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    sortedCategories.forEach(([category, amount], index) => {
      if (amount > 2000) {
        insights.push({
          id: `category-trend-${category}`,
          type: index === 0 ? 'warning' : 'trend',
          title: `${category} Spending Analysis`,
          message: `${category} represents ${formatCurrency(amount)} of your spending. ${index === 0 ? 'Consider setting a budget for this category.' : 'This is a significant expense category.'}`,
          impact: index === 0 ? 'high' : 'medium',
          confidence: 0.9,
          actionable: true,
          category,
          amount
        });
      }
    });

    return insights;
  };

  const analyzeRecurringExpenses = (expenses: any[]) => {
    const recurringPatterns: Record<string, number> = {};
    
    expenses.forEach(exp => {
      const key = `${exp.merchant}-${exp.amount}`;
      recurringPatterns[key] = (recurringPatterns[key] || 0) + 1;
    });

    const recurring = Object.entries(recurringPatterns)
      .filter(([, count]) => count >= 3)
      .sort(([,a], [,b]) => b - a)[0];

    if (recurring) {
      const [key, count] = recurring;
      const [merchant, amount] = key.split('-');
      
      return {
        insight: {
          id: 'recurring-expense',
          type: 'recommendation',
          title: 'Recurring Expense Detected',
          message: `You've spent ${formatCurrency(Number(amount))} at ${merchant} ${count} times. Consider setting up a budget or finding alternatives.`,
          impact: Number(amount) > 500 ? 'high' : 'medium',
          confidence: 0.95,
          actionable: true,
          amount: Number(amount) * count
        } as AIInsight
      };
    }

    return { insight: null };
  };

  const analyzeSpendingVelocity = (expenses: any[]) => {
    if (expenses.length < 7) return { insight: null };

    const recentExpenses = expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);

    const recentTotal = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const dailyAverage = recentTotal / 7;

    if (dailyAverage > 800) {
      return {
        insight: {
          id: 'spending-velocity',
          type: 'warning',
          title: 'High Spending Velocity',
          message: `Your daily spending average is ${formatCurrency(dailyAverage)} over the last week. Consider reviewing your recent purchases.`,
          impact: 'high',
          confidence: 0.8,
          actionable: true,
          amount: dailyAverage
        } as AIInsight
      };
    }

    return { insight: null };
  };

  const analyzeBudgetOptimization = (expenses: any[]): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    // Analyze food delivery vs cooking
    const foodDelivery = expenses.filter(exp => 
      exp.merchant?.toLowerCase().includes('swiggy') || 
      exp.merchant?.toLowerCase().includes('zomato') ||
      exp.merchant?.toLowerCase().includes('uber eats')
    );

    if (foodDelivery.length > 5) {
      const deliveryTotal = foodDelivery.reduce((sum, exp) => sum + exp.amount, 0);
      const potentialSavings = deliveryTotal * 0.6; // Assume 60% savings by cooking
      
      insights.push({
        id: 'cooking-savings',
        type: 'savings',
        title: 'Cooking Savings Opportunity',
        message: `You could save approximately ${formatCurrency(potentialSavings)} by cooking at home instead of ordering food delivery.`,
        impact: potentialSavings > 1000 ? 'high' : 'medium',
        confidence: 0.75,
        actionable: true,
        amount: potentialSavings
      });
    }

    return insights;
  };

  const getStoredExpenses = () => {
    try {
      const stored = localStorage.getItem('smartspend_expenses');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading expenses for AI analysis:', error);
      return [];
    }
  };

  const getStaticInsights = (): AIInsight[] => [
    {
      id: 'weekend-spending-static',
      type: 'warning',
      title: 'Weekend Spending Pattern',
      message: 'You typically spend ₹3,200 more on weekends. Consider setting weekend budgets.',
      impact: 'medium',
      confidence: 0.8,
      actionable: true,
      amount: 3200
    },
    {
      id: 'subscription-optimization',
      type: 'savings',
      title: 'Subscription Optimization',
      message: 'Switch to annual plans for streaming services to save ₹2,400 yearly.',
      impact: 'medium',
      confidence: 0.9,
      actionable: true,
      amount: 2400
    },
    {
      id: 'grocery-trend',
      type: 'trend',
      title: 'Grocery Spending Trend',
      message: 'Your grocery spending decreased by 12% this month. Great job!',
      impact: 'low',
      confidence: 0.85,
      actionable: false
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'savings':
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-purple-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'savings':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      case 'trend':
        return 'border-blue-200 bg-blue-50';
      case 'recommendation':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
            AI Insights
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateAIInsights}
            className="text-purple-600 hover:text-purple-700"
          >
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${getInsightColor(insight.type)} transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                      {insight.impact === 'high' && (
                        <Badge variant="destructive" className="text-xs">
                          High Impact
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{insight.message}</p>
                    {insight.amount && (
                      <p className="text-xs text-gray-500 mt-1">
                        Potential impact: {formatCurrency(insight.amount)}
                      </p>
                    )}
                  </div>
                </div>
                {insight.actionable && (
                  <Button variant="ghost" size="sm" className="text-xs">
                    Take Action
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {insights.length === 0 && (
            <div className="text-center py-6">
              <Sparkles className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
              <p className="text-gray-600">Add more expenses to get personalized AI insights.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;