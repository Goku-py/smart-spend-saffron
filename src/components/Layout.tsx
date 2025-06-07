
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="md:pl-64">
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
