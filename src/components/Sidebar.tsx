
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Plus, Target, BarChart, Bell, User } from "lucide-react";
import { useTranslation } from "../contexts/TranslationContext";
import { useNotifications } from "../contexts/NotificationContext";
import LanguageSelector from "./LanguageSelector";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { unreadCount } = useNotifications();

  const navItems = [
    { path: "/dashboard", label: t('dashboard'), icon: Home },
    { path: "/expenses", label: t('expenses'), icon: Plus },
    { path: "/budgets", label: t('budgets'), icon: Target },
    { path: "/reports", label: t('reports'), icon: BarChart },
    { path: "/notifications", label: t('notifications'), icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { path: "/profile", label: t('profile'), icon: User },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🪔</span>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Smart Spend
          </span>
          <span className="text-lg">₹</span>
        </div>
        <LanguageSelector />
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
              className={`w-full justify-start relative ${
                isActive 
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white' 
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
              {item.badge && (
                <Badge className="ml-auto bg-red-500 text-white text-xs">
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
