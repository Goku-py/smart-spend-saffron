import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import NotificationCenter from "./NotificationCenter";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background theme-transition">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="md:pl-64">
        {/* Top Bar with Theme Toggle and Notification Center */}
        <div className="bg-background border-b border-border px-4 py-3 md:px-6 theme-transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold">
                Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}!
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle - Prominently placed */}
              <ThemeToggle 
                size="default"
                variant="outline"
                className="border-2 hover:bg-accent hover:text-accent-foreground"
                showLabel={false}
              />
              
              <NotificationCenter />
              
              {/* User Avatar */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <main className="p-4 pb-20 md:pb-4">
          {children}
        </main>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default Layout;