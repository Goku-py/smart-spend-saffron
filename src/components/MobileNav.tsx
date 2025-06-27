import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Plus, Target, BarChart, Bell, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../contexts/NotificationContext";
import ThemeToggle from "./ThemeToggle";

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { unreadCount } = useNotifications();

  const navItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/expenses", label: t('expenses'), icon: Plus },
    { path: "/budgets", label: t('budgets'), icon: Target },
    { path: "/reports", label: t('reports'), icon: BarChart },
    { path: "/notifications", label: "Alerts", icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { path: "/profile", label: t('profile'), icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg md:hidden theme-transition">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 relative ${
                isActive ? 'text-orange-600' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5 mb-1" />
                {item.badge && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[16px] h-4 flex items-center justify-center p-0">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
        
        {/* Theme Toggle for Mobile - Compact version */}
        <ThemeToggle 
          variant="ghost"
          size="icon"
          className="flex flex-col items-center py-2 px-3 text-muted-foreground"
        />
      </div>
    </div>
  );
};

export default MobileNav;