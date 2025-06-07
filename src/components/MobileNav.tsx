
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Plus, Target, BarChart, Bell, User } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/expenses", label: "Expenses", icon: Plus },
    { path: "/budgets", label: "Budgets", icon: Target },
    { path: "/reports", label: "Reports", icon: BarChart },
    { path: "/notifications", label: "Alerts", icon: Bell },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 ${
                isActive ? 'text-orange-600' : 'text-gray-600'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
