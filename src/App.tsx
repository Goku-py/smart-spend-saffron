
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; phone: string; email: string } | null;
  login: (userData: { name: string; phone: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; phone: string; email: string } | null>(null);

  const login = (userData: { name: string; phone: string; email: string }) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/expenses" 
                element={isAuthenticated ? <Expenses /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/budgets" 
                element={isAuthenticated ? <Budgets /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/reports" 
                element={isAuthenticated ? <Reports /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/notifications" 
                element={isAuthenticated ? <Notifications /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/profile" 
                element={isAuthenticated ? <Profile /> : <Navigate to="/auth" />} 
              />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
