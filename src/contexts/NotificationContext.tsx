import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import DOMPurify from 'dompurify';

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

// Enhanced notification sanitization
const sanitizeNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): Omit<Notification, 'id' | 'timestamp' | 'isRead'> => {
  return {
    ...notification,
    title: DOMPurify.sanitize(notification.title),
    message: DOMPurify.sanitize(notification.message),
    icon: DOMPurify.sanitize(notification.icon)
  };
};

// Storage utilities with error handling
const STORAGE_KEY = 'smartspend_notifications';
const MAX_NOTIFICATIONS = 50; // Prevent memory issues

const saveNotificationsToStorage = (notifications: Notification[]) => {
  try {
    // Keep only the most recent notifications to prevent storage bloat
    const trimmedNotifications = notifications.slice(0, MAX_NOTIFICATIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedNotifications));
  } catch (error) {
    console.error('Failed to save notifications to storage:', error);
  }
};

const loadNotificationsFromStorage = (): Notification[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return parsed.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));
    }
  } catch (error) {
    console.error('Failed to load notifications from storage:', error);
  }
  return getDefaultNotifications();
};

// Default notifications with better content
const getDefaultNotifications = (): Notification[] => [
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
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => 
    loadNotificationsFromStorage()
  );

  // Auto-save notifications to localStorage whenever they change
  useEffect(() => {
    saveNotificationsToStorage(notifications);
  }, [notifications]);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    // Sanitize the notification content
    const sanitizedData = sanitizeNotification(notificationData);
    
    const newNotification: Notification = {
      ...sanitizedData,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      isRead: false
    };
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Trim to prevent memory issues
      return updated.slice(0, MAX_NOTIFICATIONS);
    });
    
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

  // Enhanced demo notification generation with better timing and content
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    // Only generate demo notifications if we have fewer than 10 total notifications
    if (notifications.length < 10) {
      intervalId = setInterval(() => {
        // 10% chance every 30 seconds to add a notification
        const shouldAddNotification = Math.random() < 0.1;
        
        if (shouldAddNotification) {
          const demoNotifications = [
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
            },
            {
              type: 'bill_reminder' as const,
              title: 'Subscription Reminder',
              message: 'Netflix subscription ₹649 will auto-renew in 3 days.',
              isUrgent: false,
              icon: '📺'
            },
            {
              type: 'ai_insight' as const,
              title: 'Savings Opportunity',
              message: 'You could save ₹150 monthly by switching to a different mobile plan.',
              isUrgent: false,
              icon: '📱'
            }
          ];
          
          const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)];
          addNotification(randomNotification);
        }
      }, 30000); // Check every 30 seconds
    }

    // Cleanup interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [addNotification, notifications.length]);

  // Cleanup old notifications (older than 30 days)
  useEffect(() => {
    const cleanupOldNotifications = () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      setNotifications(prev => 
        prev.filter(notification => notification.timestamp > thirtyDaysAgo)
      );
    };

    // Run cleanup on mount and then daily
    cleanupOldNotifications();
    const cleanupInterval = setInterval(cleanupOldNotifications, 24 * 60 * 60 * 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

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