import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  BellOff, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Trash2,
  Settings,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  Target,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SEOWrapper from '../components/SEOWrapper';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'budget_alert',
      title: 'Budget Alert: Food & Dining',
      message: 'You have spent 85% of your Food & Dining budget for this month.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'high',
      category: 'Budget'
    },
    {
      id: '2', 
      type: 'spending_insight',
      title: 'Weekly Spending Summary',
      message: 'Your spending this week increased by 15% compared to last week.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      priority: 'medium',
      category: 'Insights'
    },
    {
      id: '3',
      type: 'goal_achieved',
      title: 'Savings Goal Achieved! 🎉',
      message: 'Congratulations! You have reached your monthly savings goal of ₹5,000.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      priority: 'low',
      category: 'Goals'
    },
    {
      id: '4',
      type: 'payment_reminder',
      title: 'Recurring Payment Due',
      message: 'Your Netflix subscription (₹199) is due for renewal tomorrow.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      priority: 'medium',
      category: 'Payments'
    },
    {
      id: '5',
      type: 'security_alert',
      title: 'New Device Login',
      message: 'A new device accessed your account from Mumbai, Maharashtra.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      priority: 'high',
      category: 'Security'
    }
  ]);

  const [settings, setSettings] = useState({
    budgetAlerts: true,
    spendingInsights: true,
    goalUpdates: true,
    paymentReminders: true,
    securityAlerts: true,
    weeklyReports: true,
    emailNotifications: false,
    pushNotifications: true
  });

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mark notifications as delivered
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) Smart Spend - Notifications`;
    } else {
      document.title = 'Smart Spend - Notifications';
    }

    return () => {
      document.title = 'Smart Spend';
    };
  }, [notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'budget_alert': return AlertTriangle;
      case 'spending_insight': return TrendingUp;
      case 'goal_achieved': return Target;
      case 'payment_reminder': return CreditCard;
      case 'security_alert': return Bell;
      default: return Info;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been updated.",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
      variant: "destructive",
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "All notifications cleared",
      description: "Your notification list is now empty.",
    });
  };

  const updateSettings = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Settings updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'high') return notification.priority === 'high';
    return notification.category.toLowerCase() === filter.toLowerCase();
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SEOWrapper 
      title="Notifications" 
      description="Stay updated with your financial activities, budget alerts, and spending insights with Smart Spend notifications."
    >
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Bell className="h-8 w-8 mr-3 text-orange-600" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-3">
                      {unreadCount}
                    </Badge>
                  )}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Stay updated with your financial activities
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={markAllAsRead}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              )}
              <Button variant="destructive" onClick={clearAllNotifications}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Filter Tabs */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'all', label: 'All', count: notifications.length },
                      { key: 'unread', label: 'Unread', count: unreadCount },
                      { key: 'high', label: 'High Priority', count: notifications.filter(n => n.priority === 'high').length },
                      { key: 'budget', label: 'Budget', count: notifications.filter(n => n.category === 'Budget').length },
                      { key: 'insights', label: 'Insights', count: notifications.filter(n => n.category === 'Insights').length },
                    ].map(tab => (
                      <Button
                        key={tab.key}
                        variant={filter === tab.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(tab.key)}
                        className="flex items-center space-x-2"
                      >
                        <span>{tab.label}</span>
                        <Badge variant="secondary" className="ml-1">
                          {tab.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications List */}
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No notifications found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {filter === 'all' 
                          ? "You're all caught up! No notifications to display."
                          : `No ${filter} notifications at this time.`
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredNotifications.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    return (
                      <Card 
                        key={notification.id} 
                        className={`transition-all hover:shadow-md cursor-pointer ${
                          !notification.read ? 'border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)} bg-current bg-opacity-10`}>
                              <IconComponent className={`h-5 w-5 ${getPriorityColor(notification.priority)}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {notification.title}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center space-x-3 mt-3">
                                    <Badge variant="outline" className="text-xs">
                                      {notification.category}
                                    </Badge>
                                    <Badge 
                                      variant={notification.priority === 'high' ? 'destructive' : 'secondary'} 
                                      className="text-xs"
                                    >
                                      {notification.priority} priority
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {formatTimestamp(notification.timestamp)}
                                    </span>
                                  </div>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>

            {/* Sidebar - Notification Settings */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Settings className="h-5 w-5 mr-2" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Customize your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Notification Types */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Notification Types</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'budgetAlerts', label: 'Budget Alerts', icon: AlertTriangle },
                        { key: 'spendingInsights', label: 'Spending Insights', icon: TrendingUp },
                        { key: 'goalUpdates', label: 'Goal Updates', icon: Target },
                        { key: 'paymentReminders', label: 'Payment Reminders', icon: CreditCard },
                        { key: 'securityAlerts', label: 'Security Alerts', icon: Bell },
                        { key: 'weeklyReports', label: 'Weekly Reports', icon: Calendar },
                      ].map(setting => {
                        const IconComponent = setting.icon;
                        return (
                          <div key={setting.key} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="h-4 w-4 text-gray-500" />
                              <Label htmlFor={setting.key} className="text-sm">
                                {setting.label}
                              </Label>
                            </div>
                            <Switch
                              id={setting.key}
                              checked={settings[setting.key as keyof typeof settings]}
                              onCheckedChange={(checked) => updateSettings(setting.key, checked)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Methods */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Delivery Methods</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications" className="text-sm">
                          Email Notifications
                        </Label>
                        <Switch
                          id="emailNotifications"
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) => updateSettings('emailNotifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pushNotifications" className="text-sm">
                          Push Notifications
                        </Label>
                        <Switch
                          id="pushNotifications"
                          checked={settings.pushNotifications}
                          onCheckedChange={(checked) => updateSettings('pushNotifications', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Notifications</span>
                        <span className="font-medium">{notifications.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Unread</span>
                        <span className="font-medium text-orange-600">{unreadCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">This Week</span>
                        <span className="font-medium">
                          {notifications.filter(n => 
                            new Date().getTime() - n.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
                          ).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SEOWrapper>
  );
};

export default Notifications;
