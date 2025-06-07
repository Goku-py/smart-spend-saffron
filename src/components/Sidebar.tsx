
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Plus, Target, BarChart, Bell, User } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/expenses", label: "Expenses", icon: Plus },
    { path: "/budgets", label: "Budgets", icon: Target },
    { path: "/reports", label: "Reports", icon: BarChart },
    { path: "/notifications", label: "Notifications", icon: Bell },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🪔</span>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Smart Spend
          </span>
          <span className="text-lg">₹</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              onClick={() => navigate(item.path)}
              className={`w-full justify-start ${
                isActive 
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white' 
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
