
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🎯",
      title: "Smart Budgeting",
      description: "Set INR budgets with AI recommendations"
    },
    {
      icon: "📱", 
      title: "UPI Tracking",
      description: "Automatic expense categorization"
    },
    {
      icon: "📊",
      title: "AI Insights", 
      description: "Personalized saving suggestions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🪔</span>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Smart Spend
            </span>
            <span className="text-lg">₹</span>
          </div>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600"
          >
            Get Started
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            AI-Powered Budget Tracker
            <br />
            <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              for Indians
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track UPI expenses, manage budgets, save money with AI insights designed for Indian spending patterns
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 px-8 py-4 text-lg"
          >
            Start Tracking Your Expenses
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center bg-white/80 backdrop-blur border-orange-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl text-gray-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/80 backdrop-blur rounded-2xl p-8 border border-orange-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to take control of your finances?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of Indians who are already saving money with Smart Spend
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
          >
            Get Started Free
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🪔</span>
            <span className="text-xl font-bold">Smart Spend</span>
            <span className="text-lg">₹</span>
          </div>
          <p className="text-orange-100">
            Made with ❤️ for smart Indians
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
