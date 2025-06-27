
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing page after a short delay
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <span className="text-4xl">🪔</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Smart Spend
          </span>
          <span className="text-2xl">₹</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Smart Spend</h1>
        <p className="text-xl text-gray-600 mb-8">
          Redirecting you to the main page...
        </p>
        
        <div className="space-x-4">
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
          >
            Go to Landing Page
          </Button>
          <Button 
            onClick={() => navigate('/auth')}
            variant="outline"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
