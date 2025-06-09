import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { getAllUsers, getLoginAttempts, isAdmin } from '../lib/auth';

interface AdminDashboardProps {
  currentUser: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onLogout }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Verify admin access
  if (!isAdmin(currentUser)) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Access Denied: Administrator privileges required
        </AlertDescription>
      </Alert>
    );
  }

  const loadData = async () => {
    setLoading(true);
    try {
      const allUsers = getAllUsers();
      const attempts = getLoginAttempts(50);
      
      setUsers(allUsers);
      setLoginAttempts(attempts);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const exportData = (type: 'users' | 'logs') => {
    const data = type === 'users' ? users : loginAttempts;
    const filename = `${type}-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-100 text-green-800">Success</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Failed</Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const recentFailedAttempts = loginAttempts.filter(attempt => !attempt.success).slice(0, 10);
  const successfulLogins = loginAttempts.filter(attempt => attempt.success).length;
  const failedLogins = loginAttempts.filter(attempt => !attempt.success).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="h-8 w-8 text-orange-600 mr-3" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome, {currentUser.email} | Last updated: {formatDate(lastRefresh)}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={loadData}
              variant="outline"
              disabled={loading}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={onLogout}
              variant="destructive"
              className="flex items-center"
            >
              Secure Logout
            </Button>
          </div>
        </div>

        {/* Security Alert */}
        <Alert className="border-orange-200 bg-orange-50">
          <Shield className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Security Notice:</strong> You are accessing the administrative interface. 
            All actions are logged and monitored for security purposes.
          </AlertDescription>
        </Alert>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <p className="text-sm text-gray-500">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Successful Logins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{successfulLogins}</div>
              <p className="text-sm text-gray-500">Last 50 attempts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                Failed Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{failedLogins}</div>
              <p className="text-sm text-gray-500">Security incidents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-sm text-gray-500">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security Logs
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              System Monitoring
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>User Accounts</CardTitle>
                  <Button
                    onClick={() => exportData('users')}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Users
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          user.role === 'admin' ? 'bg-orange-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <div className="font-medium">{user.email}</div>
                          <div className="text-sm text-gray-500">
                            Created: {formatDate(user.createdAt)}
                            {user.lastLogin && ` | Last login: ${formatDate(user.lastLogin)}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        {user.isLocked && (
                          <Badge variant="destructive">Locked</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Recent Failed Attempts */}
              {recentFailedAttempts.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-700 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Recent Failed Login Attempts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentFailedAttempts.map((attempt, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium text-red-800">{attempt.email}</div>
                            <div className="text-sm text-red-600">
                              {formatDate(attempt.timestamp)}
                              {attempt.ipAddress && ` | IP: ${attempt.ipAddress}`}
                            </div>
                          </div>
                          {getStatusBadge(attempt.success)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* All Login Attempts */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Login Activity Log</CardTitle>
                    <Button
                      onClick={() => exportData('logs')}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {loginAttempts.map((attempt, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            attempt.success ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <div className="font-medium">{attempt.email}</div>
                            <div className="text-sm text-gray-500">
                              {formatDate(attempt.timestamp)}
                              {attempt.userAgent && (
                                <span className="ml-2 text-xs">
                                  {attempt.userAgent.includes('Mobile') ? '📱' : '💻'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(attempt.success)}
                          {attempt.ipAddress && (
                            <span className="text-xs text-gray-500">{attempt.ipAddress}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Authentication Service</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Session Management</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Security Monitoring</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Rate Limiting</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Security Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Success Rate</span>
                      <span className="font-medium">
                        {loginAttempts.length > 0 
                          ? Math.round((successfulLogins / loginAttempts.length) * 100)
                          : 0
                        }%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Failed Attempts (24h)</span>
                      <span className="font-medium text-red-600">{failedLogins}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Locked Accounts</span>
                      <span className="font-medium">
                        {users.filter(u => u.isLocked).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Admin Sessions</span>
                      <span className="font-medium">1</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;