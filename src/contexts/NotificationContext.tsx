import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'budget_alert' | 'bill_reminder' | 'ai_insight' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isUrgent: boolean;
  icon: string;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'budget_alert',
      title: 'Budget Alert',
      message: 'Food & Dining budget 93% used - ₹2,800 of ₹3,000 spent this month',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      isUrgent: true,
      icon: '⚠️',
      actionUrl: '/budgets'
    },
    {
      id: '2',
      type: 'bill_reminder',
      title: 'Bill Reminder',
      message: 'Jio recharge ₹599 due tomorrow. Set up auto-pay to avoid service interruption.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: false,
      isUrgent: false,
      icon: '📋'
    },
    {
      id: '3',
      type: 'ai_insight',
      title: 'Smart Savings Tip',
      message: 'You can save ₹800 monthly by cooking at home twice a week instead of ordering food.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isRead: false,
      isUrgent: false,
      icon: '💡'
    },
    {
      id: '4',
      type: 'ai_insight',
      title: 'Spending Pattern Alert',
      message: 'Your weekend spending is 40% higher than weekdays. Consider setting weekend budgets.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isRead: true,
      isUrgent: false,
      icon: '📊'
    },
    {
      id: '5',
      type: 'system',
      title: 'Welcome to Smart Spend!',
      message: 'Your account has been set up successfully. Start by adding your first expense.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isRead: true,
      isUrgent: false,
      icon: '🎉'
    }
  ]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('smartspend_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('smartspend_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-dismiss non-urgent notifications after 30 seconds
    if (!newNotification.isUrgent) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 30000);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Simulate real-time notifications for demo
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add AI insights or budget alerts
      const shouldAddNotification = Math.random() < 0.1; // 10% chance every 30 seconds
      
      if (shouldAddNotification && notifications.length < 10) {
        const aiInsights = [
          {
            type: 'ai_insight' as const,
            title: 'Spending Optimization',
            message: 'Consider switching to a monthly metro pass to save ₹200 on transportation.',
            isUrgent: false,
            icon: '🚇'
          },
          {
            type: 'ai_insight' as const,
            title: 'Budget Recommendation',
            message: 'Based on your spending, consider increasing your entertainment budget by ₹500.',
            isUrgent: false,
            icon: '🎬'
          },
          {
            type: 'budget_alert' as const,
            title: 'Budget Update',
            message: 'Travel budget is 75% used. ₹300 remaining for this month.',
            isUrgent: false,
            icon: '✈️',
            actionUrl: '/budgets'
          }
        ];
        
        const randomInsight = aiInsights[Math.floor(Math.random() * aiInsights.length)];
        addNotification(randomInsight);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification, notifications.length]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      dismissNotification,
      markAllAsRead,
      clearAll,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};