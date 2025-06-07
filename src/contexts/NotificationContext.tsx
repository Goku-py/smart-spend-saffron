
import React, { createContext, useContext, useState, useCallback } from 'react';

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
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'budget_alert',
      title: 'Budget Alert',
      message: 'Food & Dining budget 93% used',
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
      message: 'Jio recharge ₹599 due tomorrow',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: false,
      isUrgent: false,
      icon: '📋'
    },
    {
      id: '3',
      type: 'ai_insight',
      title: 'AI Insight',
      message: 'You can save ₹800 by cooking at home twice a week',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isRead: true,
      isUrgent: false,
      icon: '💡'
    }
  ]);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      dismissNotification,
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
