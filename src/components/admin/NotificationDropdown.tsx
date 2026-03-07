import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Package, ShoppingCart, X, Check } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import type { Notification } from '../../context/NotificationContext';

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications, removeNotification } = useNotifications();
  const [open, setOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.notification-dropdown')) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_order':
        return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case 'low_stock':
        return <Package className="h-4 w-4 text-amber-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'new_order':
        return 'bg-blue-50 border-blue-200';
      case 'low_stock':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative notification-dropdown">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              aria-hidden
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full z-50 mt-2 w-96 rounded-2xl border border-gray-200 bg-white shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsRead()}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={() => clearNotifications()}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-900">No notifications</p>
                    <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 transition-colors hover:bg-gray-50 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="rounded-lg p-1 text-blue-600 hover:bg-blue-100"
                                title="Mark as read"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="rounded-lg p-1 text-red-600 hover:bg-red-100"
                              title="Remove notification"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-gray-100 p-3">
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
