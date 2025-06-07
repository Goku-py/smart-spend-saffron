
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Expense",
      description: "Record a new transaction",
      icon: "💳",
      action: () => navigate("/expenses"),
      color: "bg-red-500 hover:bg-red-600"
    },
    {
      title: "Set Budget",
      description: "Update category budgets",
      icon: "📊",
      action: () => navigate("/budgets"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "View Reports",
      description: "Analyze spending patterns",
      icon: "📈",
      action: () => navigate("/reports"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Festival Budget",
      description: "Plan for Diwali expenses",
      icon: "🎉",
      action: () => navigate("/budgets"),
      color: "bg-yellow-500 hover:bg-yellow-600"
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Card 
            key={index}
            className="card-indian hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
            onClick={action.action}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mx-auto mb-3 text-white text-xl`}>
                {action.icon}
              </div>
              <h3 className="font-medium text-gray-800 mb-1">{action.title}</h3>
              <p className="text-xs text-gray-600">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
