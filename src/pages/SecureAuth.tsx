import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SecureAuth from '../components/SecureAuth';
import { useSecureAuth } from '../hooks/useSecureAuth';
import AdminDashboard from '../components/AdminDashboard';
import SEOWrapper from '../components/SEOWrapper';

const SecureAuthPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, login, logout } = useSecureAuth();

  const handleAuthSuccess = (userData: any, sessionToken: string) => {
    login(userData, sessionToken);
  };

  const handleLogout = () => {
    logout();
  };

  // If user is authenticated and is admin, show admin dashboard
  if (isAuthenticated && isAdmin) {
    return (
      <AdminDashboard 
        currentUser={user} 
        onLogout={handleLogout}
      />
    );
  }

  // If user is authenticated but not admin, redirect to regular dashboard
  if (isAuthenticated && !isAdmin) {
    navigate('/dashboard');
    return null;
  }

  // Show login form
  return (
    <SEOWrapper 
      title="Secure Authentication" 
      description="Secure login system with industry-standard encryption and admin access for Smart Spend budget tracker."
    >
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Auth Component */}
          <div className="flex justify-center">
            <SecureAuth onAuthSuccess={handleAuthSuccess} />
          </div>

          {/* Security Information */}
          <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Security Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <h4 className="font-medium mb-2">Authentication Security</h4>
                <ul className="space-y-1">
                  <li>• Industry-standard bcrypt password hashing</li>
                  <li>• Rate limiting (5 attempts per minute)</li>
                  <li>• Account lockout after failed attempts</li>
                  <li>• Session timeout (30 minutes)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Monitoring & Logging</h4>
                <ul className="space-y-1">
                  <li>• All login attempts logged</li>
                  <li>• IP address and user agent tracking</li>
                  <li>• Admin dashboard for security monitoring</li>
                  <li>• Real-time security alerts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="max-w-md mx-auto mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Demo Credentials
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <div>
                <strong>Admin Access:</strong><br />
                Email: admin@system.com<br />
                Password: Admin@123#Secure
              </div>
              <div className="mt-3">
                <strong>Regular User:</strong><br />
                Create a new account or use any email with a secure password
              </div>
            </div>
          </div>
        </div>
      </div>
    </SEOWrapper>
  );
};

export default SecureAuthPage;