
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  icon: string;
}

interface BudgetOverviewCardProps {
  category: BudgetCategory;
}

const BudgetOverviewCard = ({ category }: BudgetOverviewCardProps) => {
  const percentage = (category.spent / category.allocated) * 100;
  const remaining = category.allocated - category.spent;
  const isOverBudget = category.spent > category.allocated;
  const isWarning = percentage > 80;

  const getStatusColor = () => {
    if (isOverBudget) return "bg-red-500";
    if (isWarning) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusText = () => {
    if (isOverBudget) return "Over Budget";
    if (isWarning) return "Warning";
    return "On Track";
  };

  return (
    <Card className="card-indian hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{category.icon}</span>
            <span className="text-lg">{category.name}</span>
          </div>
          <Badge 
            variant={isOverBudget ? "destructive" : isWarning ? "secondary" : "default"}
            className="text-xs"
          >
            {getStatusText()}
          </Badge>
        </CardTitle>
        <CardDescription>
          {isOverBudget ? (
            <span className="text-red-600 font-medium">
              ₹{Math.abs(remaining).toLocaleString('en-IN')} over budget
            </span>
          ) : (
            <span className="text-gray-600">
              ₹{remaining.toLocaleString('en-IN')} remaining
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress 
          value={Math.min(percentage, 100)} 
          className="h-2"
        />
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Spent: ₹{category.spent.toLocaleString('en-IN')}
          </span>
          <span className="text-gray-600">
            Budget: ₹{category.allocated.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="text-right">
          <span className={`text-sm font-medium ${
            isOverBudget ? 'text-red-600' : 
            isWarning ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {percentage.toFixed(0)}% used
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetOverviewCard;
