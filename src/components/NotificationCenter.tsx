import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Bell, Check, CheckCheck, X, Trash2, Settings, Sparkles } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter = ({ className }: NotificationCenterProps) => {
  const { notifications, markAsRead, dismissNotification, unreadCount, markAllAsRead, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [animatingNotifications, setAnimatingNotifications] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Add bubble animation for new notifications
  useEffect(() => {
    const newNotifications = notifications.filter(n => !n.isRead && !animatingNotifications.has(n.id));
    
    if (newNotifications.length > 0) {
      const newIds = new Set(animatingNotifications);
      newNotifications.forEach(notification => {
        newIds.add(notification.id);
        
        // Remove animation after 3 seconds
        setTimeout(() => {
          setAnimatingNotifications(prev => {
            const updated = new Set(prev);
            updated.delete(notification.id);
            return updated;
          });
        }, 3000);
      });
      
      setAnimatingNotifications(newIds);
    }
  }, [notifications, animatingNotifications]);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast({
      title: "Marked as Read",
      description: "Notification has been marked as read",
    });
  };

  const handleDismiss = (id: string) => {
    dismissNotification(id);
    toast({
      title: "Notification Dismissed",
      description: "Notification has been removed",
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: "All Marked as Read",
      description: `${unreadCount} notifications marked as read`,
    });
  };

  const handleClearAll = () => {
    clearAll();
    toast({
      title: "All Notifications Cleared",
      description: "All notifications have been removed",
    });
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'budget_alert':
        return '⚠️';
      case 'bill_reminder':
        return '📋';
      case 'ai_insight':
        return '💡';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string, isUrgent: boolean) => {
    if (isUrgent) return 'border-red-200 bg-red-50';
    
    switch (type) {
      case 'budget_alert':
        return 'border-orange-200 bg-orange-50';
      case 'bill_reminder':
        return 'border-blue-200 bg-blue-50';
      case 'ai_insight':
        return 'border-purple-200 bg-purple-50';
      case 'system':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-white';
    }
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

  // Separate AI insights from regular notifications
  const aiInsights = notifications.filter(n => n.type === 'ai_insight');
  const regularNotifications = notifications.filter(n => n.type !== 'ai_insight');

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "relative p-2 hover:bg-gray-100 transition-colors",
            className
          )}
        >
          <Bell className={cn(
            "h-5 w-5 transition-all duration-300",
            unreadCount > 0 && "animate-pulse text-orange-600"
          )} />
          
          {unreadCount > 0 && (
            <Badge 
              className={cn(
                "absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 animate-bounce",
                unreadCount > 99 && "text-[10px]"
              )}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-96 max-h-[600px] p-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DropdownMenuLabel className="text-lg font-semibold p-0">
              Notifications
            </DropdownMenuLabel>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {/* AI Insights Section */}
              {aiInsights.length > 0 && (
                <>
                  <div className="flex items-center space-x-2 px-2 py-1">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">AI Insights</span>
                  </div>
                  
                  {aiInsights.map((notification) => (
                    <Card 
                      key={notification.id}
                      className={cn(
                        "transition-all duration-300 hover:shadow-md cursor-pointer",
                        getNotificationColor(notification.type, notification.isUrgent),
                        !notification.isRead && "ring-2 ring-purple-200",
                        animatingNotifications.has(notification.id) && "animate-pulse scale-105"
                      )}
                      onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-sm text-gray-900 truncate">
                                  {notification.title}
                                </h4>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                {notification.actionUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-purple-600 hover:text-purple-700 p-1 h-auto"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = notification.actionUrl!;
                                    }}
                                  >
                                    View Details
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="p-1 h-auto hover:bg-purple-100"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDismiss(notification.id);
                              }}
                              className="p-1 h-auto hover:bg-red-100 text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {regularNotifications.length > 0 && (
                    <Separator className="my-3" />
                  )}
                </>
              )}

              {/* Regular Notifications */}
              {regularNotifications.length > 0 && (
                <>
                  {aiInsights.length > 0 && (
                    <div className="flex items-center space-x-2 px-2 py-1">
                      <Bell className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">General Notifications</span>
                    </div>
                  )}
                  
                  {regularNotifications.map((notification) => (
                    <Card 
                      key={notification.id}
                      className={cn(
                        "transition-all duration-300 hover:shadow-md cursor-pointer",
                        getNotificationColor(notification.type, notification.isUrgent),
                        !notification.isRead && "ring-2 ring-orange-200",
                        animatingNotifications.has(notification.id) && "animate-pulse scale-105"
                      )}
                      onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-sm text-gray-900 truncate">
                                  {notification.title}
                                </h4>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                                )}
                                {notification.isUrgent && (
                                  <Badge variant="destructive\" className="text-xs">
                                    Urgent
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                {notification.actionUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-orange-600 hover:text-orange-700 p-1 h-auto"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = notification.actionUrl!;
                                    }}
                                  >
                                    View Details
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="p-1 h-auto hover:bg-orange-100"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDismiss(notification.id);
                              }}
                              className="p-1 h-auto hover:bg-red-100 text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <DropdownMenuSeparator />
        <div className="p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={() => {
              setIsOpen(false);
              window.location.href = '/notifications';
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Notification Settings
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;