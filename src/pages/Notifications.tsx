import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/Layout";
import { useNotifications } from "../contexts/NotificationContext";
import { useToast } from "@/hooks/use-toast";
import { Bell, Sparkles, Settings, TestTube, CheckCircle, AlertTriangle, Shield } from "lucide-react";
import { isFirebaseConfigured } from "../lib/firebase";

const Notifications = () => {
  const { notifications, markAsRead, dismissNotification, addNotification } = useNotifications();
  const { toast } = useToast();
  const [notificationSettings, setNotificationSettings] = useState({
    budgetAlerts: true,
    billReminders: true,
    aiInsights: true,
    weeklyReports: false,
    realTimeUpdates: true,
    emailNotifications: false
  });

  const urgentNotifications = notifications.filter(n => n.isUrgent && !n.isRead);
  const aiInsights = notifications.filter(n => n.type === 'ai_insight');
  const regularNotifications = notifications.filter(n => n.type !== 'ai_insight');

  const handleDismissNotification = (id: string) => {
    dismissNotification(id);
    toast({
      title: "Notification Dismissed",
      description: "The notification has been removed",
    });
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast({
      title: "Marked as Read",
      description: "The notification has been marked as read",
    });
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    toast({
      title: "Settings Updated",
      description: `${setting} ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const testNotification = (type: 'budget_alert' | 'ai_insight' | 'system') => {
    const testNotifications = {
      budget_alert: {
        type: 'budget_alert' as const,
        title: 'Test Budget Alert',
        message: 'This is a test budget alert notification to verify the system is working.',
        isUrgent: true,
        icon: '⚠️',
        actionUrl: '/budgets'
      },
      ai_insight: {
        type: 'ai_insight' as const,
        title: 'Test AI Insight',
        message: 'This is a test AI insight to demonstrate the notification system capabilities.',
        isUrgent: false,
        icon: '💡'
      },
      system: {
        type: 'system' as const,
        title: 'Test System Notification',
        message: 'This is a test system notification to verify delivery.',
        isUrgent: false,
        icon: '🔔'
      }
    };

    addNotification(testNotifications[type]);
    toast({
      title: "Test Notification Sent",
      description: `${type.replace('_', ' ')} notification added`,
    });
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications & Settings</h1>
          <p className="text-gray-600">Manage your alerts, insights, and system preferences</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center space-x-2">
              <TestTube className="h-4 w-4" />
              <span>Testing</span>
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            {/* Urgent Notifications */}
            {urgentNotifications.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Urgent Alerts
                    <Badge variant="destructive\" className="ml-2">
                      {urgentNotifications.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {urgentNotifications.map((notification) => (
                      <div key={notification.id} className="p-4 bg-white rounded-lg border border-red-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">{notification.icon}</span>
                              <h4 className="font-medium text-gray-800">{notification.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(notification.timestamp)}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Read
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDismissNotification(notification.id)}
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Insights */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-700 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  AI Insights
                  <Badge className="ml-2 bg-purple-100 text-purple-800">
                    {aiInsights.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiInsights.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="p-4 bg-white rounded-lg border border-purple-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{notification.icon}</span>
                            <h4 className="font-medium text-gray-800">{notification.title}</h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(notification.timestamp)}</p>
                        </div>
                        <div className="flex space-x-2">
                          {!notification.isRead && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDismissNotification(notification.id)}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regular Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regularNotifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="text-xl">{notification.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-800">{notification.title}</h4>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              )}
                              {notification.isUrgent && (
                                <Badge variant="destructive\" className="text-xs">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(notification.timestamp)}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDismissNotification(notification.id)}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="budget-alerts">Budget Alerts</Label>
                  <Switch 
                    id="budget-alerts" 
                    checked={notificationSettings.budgetAlerts}
                    onCheckedChange={(checked) => handleSettingChange('budgetAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="bill-reminders">Bill Reminders</Label>
                  <Switch 
                    id="bill-reminders" 
                    checked={notificationSettings.billReminders}
                    onCheckedChange={(checked) => handleSettingChange('billReminders', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ai-insights">AI Insights</Label>
                  <Switch 
                    id="ai-insights" 
                    checked={notificationSettings.aiInsights}
                    onCheckedChange={(checked) => handleSettingChange('aiInsights', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <Switch 
                    id="weekly-reports" 
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="real-time">Real-time Updates</Label>
                  <Switch 
                    id="real-time" 
                    checked={notificationSettings.realTimeUpdates}
                    onCheckedChange={(checked) => handleSettingChange('realTimeUpdates', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch 
                    id="email-notifications" 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            {/* Firebase Authentication Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Firebase Authentication Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className={isFirebaseConfigured() ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
                  {isFirebaseConfigured() ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  )}
                  <AlertDescription className={isFirebaseConfigured() ? "text-green-800" : "text-orange-800"}>
                    <strong>Firebase Status:</strong> {isFirebaseConfigured() ? 
                      'Properly configured and ready for production use.' : 
                      'Not configured - demo mode active for testing.'
                    }
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Authentication Provider</h4>
                    <p className="text-sm text-gray-600">
                      {isFirebaseConfigured() ? 'Firebase (Production Ready)' : 'Demo Mode (Testing Only)'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Google OAuth</h4>
                    <p className="text-sm text-gray-600">
                      {isFirebaseConfigured() ? 'Available' : 'Requires Firebase Setup'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Data Storage</h4>
                    <p className="text-sm text-gray-600">
                      {isFirebaseConfigured() ? 'Firestore Database' : 'Local Storage (Demo)'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Security Features</h4>
                    <p className="text-sm text-gray-600">
                      {isFirebaseConfigured() ? 'Enterprise Grade' : 'Basic Demo Security'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Testing */}
            <Card>
              <CardHeader>
                <CardTitle>Notification System Testing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Use these buttons to test different types of notifications and verify the system is working correctly.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => testNotification('budget_alert')}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Test Budget Alert
                  </Button>
                  <Button 
                    onClick={() => testNotification('ai_insight')}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Test AI Insight
                  </Button>
                  <Button 
                    onClick={() => testNotification('system')}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Test System Notification
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">System Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Notification Center:</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Real-time Updates:</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Bubble Animations:</span>
                      <Badge className="bg-green-100 text-green-800">Working</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auto-dismiss:</span>
                      <Badge className="bg-green-100 text-green-800">30s Timer</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Firebase Integration:</span>
                      <Badge className={isFirebaseConfigured() ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                        {isFirebaseConfigured() ? 'Connected' : 'Demo Mode'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Notifications;