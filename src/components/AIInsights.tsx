
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface AIInsight {
  type: 'warning' | 'tip' | 'achievement';
  title: string;
  message: string;
  icon: string;
}

interface AIInsightsProps {
  insights: AIInsight[];
}

const AIInsights = ({ insights }: AIInsightsProps) => {
  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'warning':
        return 'destructive';
      case 'achievement':
        return 'default';
      default:
        return 'default';
    }
  };

  const getCardStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-red-200 bg-red-50';
      case 'tip':
        return 'border-blue-200 bg-blue-50';
      case 'achievement':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🤖</span>
        AI Insights & Recommendations
      </h2>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <Card key={index} className={`${getCardStyle(insight.type)} hover:shadow-md transition-shadow`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{insight.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1">{insight.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{insight.message}</p>
                  {insight.type === 'tip' && (
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-200">
                      Learn More
                    </Button>
                  )}
                  {insight.type === 'warning' && (
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                      Set Alert
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
