
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { notifications } from "../data/mockData";
import { useNotifications } from "../contexts/NotificationContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Notifications = () => {
  const { markAsRead, dismissNotification } = useNotifications();
  const { toast } = useToast();
  const [notificationSettings, setNotificationSettings] = useState({
    budgetAlerts: true,
    billReminders: true,
    aiInsights: true,
    weeklyReports: false
  });

  const urgentNotifications = notifications.filter(n => n.urgent);
  const regularNotifications = notifications.filter(n => !n.urgent);

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

  const handleReviewAction = () => {
    toast({
      title: "Review Action",
      description: "Redirecting to budget review...",
    });
  };

  const handleSetBudgetAction = () => {
    toast({
      title: "Set Budget",
      description: "Redirecting to budget creation...",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-600">Stay updated with your spending alerts and insights</p>
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                <Label htmlFor="weekly-summary">Weekly Summary</Label>
                <Switch 
                  id="weekly-summary" 
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Urgent Notifications */}
        {urgentNotifications.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center">
                🚨 Urgent Alerts
                <Badge variant="destructive" className="ml-2">
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
                          <span className="text-xl">
                            {notification.type === 'alert' ? '⚠️' : 
                             notification.type === 'bill' ? '📋' : '💡'}
                          </span>
                          <h4 className="font-medium text-gray-800">{notification.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDismissNotification(notification.id.toString())}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regular Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {regularNotifications.map((notification) => (
                <div key={notification.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="text-xl">
                        {notification.type === 'alert' ? '⚠️' : 
                         notification.type === 'bill' ? '📋' : '💡'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-800">{notification.title}</h4>
                          <Badge variant={notification.type === 'insight' ? 'default' : 'secondary'}>
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDismissNotification(notification.id.toString())}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-blue-800">Review Food Budget</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your food spending has increased by 23% this month
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleReviewAction}
                  >
                    Review
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-green-800">Set Festival Budget</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Diwali is 45 days away. Start planning your festival expenses.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSetBudgetAction}
                  >
                    Set Budget
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Notifications;
