
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", label: "Home", icon: "🏠" },
    { path: "/expenses", label: "Expenses", icon: "💳" },
    { path: "/budgets", label: "Budgets", icon: "📊" },
    { path: "/reports", label: "Reports", icon: "📈" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-lg z-50 md:hidden">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 ${
                location.pathname === item.path ? 'text-orange-600' : 'text-gray-600'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Desktop Top Navigation */}
      <div className="hidden md:block bg-white border-b border-orange-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🪔</span>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Smart Spend
              </span>
              <span className="text-lg">₹</span>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className={`${
                    location.pathname === item.path 
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
